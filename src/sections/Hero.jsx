import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { company, hero } from '../data/content';
import Magnetic from '../components/Magnetic';
import { requestQuote } from '../lib/quote';
import ButtonLabel from '../components/ButtonLabel';

export default function Hero({ ready }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const sceneRef = useRef(null);
  const barRef = useRef(null);
  const pctRef = useRef(null);
  const [glFailed, setGlFailed] = useState(false);

  // Three.js lawn, loaded as its own chunk so the page paints first.
  useEffect(() => {
    let disposed = false;
    let scene = null;
    let io = null;

    import('../three/LawnScene.js')
      .then(({ LawnScene }) => {
        if (disposed || !canvasRef.current) return;
        try {
          scene = new LawnScene(canvasRef.current, {
            reducedMotion: prefersReducedMotion,
            onError: () => setGlFailed(true),
          });
          sceneRef.current = scene;
          io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? scene.start() : scene.stop()), {
            threshold: 0,
          });
          io.observe(sectionRef.current);
        } catch (err) {
          console.warn('[JCP] WebGL lawn unavailable, using fallback.', err);
          setGlFailed(true);
        }
      })
      .catch(() => setGlFailed(true));

    return () => {
      disposed = true;
      io && io.disconnect();
      scene && scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Pointer parts the grass
  useEffect(() => {
    const el = sectionRef.current;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      sceneRef.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const leave = () => sceneRef.current?.clearPointer();
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  // Initial states + scroll choreography
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        gsap.set('.hero__word-i', { yPercent: 108 });
        gsap.set('.hero__intro-i', { yPercent: 110 });
        gsap.set(['.hero__lede', '.hero__actions', '.hero__meter'], { opacity: 0, y: 26 });
      }

      const updateMeter = (p) => {
        const mowed = Math.round(gsap.utils.clamp(0, 1, (p - 0.06) / 0.82) * 100);
        if (barRef.current) barRef.current.style.transform = `scaleX(${mowed / 100})`;
        if (pctRef.current) pctRef.current.textContent = `${mowed}%`;
      };

      if (prefersReducedMotion) {
        updateMeter(0.55);
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=170%',
          pin: pinRef.current,
          scrub: 0.6,
          onUpdate: (self) => {
            sceneRef.current?.setProgress(self.progress);
            updateMeter(self.progress);
          },
        },
      });
      tl.to(contentRef.current, { yPercent: -14, opacity: 0, ease: 'power1.in', duration: 0.3 }, 0)
        .to('.hero__shade', { opacity: 0.35, ease: 'none', duration: 0.4 }, 0)
        .fromTo(
          '.hero__statement-line',
          { yPercent: 70, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.09, duration: 0.24, ease: 'power2.out' },
          0.6
        )
        .to({}, { duration: 0.12 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Entrance once the preloader lifts
  useEffect(() => {
    if (!ready || prefersReducedMotion) return;
    sceneRef.current?.playIntro();
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.05 })
        .to('.hero__word-i', { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.07 })
        .to('.hero__intro-i', { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }, 0.25)
        .to(['.hero__lede', '.hero__actions', '.hero__meter'], { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1 }, 0.55);
    }, sectionRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className={`hero ${glFailed ? 'hero--fallback' : ''}`} id="top" ref={sectionRef} aria-labelledby="hero-title">
      <div className="hero__pin" ref={pinRef}>
        <div className="hero__stage" aria-hidden="true">
          <canvas className="hero__canvas" ref={canvasRef} />
        </div>
        <div className="hero__shade" aria-hidden="true" />

        <div className="hero__content container" ref={contentRef}>
          <p className="hero__intro">
            {hero.intro.map((line) => (
              <span className="hero__intro-line" key={line}>
                <span className="hero__intro-i">{line}</span>
              </span>
            ))}
          </p>

          <h1 className="hero__title" id="hero-title" aria-label={hero.titleLines.join(' ')}>
            {hero.titleLines.map((line, i) => (
              <span className="hero__line" key={i} aria-hidden="true">
                {line.split(' ').map((word, j, arr) => (
                  <span key={j}>
                    <span className="hero__word">
                      <span className="hero__word-i">{word}</span>
                    </span>
                    {j < arr.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero__lede">{hero.lede}</p>

          <div className="hero__actions">
            <Magnetic>
              <a className="btn btn--gold" href="/contact#quote" onClick={(e) => { e.preventDefault(); requestQuote(); }}>
                <ButtonLabel>Request a quote</ButtonLabel>
              </a>
            </Magnetic>
            <a className="btn btn--line" href={company.phoneHref} data-cursor="Call">
              <ButtonLabel>{`Call ${company.phoneDisplay}`}</ButtonLabel>
            </a>
          </div>
        </div>

        <p className="hero__statement" aria-hidden="true">
          {hero.statement.map((line) => (
            <span className="hero__statement-line" key={line}>
              {line}
            </span>
          ))}
        </p>

        <div className="hero__meter container" aria-hidden="true">
          <span className="hero__meter-label">{prefersReducedMotion ? 'Freshly mowed' : 'Scroll to mow'}</span>
          <span className="hero__meter-track">
            <span className="hero__meter-bar" ref={barRef} />
          </span>
          <span className="hero__meter-pct">
            <span ref={pctRef}>0%</span> mowed
          </span>
        </div>
      </div>
    </section>
  );
}
