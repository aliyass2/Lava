// global-components/imagePreview.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaSearchPlus, FaSearchMinus, FaExpand, FaCompress, FaSearch } from 'react-icons/fa';

const ImagePreview = ({ 
  src, 
  alt = "صورة",
  onClose, 
  isOpen = false, 
  thumbnailMode = false 
}) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Handle escape key and fullscreen changes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (fullScreen) {
          setFullScreen(false);
        } else if (isVisible && !thumbnailMode) {
          handleClose();
        }
      }
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setFullScreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [fullScreen, isVisible, thumbnailMode]);

  // Set initial visibility based on isOpen prop
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleFullScreen = async () => {
    if (!fullScreen) {
      try {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen();
          setFullScreen(true);
        }
      } catch (err) {
        console.error("Couldn't enter fullscreen mode:", err);
      }
    } else {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setFullScreen(false);
      } catch (err) {
        console.error("Couldn't exit fullscreen mode:", err);
      }
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleClose = () => {
    setIsVisible(false);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    if (onClose) onClose();
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    
    if (thumbnailMode) {
      setIsVisible(true);
    } else {
      if (zoomLevel !== 1) {
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
      } else {
        handleZoomIn();
      }
    }
  };

  const openFullPreview = (e) => {
    e.stopPropagation();
    if (thumbnailMode) {
      setIsVisible(true);
    }
  };

  // Generate transform style
  const transformStyle = {
    transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
    cursor: isDragging ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'default')
  };

  if (thumbnailMode) {
    return (
      <div className="relative group overflow-hidden h-32 w-32 rounded-lg border">
        <img 
          src={src} 
          alt={alt} 
          className="h-full w-full object-cover transition-transform hover:scale-105 cursor-pointer" 
          onClick={handleDoubleClick}
        />
        
        {/* Overlay appears on hover but confined to the image box */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/0 group-hover:bg-black/20 flex items-center justify-center">
          <button 
            className="p-2 bg-white/70 rounded-full hover:bg-white transition-colors"
            onClick={openFullPreview}
          >
            <FaSearch className="text-gray-800" size={12} />
          </button>
        </div>
        
        {isVisible && (
          <ImagePreview 
            src={src} 
            alt={alt} 
            isOpen={true} 
            onClose={() => setIsVisible(false)} 
          />
        )}
      </div>
    );
  }

  // Render nothing if not visible and not in thumbnail mode
  if (!isVisible && !thumbnailMode) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20"
      onClick={handleClose}
    >
      <div 
        ref={containerRef}
        className="relative max-w-full max-h-full p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image container with pan and zoom */}
        <div 
          className="overflow-hidden rounded-lg flex-1 flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full max-h-[80vh] object-contain transition-transform duration-150"
            style={transformStyle}
            onDoubleClick={handleDoubleClick}
            draggable="false"
          />
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-4 rtl:space-x-reverse">
          <button onClick={handleZoomOut} className="text-white p-2 hover:text-gray-300 transition-colors" title="تصغير">
            <FaSearchMinus />
          </button>
          
          <div className="text-white text-sm font-medium">{Math.round(zoomLevel * 100)}%</div>
          
          <button onClick={handleZoomIn} className="text-white p-2 hover:text-gray-300 transition-colors" title="تكبير">
            <FaSearchPlus />
          </button>
          
          <button onClick={handleFullScreen} className="text-white p-2 hover:text-gray-300 transition-colors" title={fullScreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}>
            {fullScreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>

        {/* Close button */}
        <button 
          className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white rounded-full p-2 hover:bg-black/80 transition-colors"
          onClick={handleClose}
          title="إغلاق"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;