import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Cormorant_Garamond } from 'next/font/google';
import localFont from 'next/font/local';
import styles from './AboutFounderCarousel.module.css';

// Self-hosted via next/font instead of relying on the page's own font
// loading, since that appears to register fonts under a hashed family name
// that a literal `font-family: 'Cormorant Garamond'` doesn't match.
// CAVEAT: Google's Cormorant Garamond may not ship Cyrillic glyphs -- if the
// Ukrainian quote text still falls back to a system serif after this change,
// we need actual font files (next/font/local) instead of next/font/google.
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: '300',
  style: 'italic',
  display: 'swap',
});

// Body text uses the page's own already-loaded "e-ukraine" family directly
// (set in the CSS module on .root) instead of self-hosting a copy -- an A/B
// test confirmed the ambient reference matches Control's native rendering
// on desktop. On mobile the site's own font loading was found to fail
// site-wide (a Control-platform issue, not this component's), so mobile
// self-hosts e-Ukraine UltraLight instead of depending on that. Exposed as a
// CSS variable (not applied directly) so the mobile media query in the CSS
// module can switch to it -- see `.root` there.
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
        text: 'Понад 15 років я працюю на перетині англійської мови, навчання та розвитку людей. За цей час мені пощастило супроводжувати дуже різних учнів — від маленьких дітей до підприємців, керівників, експертів та власників бізнесів.',
      },
      {
        type: 'paragraph',
        text: 'Цей досвід навчив мене важливої речі: успіх у навчанні рідко залежить лише від здібностей чи дисципліни. Значно частіше він залежить від того, наскільки навчання відповідає реальному життю людини.',
      },
      {
        type: 'quote',
        text: 'Тиха розкіш — не те, що потрібно демонструвати іншим. А те, що непомітно розширює простір свободи у власному житті.',
      },
      {
        type: 'paragraph',
        text: 'Саме тому індивідуальний мовний супровід The Key створений не для студентів, які мають багато вільного часу. Він створений для дорослих людей, які хочуть розвиватися, але не готові жертвувати собою заради чергової цілі.',
      },
    ],
    cta: 'Читати історію повністю',
  },
  {
    kind: 'photo-text',
    paragraphs: [
      'Моє знайомство з англійською почалося дуже рано. Мені було п’ять років, коли мама запросила для мене викладача. Я досі пам’ятаю це відчуття зацікавленості та легкості, з яким чекала кожного заняття.',
      'Пізніше були школа, університет, професійний розвиток і знайомий багатьом досвід, коли навчання поступово починає асоціюватися не з відкриттями, а з вимогами й внутрішньою напругою: чому одні люди навчаються із задоволенням, а інші швидко втрачають мотивацію?',
      'У пошуках відповіді я занурилася у вивчення розвитку дітей та процесів навчання. Тоді я заснувала школу Richmond Child. Спостерігаючи за дітьми, я бачила, наскільки природно вони входять у нову мову — їх не лякають помилки.',
    ],
    photoSrc: '/51.jpg',
    photoAlt: 'Засновник на початку шляху',
    photoObjectPosition: 'center',
  },
  {
    kind: 'columns',
    blocks: [
      { type: 'paragraph', text: 'Але діти поставили переді мною інше питання: що потрібно змінити, щоб дорослі теж могли навчатися без зайвого напруження?' },
      { type: 'paragraph', text: 'З роками я почала помічати закономірність. Батьки наших учнів, підприємці, керівники, фахівці, експерти та власники бізнесів часто говорили про англійську однаковими словами: не вистачає часу, не виходить бути регулярним, занадто багато разів починав спочатку.' },
      { type: 'paragraph', text: 'Мені потрібна англійська, але я не хочу перетворювати життя на ще один марафон самовдосконалення — це фраза, яку я чула найчастіше.' },
      { type: 'paragraph', text: 'Щоразу мене дивувало одне й те саме: ці люди успішно реалізовували складні проєкти, керували командами, запускали бізнеси та освоювали нові професійні сфери. Проблема була не у відсутності здібностей. Проблема була у форматі.' },
      { type: 'paragraph', text: 'Більшість навчальних програм вимагали від дорослої людини поводитися так, ніби вона має нескінченний запас часу, уваги та енергії. Але реальне життя влаштоване інакше.' },
      { type: 'paragraph', text: 'Одного разу один із наших клієнтів сказав мені:' },
      { type: 'quote', text: '«Іванно, англійська потрібна мені щодня. Але від самої думки про навчання я вже втомився».' },
      { type: 'paragraph', text: 'І в цій фразі було набагато більше правди, ніж здається на перший погляд.' },
    ],
  },
  {
    kind: 'photo-text',
    paragraphs: [
      'Саме тоді почала формуватися ідея The Key — не як чергової програми чи методики, а як спроба відповісти на просте запитання: як має виглядати навчання для людини, яка вже має насичене життя?',
      'Мені хотілося створити формат, де англійська не конкурує з роботою, сім’єю чи відпочинком — формат, який не вимагає постійно «знаходити час», а враховує реальний ритм життя людини.',
      'Поступово цей підхід почав працювати — і майже завжди зміни починалися в одному місці: зникала напруга. Так народився індивідуальний мовний супровід The Key, на який я зараз відкриваю передзапис.',
    ],
    photoSrc: '/38.jpg',
    photoAlt: 'Іванна Кучеренко',
    photoPosition: 'right',
  },
];

const INTRO_CTA = SLIDES[0].kind === 'intro' ? SLIDES[0].cta : '';

