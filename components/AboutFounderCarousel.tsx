import { FC, useCallback, useEffect, useState } from 'react';
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
  weight: '400',
  style: 'italic',
  display: 'swap',
});

// TODO: this is Regular (400), not Light (300) -- only Regular/Thin .otf
// files were provided, no Light. Swap the src for the real Light file once
// you have it; using Regular in the meantime for legibility over Thin.
const eUkraine = localFont({
  src: '../fonts/eUkraineRegular.otf',
  weight: '400',
  display: 'swap',
});

type IntroBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string };

type Slide =
  | { kind: 'intro'; heading?: string; blocks: IntroBlock[]; cta: string }
  | { kind: 'photo-text'; heading?: string; paragraphs: string[]; photoSrc?: string; photoAlt: string }
  | { kind: 'columns'; heading?: string; paragraphs: string[] };

const SLIDES: Slide[] = [
  {
    kind: 'intro',
    blocks: [
      {
        type: 'paragraph',
        text: 'Понад 15 років я працюю на перетині англійської мови, навчання та розвитку людей — від маленьких дітей до підприємців, керівників та власників бізнесів. Цей досвід навчив мене головного: успіх у навчанні рідко залежить лише від здібностей чи дисципліни. Значно частіше — від того, наскільки навчання відповідає реальному життю людини.',
      },
      {
        type: 'paragraph',
        text: 'Сьогодні англійська для мене — не навичка і не професійний інструмент. Це одна з тих речей, які роблять життя ширшим: книги мовою оригіналу, люди, чиї ідеї надихають, вільний рух між культурами та середовищами.',
      },
      {
        type: 'quote',
        text: 'Тиха розкіш — не те, що потрібно демонструвати іншим. А те, що непомітно розширює простір свободи у власному житті.',
      },
      {
        type: 'paragraph',
        text: 'Саме тому The Key створений не для студентів із вільним часом, а для дорослих, які хочуть розвиватися — але не готові жертвувати собою заради чергової цілі.',
      },
    ],
    cta: 'Читати історію повністю',
  },
  {
    kind: 'photo-text',
    heading: 'Як усе почалося',
    paragraphs: [
      'Моє знайомство з англійською почалося дуже рано. Мені було п’ять років, коли мама запросила для мене викладача. Я досі пам’ятаю це відчуття зацікавленості та легкості, з яким чекала кожного заняття.',
      'Пізніше були школа, університет, професійний розвиток і знайомий багатьом досвід, коли навчання поступово починає асоціюватися не з відкриттями, а з вимогами, оцінюванням і внутрішньою напругою. Саме тоді мене зацікавило питання, яке згодом визначило значну частину моєї професійної роботи: чому одні люди навчаються із задоволенням, а інші, маючи не менші здібності, швидко втрачають мотивацію?',
      'У пошуках відповіді я занурилася у вивчення розвитку дітей, формування мовлення, роботи мозку та процесів навчання на різних етапах життя. Спостерігаючи за дітьми, я бачила, наскільки природно вони входять у нову мову: їх не лякають помилки, вони не переживають через рівень, не відкладають практику до кращих часів. Саме тоді я створила Richmond Child — школу ранньої англійської для дітей. Але водночас діти поставили переді мною інше питання: що потрібно змінити, щоб дорослі також могли навчатися без зайвого напруження?',
    ],
    // TODO: photoSrc not set yet -- renders a black placeholder rectangle until the real photo is added.
    photoAlt: 'Засновник на початку шляху',
  },
  {
    kind: 'columns',
    heading: 'Те, чого ніхто не врахував',
    paragraphs: [
      'З роками я почала помічати закономірність. Підприємці, керівники, фахівці та власники бізнесів часто говорили про англійську однаковими словами: не вистачає часу. Не виходить бути регулярним. Занадто багато разів починав спочатку.',
      'Щоразу мене дивувало одне й те саме: ці люди успішно реалізовували складні проєкти, керували командами, запускали бізнеси. Проблема була не у відсутності здібностей. Проблема була у форматі. Більшість навчальних програм вимагали від дорослої людини поводитися так, ніби вона має нескінченний запас часу, уваги та енергії. Але реальне життя влаштоване інакше.',
      '«Іванно, англійська потрібна мені щодня. Але від самої думки про навчання я вже втомився», — сказав мені одного разу один із наших клієнтів. І в цій фразі було набагато більше правди, ніж здається на перший погляд.',
    ],
  },
  {
    kind: 'columns',
    heading: 'Навчання, яке враховує життя',
    paragraphs: [
      'Саме тоді почала формуватися ідея The Key. Не як чергової програми чи методики — а як спроба відповісти на просте запитання: як має виглядати навчання для людини, яка вже має насичене життя? Формат, де англійська не конкурує з роботою, сім’єю, відпочинком чи особистими проєктами. Формат, який не вимагає постійно «знаходити час».',
      'Поступово цей підхід почав працювати. Для когось англійська повернулася через професійні розмови, для когось — через книги та подкасти, подорожі або нові кар’єрні можливості. Але майже завжди зміни починалися в одному місці: зникала напруга. А разом із цим з’являвся простір для природного розвитку.',
      'Так народився індивідуальний мовний супровід The Key.',
    ],
  },
];

export const AboutFounderCarousel: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), SLIDES.length - 1));
  }, []);

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

  return (
    <div className={`${styles.root} ${eUkraine.className}`}>
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
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
                  <button type="button" className={styles.ctaLink} onClick={handleStart}>
                    {slide.cta} <span aria-hidden="true">&#8594;</span>
                  </button>
                </div>
              )}

              {slide.kind === 'photo-text' && (
                <div className={styles.photoText}>
                  {slide.photoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={styles.photo} src={slide.photoSrc} alt={slide.photoAlt} />
                  ) : (
                    <div className={styles.photoPlaceholder} role="img" aria-label={slide.photoAlt} />
                  )}
                  <div className={styles.photoTextContent}>
                    {slide.heading && <h3 className={styles.heading}>{slide.heading}</h3>}
                    {slide.paragraphs.map((p, pi) => (
                      <p key={pi} className={styles.paragraph}>{p}</p>
                    ))}
                  </div>
                </div>
              )}

              {slide.kind === 'columns' && (
                <div className={styles.columns}>
                  {slide.heading && <h3 className={styles.columnsHeading}>{slide.heading}</h3>}
                  {slide.paragraphs.map((p, pi) => (
                    <p key={pi} className={styles.paragraph}>{p}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {started && (
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrowButton}
            onClick={handlePrev}
            aria-label={activeIndex <= 1 ? 'Повернутись до "Читати повністю"' : 'Попередній блок'}
          >
            &#8592;
          </button>
          <button
            type="button"
            className={styles.arrowButton}
            onClick={handleNext}
            disabled={activeIndex >= SLIDES.length - 1}
            aria-label="Наступний блок"
          >
            &#8594;
          </button>
        </div>
      )}
    </div>
  );
};
