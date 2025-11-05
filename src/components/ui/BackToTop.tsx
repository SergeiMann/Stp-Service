"use client";

import React from 'react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      aria-label="Наверх"
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-[9999] inline-flex items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      style={{ width: 48, height: 48 }}
    >
      {/* стрелка вверх */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
      >
        <path d="M12 4l-7 7h4v7h6v-7h4z" />
      </svg>
    </button>
  );
};


