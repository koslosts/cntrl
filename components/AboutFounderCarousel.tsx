import { FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Cormorant_Garamond } from 'next/font/google';
import localFont from 'next/font/local';
import styles from './AboutFounderCarousel.module.css';

// Self-hosted via next/font instead of relying on the page's own font
// loading, since that appears to register fonts under a hashed family name
// that a literal `font-family: 'Cormorant Garamond'` doesn't match.
// CAVEAT: Google's Cormorant Garamond may not ship Cyrillic glyphs -- if the
// Ukrainian quote text still falls back to a system serif after this change,
// we need actual font files (next/font/local) instead of next/font/google.
// Both weights loaded so CSS can switch between them per breakpoint (300 on
// desktop, 600 -- slightly bolder -- on mobile only, see `.quote` in the CSS
// module).
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '600'],
  style: 'italic',
  display: 'swap',
});

// Self-hosted and applied to .root for both desktop and mobile (see the CSS
// module), instead of relying on the page's own "e-ukraine" loading -- that
// was found to fail site-wide on mobile (a Control-platform issue), and
// using the same self-hosted font on desktop too keeps both breakpoints
// visually consistent. Exposed as a CSS variable rather than applied via
// className directly, since .root also needs plain CSS for other rules.
const eUkraineUltraLight = localFont({
  src: '../fonts/eUkraineUltraLight.otf',
  weight: '400',
  variable: '--font-e-ukraine-ultralight',
  display: 'swap',
});


type TextBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string };

type Slide =
  | { kind: 'intro'; heading?: string; blocks: TextBlock[]; cta: string }
  | { kind: 'photo-text'; heading?: string; paragraphs: string[]; photoSrc?: string; photoAlt: string; photoPosition?: 'left' | 'right'; photoObjectPosition?: string }
  | { kind: 'columns'; heading?: string; blocks: TextBlock[]; singleColumn?: boolean }
  | { kind: 'photo-only'; photoSrc: string; photoAlt: string };

const MOBILE_BREAKPOINT = '(max-width: 768px)';

// Mobile keeps its own closing photo (the book-and-key shot from slide 2),
// since the portrait that closes the desktop deck is hidden on mobile along
// with the other in-slide photos.
const MOBILE_CLOSING_SLIDE: Slide = {
  kind: 'photo-only',
  photoSrc: '/51.jpg',
  photoAlt: 'The Key',
};

