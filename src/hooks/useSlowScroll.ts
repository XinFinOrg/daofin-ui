import { useEffect, useRef } from 'react';

const useSlowScroll = (multiplier = 0.4) => {
  const scrollRef = useRef({
    targetScroll: 0,
    currentScroll: 0,
    requestId: null,
  });

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current.targetScroll = window.scrollY;
      if (!scrollRef.current.requestId) {
        scrollRef.current.requestId = requestAnimationFrame(smoothScroll);
      }
    };

    const smoothScroll = () => {
      const { targetScroll, currentScroll } = scrollRef.current;
      const distance = targetScroll - currentScroll;
      if (Math.abs(distance) > 1) {
        scrollRef.current.currentScroll += distance * multiplier;
        window.scrollTo(0, scrollRef.current.currentScroll);
        scrollRef.current.requestId = requestAnimationFrame(smoothScroll);
      } else {
        scrollRef.current.requestId = null;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRef.current.requestId) {
        cancelAnimationFrame(scrollRef.current.requestId);
      }
    };
  }, [multiplier]);
};

export default useSlowScroll;
