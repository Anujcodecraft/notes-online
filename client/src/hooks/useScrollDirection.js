import { useState, useEffect } from "react";

export const useScrollDirection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos > currentScrollPos;
      const isAtTop = currentScrollPos < 10;

      setIsVisible(isScrollingUp || isAtTop);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return isVisible;
};