const SLIDES: Slide[] = [
  {
    kind: 'intro',
    blocks: [
      {
        type: 'paragraph',
        text: 'Сьогодні англійська для мене — це не лише навичка чи професійний інструмент, а те, що робить життя ширшим. Можливість читати в оригіналі й слухати людей, чиї ідеї надихають. Вільно рухатися між культурами, країнами та професійними середовищами. Знаходити відповіді там, де вони народжуються, не чекаючи на переклад.',
      },
      {
        type: 'paragraph',
        text: 'Англійська давно перестала бути окремим завданням і стала частиною повсякдення — такою ж природною, як ранкова кава, улюблений подкаст за кермом чи вечір із книгою біля каміна.',
      },
      {
        type: 'quote',
        text: 'Тиха розкіш — не те, що потрібно демонструвати іншим. А те, що непомітно розширює простір свободи у власному житті.',
      },
      {
        type: 'paragraph',
        text: 'І хоча зараз у мене є той самий ключ, який відкриває двері у світ, де англійська стає природною складовою життя без виснаження і стресу, — так було не завжди.',
      },
    ],
    cta: 'Читати історію повністю',
  },
  {
    kind: 'photo-text',
    paragraphs: [
      'Моє знайомство з англійською почалося в п’ять років, коли мама запросила для мене вчителя. Я досі пам’ятаю це відчуття цікавості та легкості, з яким чекала кожного заняття.',
      'Пізніше були школа, університет і знайомий багатьом досвід, коли навчання асоціюється не з відкриттями, а з вимогами й внутрішньою напругою. Саме тоді мене зацікавило питання: чому одні люди навчаються із задоволенням, а інші швидко втрачають мотивацію?',
      'У пошуках відповіді я занурилася у вивчення психофізіології, роботи мозку й процесів навчання на різних етапах життя. Спостерігаючи за дітьми, я бачила, як природно вони взаємодіють із мовою: не бояться помилок, не переживають через рівень і не відкладають практику до кращих часів.',
    ],
    photoSrc: '/51.jpg',
    photoAlt: 'Засновник на початку шляху',
    photoObjectPosition: 'center',
  },
  {
    kind: 'columns',
    blocks: [
      { type: 'paragraph', text: 'Коли я зрозуміла, що найкращим часом для мови є раннє дитинство, моїм першим кроком стало створення школи для дітей Richmond Child Early English at Home. Але згодом саме батьки наших юних студентів сформували для мене новий масштабний виклик. Вони хотіли вивчати мову з таким же інтересом, комфортом, вибором і впевненістю, як їхні діти.' },
      { type: 'paragraph', text: 'Чотири базові принципи будь-якого успішного навчання з довгостроковими результатами — це Комфорт, Впевненість, Цікавість і Вибір.' },
      { type: 'paragraph', text: 'Одного разу наш клієнт сказав мені: «Іванно, англійська потрібна мені щодня. Але від самої думки про чергове навчання я вже втомився». І в цій фразі було набагато більше правди, ніж здається. Саме тоді народилася концепція персонального мовного супроводу The Key.' },
    ],
  },
  // Closing slide: photo only, since the text that used to sit beside it moved
  // into the two-column slide above.
  {
    kind: 'photo-only',
    photoSrc: '/38.jpg',
    photoAlt: 'Іванна Кучеренко',
  },
];

const INTRO_CTA = SLIDES[0].kind === 'intro' ? SLIDES[0].cta : '';

// Mobile-only: the desktop intro's opening paragraph is too tall for the fixed
// mobile section, so it is condensed and the "частиною повсякдення" paragraph
// is dropped -- same trade-off this slide has always made on mobile.
const MOBILE_SLIDE_1: Slide = {
  kind: 'intro',
  blocks: [
    {
      type: 'paragraph',
      text: 'Сьогодні англійська для мене — це не лише навичка чи професійний інструмент, а те, що робить життя ширшим. Можливість читати в оригіналі, вільно рухатися між культурами й знаходити відповіді там, де вони народжуються, не чекаючи на переклад.',
    },
    {
      type: 'quote',
      text: 'Тиха розкіш — не те, що потрібно демонструвати іншим. А те, що непомітно розширює простір свободи у власному житті.',
    },
    {
      type: 'paragraph',
      text: 'І хоча зараз у мене є той самий ключ, який відкриває двері у світ, де англійська стає природною складовою життя без виснаження і стресу, — так було не завжди.',
    },
  ],
  cta: 'Читати історію повністю',
};

