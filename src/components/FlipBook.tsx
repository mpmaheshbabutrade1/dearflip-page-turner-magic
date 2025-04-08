
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

declare global {
  interface Window {
    jQuery: typeof import('jquery');
    $: typeof import('jquery');
    dFlip: any;
  }
}

const FlipBook = () => {
  const flipBookRef = useRef<HTMLDivElement>(null);
  const flipBookInstance = useRef<any>(null);

  useEffect(() => {
    // Load jQuery
    const loadJQuery = async () => {
      const jQuery = await import('jquery');
      window.jQuery = window.$ = jQuery.default;
      
      // Load DearFlip after jQuery is available
      const dearFlipScript = document.createElement('script');
      dearFlipScript.src = 'https://cdn.jsdelivr.net/gh/dearhive/dearflip-js-flipbook/dearflip/jQuery.dearFlip.js';
      dearFlipScript.async = true;
      
      dearFlipScript.onload = () => {
        initializeFlipBook();
      };
      
      document.body.appendChild(dearFlipScript);
      
      // Load CSS
      const dearFlipCss = document.createElement('link');
      dearFlipCss.rel = 'stylesheet';
      dearFlipCss.href = 'https://cdn.jsdelivr.net/gh/dearhive/dearflip-js-flipbook/dearflip/dearflip-flipbook.css';
      document.head.appendChild(dearFlipCss);
      
      return () => {
        // Clean up
        document.body.removeChild(dearFlipScript);
        document.head.removeChild(dearFlipCss);
        if (flipBookInstance.current) {
          flipBookInstance.current.dispose();
        }
      };
    };
    
    loadJQuery();
  }, []);
  
  const initializeFlipBook = () => {
    if (!flipBookRef.current || !window.dFlip) return;
    
    flipBookInstance.current = window.dFlip(flipBookRef.current, {
      height: 500,
      webgl: true,
      autoEnableOutline: true,
      autoNavigation: true,
      autoPlay: false,
      autoPlayDuration: 3000,
      autoPlayStart: false,
      direction: 1,
      duration: 800,
      enableDownload: false,
      enableAnnotation: false,
      enableShare: false,
      htmlContent: true,
      paddingLeft: 20,
      paddingRight: 20,
      pages: [
        { src: "/samples/page1.jpg", thumb: "/samples/thumb1.jpg", title: "Cover" },
        { src: "/samples/page2.jpg", thumb: "/samples/thumb2.jpg", title: "Page 2" },
        { src: "/samples/page3.jpg", thumb: "/samples/thumb3.jpg", title: "Page 3" },
        { src: "/samples/page4.jpg", thumb: "/samples/thumb4.jpg", title: "Page 4" },
        { src: "/samples/page5.jpg", thumb: "/samples/thumb5.jpg", title: "Back Cover" }
      ],
      pdfjsWorkerSrc: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js",
      pageSize: "auto",
      sound: true,
      transparent: false,
    });
  };
  
  const handleFullscreen = () => {
    if (flipBookInstance.current) {
      flipBookInstance.current.enterFullScreen();
    }
  };
  
  const handleThumbnails = () => {
    if (flipBookInstance.current) {
      flipBookInstance.current.openThumbs();
    }
  };
  
  const handleAutoPlay = () => {
    if (flipBookInstance.current) {
      flipBookInstance.current.autoPlay();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-10">
      <h2 className="text-3xl font-bold text-center">Interactive FlipBook Demo</h2>
      <p className="text-gray-600 max-w-2xl text-center">
        Experience the magic of page turning with DearFlip. Browse through our sample book or upload your own PDF.
      </p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={handleFullscreen} variant="outline">Fullscreen</Button>
        <Button onClick={handleThumbnails} variant="outline">Thumbnails</Button>
        <Button onClick={handleAutoPlay} variant="outline">Auto Play</Button>
      </div>
      
      <Card className="w-full max-w-4xl p-2 shadow-lg">
        <div className="df-container" ref={flipBookRef} id="flipbook"></div>
      </Card>
    </div>
  );
};

export default FlipBook;
