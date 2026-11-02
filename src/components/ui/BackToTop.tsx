"use client";

import React from 'react';

const R = 25;
const CIRC = 2 * Math.PI * R;

// Кнопка «наверх» с кольцом, которое заполняется по мере прокрутки страницы
export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ringRef = React.useRef<SVGCircleElement>(null);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setIsVisible(window.scrollY > 400);
      ringRef.current?.setAttribute('stroke-dashoffset', String(CIRC * (1 - progress)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      aria-label="Наверх"
      onClick={handleClick}
      className={`mx-top ${isVisible ? 'is-visible' : ''}`}
    >
      <svg className="mx-ring" viewBox="0 0 54 54" aria-hidden="true">
        <circle cx="27" cy="27" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
        <circle
          ref={ringRef}
          cx="27"
          cy="27"
          r={R}
          fill="none"
          stroke="#cbf23d"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC}
        />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="relative h-5 w-5">
        <path d="M12 4l-7 7h4v7h6v-7h4z" />
      </svg>
    </button>
  );
};