export const AboutFounderCarousel: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT);
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const activeSlides = useMemo(
    () =>
      isMobile
        ? [MOBILE_SLIDE_1, SLIDES[1], SLIDES[2], MOBILE_CLOSING_SLIDE]
        : SLIDES,
    [isMobile]
  );

  // All slides share one flex row (the sliding filmstrip), so without this
  // .viewport would stay as tall as the tallest slide even while showing a
  // much shorter one, leaving the arrows/CTA stranded far below the visible
  // text. Measuring the active slide directly and setting .viewport's height
  // explicitly keeps it snug to whatever is actually on screen.
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [viewportHeight, setViewportHeight] = useState<number>();

  const measureHeight = useCallback(() => {
    const el = slideRefs.current[activeIndex];
    if (el) setViewportHeight(el.scrollHeight);
  }, [activeIndex]);

  useLayoutEffect(() => {
    measureHeight();
  }, [measureHeight, activeSlides]);

  useEffect(() => {
    window.addEventListener('resize', measureHeight);
    return () => window.removeEventListener('resize', measureHeight);
  }, [measureHeight]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), activeSlides.length - 1));
  }, [activeSlides.length]);

  const handlePrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const handleNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePrev, handleNext]);

  // Swipe (mobile): active on every slide, including the intro.
  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD_PX = 40;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX < 0) handleNext();
    else handlePrev();
  }, [handleNext, handlePrev]);

  return (
    <div className={`${styles.root} ${eUkraineUltraLight.variable}`}>
      <div
        className={styles.viewport}
        style={viewportHeight ? { height: viewportHeight } : undefined}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={styles.track}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {activeSlides.map((slide, i) => (
            <div
              className={styles.slide}
              key={i}
              aria-hidden={i !== activeIndex}
              ref={(el) => { slideRefs.current[i] = el; }}
            >
              {slide.kind === 'intro' && (
                <div className={styles.intro}>
                  {slide.heading && <h3 className={styles.heading}>{slide.heading}</h3>}
                  {slide.blocks.map((block, bi) =>
                    block.type === 'quote' ? (
                      <blockquote key={bi} className={`${styles.quote} ${cormorantGaramond.className}`}>{block.text}</blockquote>
                    ) : (
                      <p key={bi} className={styles.paragraph}>{block.text}</p>
                    )
                  )}
                </div>
              )}

              {slide.kind === 'photo-text' && (
                <div className={styles.photoText}>
                  <div className={slide.photoPosition === 'right' ? styles.photoWrapperRight : styles.photoWrapper}>
                    {slide.photoSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className={styles.photo}
                        src={slide.photoSrc}
                        alt={slide.photoAlt}
                        style={slide.photoObjectPosition ? { objectPosition: slide.photoObjectPosition } : undefined}
                      />
                    ) : (
                      <div className={styles.photoPlaceholder} role="img" aria-label={slide.photoAlt} />
                    )}
                  </div>
                  <div className={slide.photoPosition === 'right' ? styles.photoTextContentRight : styles.photoTextContent}>
                    {slide.heading && <h3 className={styles.heading}>{slide.heading}</h3>}
                    {slide.paragraphs.map((p, pi) => (
                      <p key={pi} className={styles.paragraph}>{p}</p>
                    ))}
                  </div>
                </div>
              )}

              {slide.kind === 'columns' && (
                <div className={slide.singleColumn ? styles.columnsSingle : styles.columns}>
                  {slide.heading && <h3 className={styles.columnsHeading}>{slide.heading}</h3>}
                  {slide.blocks.map((block, bi) =>
                    block.type === 'quote' ? (
                      <blockquote key={bi} className={`${styles.quote} ${cormorantGaramond.className}`}>{block.text}</blockquote>
                    ) : (
                      <p key={bi} className={styles.paragraph}>{block.text}</p>
                    )
                  )}
                </div>
              )}

              {slide.kind === 'photo-only' && (
                <div className={styles.photoOnlyRow}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.photoOnly} src={slide.photoSrc} alt={slide.photoAlt} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.arrows}>
        <button
          type="button"
          className={activeIndex === 0 ? `${styles.arrowButton} ${styles.arrowButtonHidden}` : styles.arrowButton}
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label="Попередній блок"
        >
          &#8592;
        </button>
        {/* Hidden on the intro slide too -- the CTA there already carries its
            own arrow, so a second one would be redundant. */}
        {activeIndex > 0 && activeIndex < activeSlides.length - 1 && (
          <button
            type="button"
            className={styles.arrowButton}
            onClick={handleNext}
            aria-label="Наступний блок"
          >
            &#8594;
          </button>
        )}

        {activeIndex === 0 && (
          <div className={styles.ctaRow}>
            <button type="button" className={styles.ctaLink} onClick={() => goTo(1)}>
              {INTRO_CTA} <span aria-hidden="true">&#8594;</span>
            </button>
          </div>
        )}
      </div>

      {activeIndex >= 1 && (
        <div className={styles.dots}>
          {activeSlides.slice(1).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${activeIndex === i + 1 ? styles.dotActive : ''}`}
              onClick={() => goTo(i + 1)}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
