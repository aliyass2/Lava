// app/components/InfiniteImageSlider.jsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function InfiniteImageSlider({ 
  items,
  autoScrollSpeed = 1,
  enableAutoScroll = true,
  itemWidth = 224,
  gap = 16,
  initialIndex = 0,
  onItemClick = null,
  renderItem = null,
  showPositionIndicator = false,
  fadeEdges = true
}) {
  const carouselRef = useRef(null);
  const observerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(enableAutoScroll);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAttached, setIsAttached] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Tracking drag state with refs to avoid re-renders
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const scrollingDirectionRef = useRef(1); // 1 for right, -1 for left

  // Use a smaller set of repeated items for better performance
  // 5 sets is better than 3 for smoother infinite scrolling
  const extendedItems = React.useMemo(() => [
    ...items,
    ...items,
    ...items,
    ...items,
    ...items
  ], [items]);

  // Calculate important measurements for infinite scrolling
  const getMeasurements = useCallback(() => {
    if (!carouselRef.current) return null;
    
    const itemWidthWithGap = itemWidth + gap;
    const singleSetWidth = items.length * itemWidthWithGap;
    const totalWidth = carouselRef.current.scrollWidth;
    const viewportWidth = carouselRef.current.clientWidth;
    
    return {
      itemWidthWithGap,
      singleSetWidth,
      totalWidth,
      viewportWidth,
      totalSets: 5, // We have 5 sets of items
      centerSetIndex: 2 // The middle set (0-based index)
    };
  }, [items.length, itemWidth, gap]);

  // Set up Intersection Observer for truly infinite scrolling
  useEffect(() => {
    if (!carouselRef.current || !items.length) return;
    
    // Clean up any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create sentinel elements for detecting when to wrap around
    const firstItemEl = carouselRef.current.children[0];
    const lastItemEl = carouselRef.current.children[carouselRef.current.children.length - 1];
    
    if (!firstItemEl || !lastItemEl) return;
    
    const handleIntersection = (entries) => {
      const measurements = getMeasurements();
      if (!measurements || isDraggingRef.current) return;
      
      entries.forEach(entry => {
        // Don't process during drag operations
        if (isDraggingRef.current) return;
        
        const { singleSetWidth, centerSetIndex } = measurements;
        
        // Skip position jumps immediately after drag operations
        if (Date.now() - lastDragTimeRef.current < 250) return;
        
        if (entry.isIntersecting) {
          // Determine which sentinel was intersected
          if (entry.target === firstItemEl) {
            // First item is visible, jump to an equivalent position in a middle set
            const jumpDistance = singleSetWidth * 2;
            requestAnimationFrame(() => {
              if (!carouselRef.current || isDraggingRef.current) return;
              carouselRef.current.scrollLeft += jumpDistance;
              setScrollPosition(prev => prev + jumpDistance);
            });
          } else if (entry.target === lastItemEl) {
            // Last item is visible, jump to an equivalent position in a middle set
            const jumpDistance = singleSetWidth * 2;
            requestAnimationFrame(() => {
              if (!carouselRef.current || isDraggingRef.current) return;
              carouselRef.current.scrollLeft -= jumpDistance;
              setScrollPosition(prev => prev - jumpDistance);
            });
          }
        }
      });
    };
    
    // Create and set up the observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: carouselRef.current,
      rootMargin: '0px',
      threshold: 0.1 // Trigger when at least 10% of the target is visible
    });
    
    // Observe the sentinel elements
    observerRef.current.observe(firstItemEl);
    observerRef.current.observe(lastItemEl);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [items.length, getMeasurements]);

  // Handle initial scroll position
  useEffect(() => {
    if (!carouselRef.current || initialized) return;

    // Add a slight delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (!carouselRef.current) return;
      
      const measurements = getMeasurements();
      if (!measurements) return;
      
      const { itemWidthWithGap, singleSetWidth, centerSetIndex } = measurements;
      
      // Position in the middle set, plus the initial index offset
      const initialPos = singleSetWidth * centerSetIndex + (initialIndex * itemWidthWithGap);
      
      // Apply the initial position without animation
      carouselRef.current.style.scrollBehavior = 'auto';
      carouselRef.current.scrollLeft = initialPos;
      setScrollPosition(initialPos);
      
      // Reset scroll behavior after position is set
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.scrollBehavior = '';
        }
        setInitialized(true);
      }, 50);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [itemWidth, gap, initialIndex, items.length, initialized, getMeasurements]);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || isAttached || !carouselRef.current || !initialized) return;

    let animationId;
    const now = Date.now();
    
    // Skip auto-scroll if we just finished dragging
    if (now - lastDragTimeRef.current < 400) {
      const timeout = setTimeout(() => {
        setAutoScroll(autoScroll);
      }, 400);
      return () => clearTimeout(timeout);
    }

    let lastTimestamp = 0;
    
    const scroll = (timestamp) => {
      if (!carouselRef.current || isDraggingRef.current) {
        animationId = requestAnimationFrame(scroll);
        return;
      }

      // Throttle updates to improve performance
      if (timestamp - lastTimestamp < 16) { // ~60fps
        animationId = requestAnimationFrame(scroll);
        return;
      }
      
      lastTimestamp = timestamp;
      
      // Get current position
      const currentPos = carouselRef.current.scrollLeft;
      const newScrollPosition = currentPos + (autoScrollSpeed * scrollingDirectionRef.current);
      
      // Update position
      carouselRef.current.scrollLeft = newScrollPosition;
      setScrollPosition(newScrollPosition);
      
      animationId = requestAnimationFrame(scroll);
    };

    // Start the animation
    animationId = requestAnimationFrame(scroll);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [autoScroll, isAttached, autoScrollSpeed, initialized]);

  // Function to handle scroll events
  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    
    // Simply update position state - the IntersectionObserver handles infinite scrolling
    setScrollPosition(carouselRef.current.scrollLeft);
    
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    // Prevent default browser drag behavior
    e.preventDefault();
    
    if (!carouselRef.current) return;
    
    isDraggingRef.current = true;
    startXRef.current = e.pageX;
    startScrollLeftRef.current = carouselRef.current.scrollLeft;
    dragDistanceRef.current = 0;
    
    // Disable auto-scroll while dragging
    setAutoScroll(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    
    const x = e.pageX;
    const walk = (startXRef.current - x);
    
    // Update scrolling direction based on drag direction
    if (walk > 0) {
      scrollingDirectionRef.current = 1; // Right
    } else if (walk < 0) {
      scrollingDirectionRef.current = -1; // Left
    }
    
    dragDistanceRef.current = Math.abs(walk);
    
    carouselRef.current.scrollLeft = startScrollLeftRef.current + walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    // Record time of drag end
    lastDragTimeRef.current = Date.now();
    
    // Handle click vs. drag
    if (dragDistanceRef.current < 5) {
      setIsAttached(prev => !prev);
    }
    
    isDraggingRef.current = false;
    
    // Resume auto-scroll if not attached - with delay
    if (!isAttached && enableAutoScroll) {
      const timeout = setTimeout(() => {
        if (!isDraggingRef.current) {
          setAutoScroll(true);
        }
      }, 400);
      
      return () => clearTimeout(timeout);
    }
  }, [isAttached, enableAutoScroll]);

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      lastDragTimeRef.current = Date.now();
    }
    
    isDraggingRef.current = false;
    
    // Resume auto-scroll if not attached - with delay
    if (!isAttached && enableAutoScroll) {
      const timeout = setTimeout(() => {
        if (!isDraggingRef.current) {
          setAutoScroll(true);
        }
      }, 400);
      
      return () => clearTimeout(timeout);
    }
  }, [isAttached, enableAutoScroll]);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    if (!carouselRef.current) return;
    
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].pageX;
    startScrollLeftRef.current = carouselRef.current.scrollLeft;
    dragDistanceRef.current = 0;
    
    // Disable auto-scroll while dragging
    setAutoScroll(false);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    
    const x = e.touches[0].pageX;
    const walk = (startXRef.current - x);
    
    // Update scrolling direction based on drag direction
    if (walk > 0) {
      scrollingDirectionRef.current = 1; // Right
    } else if (walk < 0) {
      scrollingDirectionRef.current = -1; // Left
    }
    
    dragDistanceRef.current = Math.abs(walk);
    
    carouselRef.current.scrollLeft = startScrollLeftRef.current + walk;
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Record time of drag end
    lastDragTimeRef.current = Date.now();
    
    // Handle tap vs. drag
    if (dragDistanceRef.current < 5) {
      setIsAttached(prev => !prev);
    }
    
    isDraggingRef.current = false;
    
    // Resume auto-scroll if not attached - with delay
    if (!isAttached && enableAutoScroll) {
      const timeout = setTimeout(() => {
        if (!isDraggingRef.current) {
          setAutoScroll(true);
        }
      }, 400);
      
      return () => clearTimeout(timeout);
    }
  }, [isAttached, enableAutoScroll]);

  // Handle mouse enter - pause auto-scroll
  const handleMouseEnter = useCallback(() => {
    if (!isAttached && enableAutoScroll) {
      setAutoScroll(false);
    }
  }, [isAttached, enableAutoScroll]);

  // Handle direction change
  const handleDirectionChange = useCallback(() => {
    scrollingDirectionRef.current *= -1;
  }, []);

  // Calculate current view percentage for position indicator
  const getScrollPercentage = () => {
    if (!carouselRef.current) return 0;
    
    const measurements = getMeasurements();
    if (!measurements) return 0;
    
    const { singleSetWidth } = measurements;
    
    // Normalize position to represent where we are in a single set (0-100%)
    const normalizedPosition = scrollPosition % singleSetWidth;
    return Math.min(100, Math.max(0, (normalizedPosition / singleSetWidth) * 100));
  };

  // Custom item renderer with fallback
  const renderSlideItem = (item, index) => {
    if (renderItem) {
      return renderItem(item, index % items.length);
    }
    
    // Default renderer
    return (
      <div className="rounded-lg overflow-hidden relative aspect-[1/1.2] bg-gray-800">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading={index < 10 ? 'eager' : 'lazy'}
          width={itemWidth}
          height={Math.floor(itemWidth * 1.2)}
        />
      </div>
    );
  };

  // Determine cursor style
  const cursorStyle = isDraggingRef.current ? 'grabbing' : isAttached ? 'grabbing' : 'grab';

  return (
    <div 
      className="overflow-hidden relative"
      dir="ltr"
      style={{ cursor: cursorStyle }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Scrollable content"
      role="region"
    >
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none', 
          cursor: cursorStyle,
          gap: `${gap}px`,
          transition: 'none', // Prevent browser smooth scrolling
          WebkitOverflowScrolling: 'touch' // Better performance on mobile
        }}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-live="polite"
      >
        {extendedItems.map((item, index) => (
          <div
            key={`${item.id || index}-${index}`}
            className="flex-shrink-0 relative group"
            style={{ width: `${itemWidth}px` }}
            aria-roledescription="slide"
            onClick={onItemClick ? () => onItemClick(item, index % items.length) : undefined}
          >
            {renderSlideItem(item, index)}
            <p className="mt-2 text-sm text-white text-center">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Gradient overlays for a smooth visual effect - can be disabled */}
      {fadeEdges && (
        <>
          <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l  to-transparent z-10 pointer-events-none"></div>
        </>
      )}
      
      {/* Optional position indicator */}
      {showPositionIndicator && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
          <div 
            className="h-full bg-gray-300" 
            style={{ width: `${getScrollPercentage()}%` }}
          ></div>
        </div>
      )}
      
 
    </div>
  );
}