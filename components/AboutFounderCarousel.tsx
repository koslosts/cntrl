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
  | { kind: 'photo-text'; heading?: string; paragraphs: string[]; photoSrc?: string; photoAlt: string; photoPosition?: 'left' | 'right'; photoObjectPosition?: string; emphasisLast?: boolean }
  | { kind: 'columns'; heading?: string; blocks: TextBlock[]; singleColumn?: boolean }
  | { kind: 'photo-only'; photoSrc: string; photoAlt: string };

const MOBILE_BREAKPOINT = '(max-width: 768px)';

// Mobile-only: appended as its own swipeable slide after the last desktop
// slide (not stacked inside slide 4's text) -- reuses slide 2's photo.
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
        text: 'Сьогодні англійська для мене — це не просто навичка, а те, що робить життя значно ширшим. Можливість читати в оригіналі, вільно рухатися між культурами й знаходити відповіді там, де вони народжуються, а не чекати на переклад.',
      },
      {
        type: 'paragraph',
        text: 'Вона давно перестала бути окремим завданням та стала частиною повсякдення — такою ж природною, як ранкова кава, улюблений подкаст за кермом чи книга біля каміну наприкінці дня.',
      },
      {
        type: 'quote',
        text: 'Тиха розкіш — не те, що потрібно демонструвати іншим. А те, що непомітно розширює простір свободи у власному житті.',
      },
      {
        type: 'paragraph',
        text: 'Проте я добре пам’ятаю, що до такого відчуття приходять не через силу волі чи ідеальну дисципліну. І хоча зараз у мене є той самий ключ, який відкриває двері у світ, де англійська стає природною частиною життя без виснаження і стресу... так було не завжди.',
      },
    ],
    cta: 'Читати історію повністю',
  },
  {
    kind: 'photo-text',
    paragraphs: [
      'Моє знайомство з англійською почалося дуже рано. Мені було п’ять років, коли мама запросила для мене викладача. Я досі пам’ятаю це відчуття зацікавленості та легкості, з яким чекала кожного заняття.',
      'Пізніше були школа, університет і знайомий досвід, коли навчання починає асоціюватися з вимогами й напругою. Саме тоді мене зацікавило питання: чому одні навчаються із задоволенням, а інші, маючи не менші здібності, швидко втрачають мотивацію?',
      'У пошуках відповіді я занурилася у вивчення психофізіології. Спостерігаючи за дітьми, я бачила, як природно вони входять у мову. Вони не бояться помилок, не переживають через рівень і не відкладають практику — вони просто взаємодіють зі світом.',
    ],
    photoSrc: '/51.jpg',
    photoAlt: 'Засновник на початку шляху',
    photoObjectPosition: 'center',
  },
  {
    kind: 'columns',
    blocks: [
      { type: 'paragraph', text: 'На цій філософії занурення я створила Richmond Child Early English at home — школу англійської для дітей. Але діти поставили переді мною інше питання: що потрібно змінити, аби успішні, зайняті люди також могли повертати собі цю легкість і навчатися без зайвого напруження?' },
      { type: 'paragraph', text: 'З роками я помітила чітку закономірність. Топменеджери, підприємці та лідери думок часто скаржилися на одне й те саме: брак часу, відсутність регулярності та нескінченні спроби почати спочатку.' },
      { type: 'paragraph', text: '«Мені потрібна англійська, але я не хочу перетворювати своє життя на ще один марафон самовдосконалення» — це фраза, яку я чула найчастіше від своїх зайнятих клієнтів.' },
      { type: 'paragraph', text: '«Ці люди успішно реалізовували масштабні проєкти, керували компаніями й запускали бізнеси. Проблема була не у відсутності здібностей чи сили волі, а у форматі».' },
      { type: 'paragraph', text: 'Більшість навчальних програм вимагають від дорослих людей поводитися так, ніби вони мають нескінченний запас часу, уваги та енергії. Але реальне життя влаштоване інакше. Одного разу наш клієнт сказав:' },
      { type: 'quote', text: '«Іванно, англійська потрібна мені щодня. Але від самої думки про чергове навчання я вже втомився».' },
      { type: 'paragraph', text: 'І в цій фразі було набагато більше правди, ніж здається на перший погляд.' },
    ],
  },
  {
    kind: 'photo-text',
    paragraphs: [
      'Саме тоді почала формуватися ідея The Key — спроба відповісти на запитання: як має виглядати навчання для людини з насиченим життям?',
      'Мені хотілося створити формат, де англійська не конкурує з роботою чи відпочинком і не вимагає постійно «знаходити час», а враховує реальний ритм людини.',
      'Поступово підхід запрацював — зникла напруга, з’явилися комфорт, цікавість і вибір. З’явився простір для розвитку, а мова стала тихою розкішшю.',
      'Запрошую Вас отримати свій персональний ключ.',
    ],
    photoSrc: '/38.jpg',
    photoAlt: 'Іванна Кучеренко',
    photoPosition: 'right',
    emphasisLast: true,
  },
];

