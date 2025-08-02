import { useState, useEffect } from "react";

export const useScrollDirection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollPos = window.scrollY;
          const isScrollingUp = prevScrollPos > currentScrollPos;
          const isAtTop = currentScrollPos < 10;
          const scrollDifference = Math.abs(currentScrollPos - prevScrollPos);

          // Only update if there's significant scroll movement (prevents jittery behavior)
          if (scrollDifference > 5) {
            setIsVisible(isScrollingUp || isAtTop);
            setPrevScrollPos(currentScrollPos);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return isVisible;
};
