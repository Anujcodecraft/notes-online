import { useState, useEffect, useRef } from "react";

export const useContentHeight = (bgColor = "rgb(249, 250, 251)") => {
  // Default to gray-50
  const [shouldScroll, setShouldScroll] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const navbarHeight = 64;
        const contentHeight = contentRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        const availableHeight = viewportHeight - navbarHeight;

        const needsScroll = contentHeight > availableHeight;
        setShouldScroll(needsScroll);

        // Control body scroll and background
        document.body.style.overflowY = needsScroll ? "auto" : "hidden";
        document.body.style.backgroundColor = bgColor;
      }
    };

    // Initial check with a slight delay to ensure content is rendered
    setTimeout(checkOverflow, 0);

    // Create observer for content changes
    const observer = new ResizeObserver(checkOverflow);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    // Check on window resize
    window.addEventListener("resize", checkOverflow);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkOverflow);
      observer.disconnect();
      document.body.style.overflowY = "auto"; // Reset scroll on unmount
      // Don't reset background color as next page will set its own
    };
  }, [bgColor]);

  return { contentRef, shouldScroll };
};
