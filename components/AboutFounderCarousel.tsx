import { FC, useCallback, useEffect, useState } from 'react';
import styles from './AboutFounderCarousel.module.css';

type TextColumn = {
  heading?: string;
  paragraphs: string[];
};

type Slide =
  | { kind: 'intro'; heading?: string; paragraphs: string[]; quote?: string; cta: string }
  | { kind: 'photo-text'; heading?: string; paragraphs: string[]; photoSrc?: string; photoAlt: string }
  | { kind: 'columns'; columns: [TextColumn, TextColumn] };

// TODO: replace placeholder copy/photo with real content from the founder's story.
// heading left empty by default -- the section already renders its own title natively;
// set it only if this slide needs a title of its own.
const SLIDES: Slide[] = [
  {
    kind: 'intro',
    paragraphs: [
      'Коротка версія історії засновника, яка зʼявляється одразу на сторінці.',
    ],
    quote: 'Виділена курсивна цитата (опційно) — залиш quote: undefined, якщо вона не потрібна на цьому слайді.',
    cta: 'Читати історію повністю',
  },
  {
    kind: 'photo-text',
    heading: 'Початок шляху',
    paragraphs: [
      'Текст другого блоку — фото і опис ключового моменту історії.',
    ],
    // TODO: photoSrc not set yet -- renders a black placeholder rectangle until the real photo is added.
    photoAlt: 'Засновник на початку шляху',
  },
  {
    kind: 'columns',
    columns: [
      { heading: 'Розвиток', paragraphs: ['Перша колонка тексту третього блоку.'] },
      { heading: 'Виклики', paragraphs: ['Друга колонка тексту третього блоку.'] },
    ],
  },
  {
    kind: 'columns',
    columns: [
      { heading: 'Сьогодні', paragraphs: ['Перша колонка тексту четвертого блоку.'] },
      { heading: 'Плани', paragraphs: ['Друга колонка тексту четвертого блоку.'] },
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
    <div className={styles.root}>
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
                  {slide.paragraphs.map((p, pi) => (
                    <p key={pi} className={styles.paragraph}>{p}</p>
                  ))}
                  {slide.quote && <blockquote className={styles.quote}>{slide.quote}</blockquote>}
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
                  {slide.columns.map((col, ci) => (
                    <div className={styles.column} key={ci}>
                      {col.heading && <h4 className={styles.columnHeading}>{col.heading}</h4>}
                      {col.paragraphs.map((p, pi) => (
                        <p key={pi} className={styles.paragraph}>{p}</p>
                      ))}
                    </div>
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
