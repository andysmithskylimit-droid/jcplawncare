import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '../lib/motion';

export default function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);
  return (
    <div className="sprog" aria-hidden="true">
      <span ref={bar} />
    </div>
  );
}