// Mobile-only: adds back a brief sentence trimmed from SLIDES[1] earlier
// (desktop stays as-is there, since that trim fixed a real overflow issue).
const MOBILE_SLIDE_2: Slide = {
  kind: 'photo-text',
  paragraphs: [
    'Моє знайомство з англійською почалося дуже рано. Мені було п’ять років, коли мама запросила для мене викладача. Я досі пам’ятаю це відчуття зацікавленості та легкості, з яким чекала кожного заняття.',
    'Пізніше були школа, університет, професійний розвиток і знайомий багатьом досвід, коли навчання поступово починає асоціюватися не з відкриттями, а з вимогами й внутрішньою напругою. Саме тоді мене зацікавило питання, яке згодом визначило значну частину моєї професійної роботи: чому одні люди навчаються із задоволенням, а інші швидко втрачають мотивацію?',
    'У пошуках відповіді я занурилася у вивчення розвитку дітей та процесів навчання. Тоді я заснувала школу Richmond Child. Спостерігаючи за дітьми, я бачила, наскільки природно вони входять у нову мову — їх не лякають помилки.',
  ],
  photoSrc: '/51.jpg',
  photoAlt: 'Засновник на початку шляху',
  photoObjectPosition: 'center',
};

// Mobile-only: slide 3 (SLIDES[2]) is too dense for a single mobile screen,
// so it splits into two, right after "Проблема була у форматі."
const MOBILE_SLIDE_3A: Slide = {
  kind: 'columns',
  blocks: [
    { type: 'paragraph', text: 'Але діти поставили переді мною інше питання: що потрібно змінити, щоб дорослі теж могли навчатися без зайвого напруження?' },
    { type: 'paragraph', text: 'З роками я почала помічати закономірність. Батьки наших учнів, підприємці, керівники, фахівці, експерти та власники бізнесів часто говорили про англійську однаковими словами: не вистачає часу, не виходить бути регулярним, занадто багато разів починав спочатку.' },
    { type: 'paragraph', text: 'Мені потрібна англійська, але я не хочу перетворювати життя на ще один марафон самовдосконалення — це фраза, яку я чула найчастіше.' },
    { type: 'paragraph', text: 'Щоразу мене дивувало одне й те саме: ці люди успішно реалізовували складні проєкти, керували командами, запускали бізнеси та освоювали нові професійні сфери. Проблема була не у відсутності здібностей. Проблема була у форматі.' },
  ],
};

const MOBILE_SLIDE_3B: Slide = {
  kind: 'columns',
  blocks: [
    { type: 'paragraph', text: 'Більшість навчальних програм вимагали від дорослої людини поводитися так, ніби вона має нескінченний запас часу, уваги та енергії. Але реальне життя влаштоване інакше.' },
    { type: 'paragraph', text: 'Одного разу один із наших клієнтів сказав мені:' },
    { type: 'quote', text: '«Іванно, англійська потрібна мені щодня. Але від самої думки про навчання я вже втомився».' },
    { type: 'paragraph', text: 'І в цій фразі було набагато більше правди, ніж здається на перший погляд.' },
    { type: 'paragraph', text: 'Саме тоді почала формуватися ідея The Key — не як чергової програми чи методики, а як спроба відповісти на просте запитання: як має виглядати навчання для людини, яка вже має насичене життя?' },
  ],
};

// Mobile-only: shorter version of SLIDES[3], since its first paragraph moved
// into MOBILE_SLIDE_3B above.
const MOBILE_SLIDE_5: Slide = {
  kind: 'photo-text',
  paragraphs: [
    'Мені хотілося створити формат, де англійська не конкурує з роботою, сім’єю чи відпочинком — формат, який не вимагає постійно «знаходити час», а враховує реальний ритм життя людини.',
    'Поступово цей підхід почав працювати — і майже завжди зміни починалися в одному місці: зникала напруга. Так народився індивідуальний мовний супровід The Key, на який я зараз відкриваю передзапис.',
  ],
  photoSrc: '/38.jpg',
  photoAlt: 'Іванна Кучеренко',
  photoPosition: 'right',
};

export const AboutFounderCarousel: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT);
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const activeSlides = isMobile
    ? [SLIDES[0], MOBILE_SLIDE_2, MOBILE_SLIDE_3A, MOBILE_SLIDE_3B, MOBILE_SLIDE_5, MOBILE_CLOSING_SLIDE]
    : SLIDES;

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), activeSlides.length - 1));
  }, [activeSlides.length]);

  const handleStart = useCallback(() => {
    setStarted(true);
    goTo(1);
  }, [goTo]);

  const handlePrev = useCallback(() => {
    if (activeIndex <= 1) {
      setStarted(false);
      goTo(0);
      return;
    }
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);
  const handleNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!started) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [started, handlePrev, handleNext]);

  // Swipe (mobile): active once started, mirroring the arrows' availability.
  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD_PX = 40;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!started) return;
    touchStartX.current = e.touches[0].clientX;
  }, [started]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!started || touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX < 0) handleNext();
    else handlePrev();
  }, [started, handleNext, handlePrev]);

  return (
    <div className={`${styles.root} ${eUkraineUltraLight.variable}`}>
      <div className={styles.viewport} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {activeSlides.map((slide, i) => (
            <div className={styles.slide} key={i} aria-hidden={i !== activeIndex}>
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
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.photoOnly} src={slide.photoSrc} alt={slide.photoAlt} />
              )}
            </div>
          ))}
        </div>
      </div>

      {started ? (
        <>
          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={handlePrev}
              aria-label={activeIndex <= 1 ? 'Повернутись до "Читати повністю"' : 'Попередній блок'}
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
          </div>
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
        </>
      ) : (
        <div className={styles.ctaRow}>
          <button type="button" className={styles.ctaLink} onClick={handleStart}>
            {INTRO_CTA} <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      )}
    </div>
  );
};
