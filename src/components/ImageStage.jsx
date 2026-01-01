import { useEffect, useRef, useState, useCallback } from "react";

export default function ImageStage({ image, onCanvasReady }) {
  const canvasEl = useRef(null);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const [logoSize, setLogoSize] = useState(120);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const backgroundImageRef = useRef(null);
  const logoImageRef = useRef(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  const handleCanvasReady = useCallback((canvas) => {
    onCanvasReady?.(canvas);
  }, [onCanvasReady]);

  // Food images
  const foodImages = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  ];

  const getImageUrl = () => {
    if (image && typeof image === 'string' && image.trim() !== "") {
      const hash = image.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return foodImages[hash % foodImages.length];
    }
    return foodImages[Math.floor(Math.random() * foodImages.length)];
  };

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasEl.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { width, height } = canvasSizeRef.current;

    // Draw background
    if (backgroundImageRef.current) {
      const img = backgroundImageRef.current;
      const scale = Math.max(width / img.width, height / img.height);
      const x = (width - img.width * scale) / 2;
      const y = (height - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    // Draw logo
    if (logoImageRef.current && logoPosition.x > 0 && logoPosition.y > 0) {
      const logo = logoImageRef.current;
      const x = logoPosition.x - logoSize / 2;
      const y = logoPosition.y - logoSize / 2;
      
      // Border
      ctx.strokeStyle = isDragging ? '#FF6D6A' : (isHovering ? 'rgba(255, 109, 106, 0.8)' : 'rgba(255, 109, 106, 0.5)');
      ctx.lineWidth = isDragging ? 4 : 2;
      ctx.strokeRect(x - 15, y - 15, logoSize + 30, logoSize + 30);
      
      // Corner indicators when dragging
      if (isDragging) {
        ctx.fillStyle = '#FF6D6A';
        const s = 12;
        ctx.fillRect(x - 15, y - 15, s, s);
        ctx.fillRect(x + logoSize + 3, y - 15, s, s);
        ctx.fillRect(x - 15, y + logoSize + 3, s, s);
        ctx.fillRect(x + logoSize + 3, y + logoSize + 3, s, s);
      }
      
      ctx.drawImage(logo, x, y, logoSize, logoSize);
    } else if (logoPosition.x > 0 && logoPosition.y > 0) {
      // Text placeholder
      ctx.fillStyle = '#FF6D6A';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('FASTOR', logoPosition.x, logoPosition.y);
      ctx.strokeStyle = '#FF6D6A';
      ctx.lineWidth = 2;
      ctx.strokeRect(logoPosition.x - logoSize / 2 - 15, logoPosition.y - logoSize / 2 - 15, logoSize + 30, logoSize + 30);
    }

    handleCanvasReady(canvas);
  }, [logoPosition, logoSize, isHovering, isDragging, handleCanvasReady]);

  // Load background
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      backgroundImageRef.current = img;
      drawCanvas();
    };
    img.onerror = () => {
      const fallback = new Image();
      fallback.crossOrigin = "anonymous";
      fallback.onload = () => {
        backgroundImageRef.current = fallback;
        drawCanvas();
      };
      fallback.src = foodImages[0];
    };
    img.src = getImageUrl();
  }, [image, foodImages, drawCanvas]);

  // Load logo
  useEffect(() => {
    const logoSvg = new Image();
    logoSvg.crossOrigin = "anonymous";
    logoSvg.onload = () => {
      logoImageRef.current = logoSvg;
      drawCanvas();
    };
    logoSvg.onerror = () => {
      const logoPng = new Image();
      logoPng.crossOrigin = "anonymous";
      logoPng.onload = () => {
        logoImageRef.current = logoPng;
        drawCanvas();
      };
      logoPng.onerror = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 200;
        tempCanvas.height = 200;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillStyle = '#FF6D6A';
        tempCtx.font = 'bold 40px Arial';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText('FASTOR', 100, 100);
        const textImg = new Image();
        textImg.onload = () => {
          logoImageRef.current = textImg;
          drawCanvas();
        };
        textImg.src = tempCanvas.toDataURL();
      };
      logoPng.src = "/fastor-logo.png";
    };
    logoSvg.src = "/fastor-logo.svg";
  }, [drawCanvas]);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasEl.current;
    if (!canvas) return;

    const updateSize = () => {
      const container = canvas.parentElement;
      const width = container ? container.clientWidth : window.innerWidth;
      const height = container ? container.clientHeight : window.innerHeight * 0.5;
      
      canvas.width = width;
      canvas.height = height;
      canvasSizeRef.current = { width, height };
      
      if (logoPosition.x === 0 && logoPosition.y === 0) {
        setLogoPosition({ x: width / 2, y: height / 2 });
      }
      
      drawCanvas();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [drawCanvas, logoPosition]);

  // Check if point is over logo
  const checkLogoHit = useCallback((x, y) => {
    const logoX = logoPosition.x;
    const logoY = logoPosition.y;
    const half = logoSize / 2;
    const padding = 40;
    return x >= logoX - half - padding && x <= logoX + half + padding &&
           y >= logoY - half - padding && y <= logoY + half + padding;
  }, [logoPosition, logoSize]);

  // Mouse down
  const handleMouseDown = (e) => {
    e.preventDefault();
    const canvas = canvasEl.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log("Mouse down at:", x, y, "Logo at:", logoPosition);

    if (checkLogoHit(x, y)) {
      console.log("✓ DRAG STARTED!");
      setIsDragging(true);
      dragOffsetRef.current = { x: x - logoPosition.x, y: y - logoPosition.y };
      canvas.style.cursor = "grabbing";
      drawCanvas();
    }
  };

  // Mouse move
  const handleMouseMove = (e) => {
    const canvas = canvasEl.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      e.preventDefault();
      const { width, height } = canvasSizeRef.current;
      const half = logoSize / 2;
      const newX = Math.max(half, Math.min(width - half, x - dragOffsetRef.current.x));
      const newY = Math.max(half, Math.min(height - half, y - dragOffsetRef.current.y));
      
      console.log("Dragging to:", newX, newY);
      setLogoPosition({ x: newX, y: newY });
      drawCanvas();
    } else {
      const hovering = checkLogoHit(x, y);
      if (hovering !== isHovering) {
        setIsHovering(hovering);
        canvas.style.cursor = hovering ? "grab" : "default";
        drawCanvas();
      }
    }
  };

  // Mouse up
  const handleMouseUp = () => {
    if (isDragging) {
      console.log("Drag ended");
      setIsDragging(false);
      const canvas = canvasEl.current;
      if (canvas) {
        canvas.style.cursor = isHovering ? "grab" : "default";
      }
      drawCanvas();
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    e.preventDefault();
    const canvas = canvasEl.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (checkLogoHit(x, y)) {
      setIsDragging(true);
      dragOffsetRef.current = { x: x - logoPosition.x, y: y - logoPosition.y };
      drawCanvas();
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const canvas = canvasEl.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const { width, height } = canvasSizeRef.current;
    const half = logoSize / 2;
    const newX = Math.max(half, Math.min(width - half, x - dragOffsetRef.current.x));
    const newY = Math.max(half, Math.min(height - half, y - dragOffsetRef.current.y));

    setLogoPosition({ x: newX, y: newY });
    drawCanvas();
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      drawCanvas();
    }
  };

  // Wheel for resize
  const handleWheel = (e) => {
    const canvas = canvasEl.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (checkLogoHit(x, y)) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -20 : 20;
      setLogoSize(prev => {
        const newSize = Math.max(60, Math.min(250, prev + delta));
        console.log("Resizing logo:", newSize);
        return newSize;
      });
      drawCanvas();
    }
  };

  // Global listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMove = (e) => {
        handleMouseMove(e);
      };
      const handleGlobalUp = () => {
        handleMouseUp();
      };

      document.addEventListener('mousemove', handleGlobalMove);
      document.addEventListener('mouseup', handleGlobalUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMove);
        document.removeEventListener('mouseup', handleGlobalUp);
      };
    }
  }, [isDragging, isHovering]);

  // Global touch listeners
  useEffect(() => {
    if (isDragging) {
      const handleGlobalTouchMove = (e) => handleTouchMove(e);
      const handleGlobalTouchEnd = () => handleTouchEnd();

      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);

      return () => {
        document.removeEventListener('touchmove', handleGlobalTouchMove);
        document.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [isDragging]);

  return (
    <div className="w-full relative" style={{ height: "50vh", minHeight: "300px", backgroundColor: "#f3f4f6" }}>
      <canvas 
        ref={canvasEl}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{ 
          display: "block", 
          width: "100%", 
          height: "100%",
          cursor: isDragging ? "grabbing" : (isHovering ? "grab" : "default"),
          touchAction: "none",
          userSelect: "none"
        }}
      />
    </div>
  );
}