const INTRO_CTA = SLIDES[0].kind === 'intro' ? SLIDES[0].cta : '';

// Mobile-only: shorter than SLIDES[0]'s first paragraph, which was lengthened
// for desktop only.
const MOBILE_SLIDE_1: Slide = {
  kind: 'intro',
  blocks: [
    {
      type: 'paragraph',
      text: 'Сьогодні англійська для мене — це не просто навичка, а те, що робить життя значно ширшим. Можливість читати в оригіналі, вільно рухатися між культурами й знаходити відповіді там, де вони народжуються, а не чекати на переклад. Вона стала природною частиною повсякденності — як ранкова кава чи улюблений подкаст за кермом.',
    },
    {
      type: 'quote',
      text: 'Тиха розкіш — не те, що потрібно демонструвати іншим. А те, що непомітно розширює простір свободи у власному житті.',
    },
    {
      type: 'paragraph',
      text: 'Проте я добре пам’ятаю, що до такого відчуття приходять не через силу волі чи ідеальну дисципліну. І хоча зараз у мене є той самий ключ, який відкриває двері у світ, де англійська стає природною частиною життя без виснаження і стресу... так було не завжди.',
    },
  ],
  cta: 'Читати історію повністю',
};

// Mobile-only: slide 3 (SLIDES[2]) is too dense for a single mobile screen,
// so it splits into two -- matching the desktop's left/right column split.
const MOBILE_SLIDE_3A: Slide = {
  kind: 'columns',
  blocks: [
    { type: 'paragraph', text: 'На цій філософії занурення я створила Richmond Child Early English at home — школу англійської для дітей. Але діти поставили переді мною інше питання: що потрібно змінити, аби успішні, зайняті люди також могли повертати собі цю легкість і навчатися без зайвого напруження?' },
    { type: 'paragraph', text: 'З роками я помітила чітку закономірність. Топменеджери, підприємці та лідери думок часто скаржилися на одне й те саме: брак часу, відсутність регулярності та нескінченні спроби почати спочатку.' },
    { type: 'paragraph', text: '«Мені потрібна англійська, але я не хочу перетворювати своє життя на ще один марафон самовдосконалення» — це фраза, яку я чула найчастіше від своїх зайнятих клієнтів.' },
  ],
};

const MOBILE_SLIDE_3B: Slide = {
  kind: 'columns',
  blocks: [
    { type: 'paragraph', text: '«Ці люди успішно реалізовували масштабні проєкти, керували компаніями й запускали бізнеси. Проблема була не у відсутності здібностей чи сили волі, а у форматі».' },
    { type: 'paragraph', text: 'Більшість навчальних програм вимагають від дорослих людей поводитися так, ніби вони мають нескінченний запас часу, уваги та енергії. Але реальне життя влаштоване інакше. Одного разу наш клієнт сказав:' },
    { type: 'quote', text: '«Іванно, англійська потрібна мені щодня. Але від самої думки про чергове навчання я вже втомився».' },
    { type: 'paragraph', text: 'І в цій фразі було набагато більше правди, ніж здається на перший погляд.' },
  ],
};

// Mobile-only: mirrors SLIDES[3] in full.
const MOBILE_SLIDE_5: Slide = {
  kind: 'photo-text',
  paragraphs: [
    'Саме тоді почала формуватися ідея The Key — спроба відповісти на запитання: як має виглядати навчання для людини з насиченим життям?',
    'Мені хотілося створити формат, де англійська не конкурує з роботою чи відпочинком і не вимагає постійно «знаходити час», а враховує реальний ритм людини.',
    'Поступово підхід запрацював — зникла напруга, з’явилися комфорт, цікавість і вибір. З’явився простір для розвитку, а мова стала тихою розкішшю.',
    'Запрошую Вас отримати свій персональний ключ.',
  ],
  photoSrc: '/38.jpg',
  photoAlt: 'Іванна Кучеренко',
  photoPosition: 'right',
  emphasisLast: true,
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
        ? [MOBILE_SLIDE_1, SLIDES[1], MOBILE_SLIDE_3A, MOBILE_SLIDE_3B, MOBILE_SLIDE_5, MOBILE_CLOSING_SLIDE]
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
                      <p
                        key={pi}
                        className={
                          slide.emphasisLast && pi === slide.paragraphs.length - 1
                            ? `${styles.paragraph} ${styles.paragraphEmphasis}`
                            : styles.paragraph
                        }
                      >
                        {p}
                      </p>
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
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.photoOnly} src={slide.photoSrc} alt={slide.photoAlt} />
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
        {activeIndex < activeSlides.length - 1 && (
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
