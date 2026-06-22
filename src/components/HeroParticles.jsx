import React, { useEffect, useRef } from 'react';

export default function HeroParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let nodes = [];
    let bokehs = [];
    let ripples = [];
    const maxNodes = window.innerWidth < 768 ? 40 : 120;
    const maxBokehs = window.innerWidth < 768 ? 10 : 25;
    const connectionDistance = 140;

    let mouse = { x: null, y: null, targetX: null, targetY: null, radius: 180 };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = null;
      mouse.targetY = null;
    };

    const handleWindowClick = (e) => {
      // Trigger a visual ripple at the click coordinate
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 280,
        speed: 4,
        force: 15,
        opacity: 0.8
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleWindowClick);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };
    window.addEventListener('resize', resize);

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
        this.phase = Math.random() * Math.PI * 2;
        this.phaseSpeed = Math.random() * 0.02 + 0.005;
      }

      update() {
        // Move slowly
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        this.baseX = this.x;
        this.baseY = this.y;

        // Mouse warp (push away)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 35;
            this.y -= (dy / dist) * force * 35;
          }
        }

        // Ripple reaction
        ripples.forEach(rip => {
          const dx = this.x - rip.x;
          const dy = this.y - rip.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = Math.abs(dist - rip.radius);
          if (diff < 40 && dist > 10) {
            const push = (1 - diff / 40) * rip.force * (1 - rip.radius / rip.maxRadius);
            this.x += (dx / dist) * push;
            this.y += (dy / dist) * push;
          }
        });

        this.phase += this.phaseSpeed;
      }

      draw() {
        ctx.beginPath();
        const pulse = Math.sin(this.phase) * 0.5 + 0.5;
        ctx.arc(this.x, this.y, this.size + pulse * 1.5, 0, Math.PI * 2);
        
        const nodeGlow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size + 4);
        nodeGlow.addColorStop(0, 'rgba(192, 132, 252, 0.9)');
        nodeGlow.addColorStop(1, 'rgba(124, 58, 237, 0)');
        ctx.fillStyle = nodeGlow;
        ctx.fill();
      }
    }

    class Bokeh {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 60 + 30;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.05 + 0.02;
        this.color = Math.random() > 0.5 ? '124, 58, 237' : '168, 85, 247';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
      }

      draw() {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
        grad.addColorStop(0.5, `rgba(${this.color}, ${this.opacity * 0.3})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      nodes = Array.from({ length: maxNodes }, () => new Node());
      bokehs = Array.from({ length: maxBokehs }, () => new Bokeh());
      ripples = [];
    };

    init();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse coordinates smoothly
      if (mouse.targetX !== null && mouse.targetY !== null) {
        if (mouse.x === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.1;
          mouse.y += (mouse.targetY - mouse.y) * 0.1;
        }
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      // Draw floating background bokeh blur particles
      bokehs.forEach(b => {
        b.update();
        b.draw();
      });

      // Update and draw expanding ripples
      ripples = ripples.filter(rip => {
        rip.radius += rip.speed;
        return rip.radius < rip.maxRadius;
      });

      ripples.forEach(rip => {
        ctx.beginPath();
        const percent = rip.radius / rip.maxRadius;
        const opacity = (1 - percent) * rip.opacity;
        ctx.strokeStyle = `rgba(168, 85, 247, ${opacity * 0.35})`;
        ctx.lineWidth = 2 * (1 - percent);
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Connect and render nodes
      nodes.forEach(n => {
        n.update();
      });

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const percent = 1 - dist / connectionDistance;
            const opacity = percent * 0.18;
            
            ctx.beginPath();
            
            let isNearMouse = false;
            if (mouse.x !== null) {
              const mDist1 = Math.sqrt((mouse.x - n1.x) ** 2 + (mouse.y - n1.y) ** 2);
              const mDist2 = Math.sqrt((mouse.x - n2.x) ** 2 + (mouse.y - n2.y) ** 2);
              if (mDist1 < mouse.radius && mDist2 < mouse.radius) {
                isNearMouse = true;
              }
            }

            const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
            const lineOpacity = isNearMouse ? opacity * 2.2 : opacity;
            const lineColor1 = isNearMouse ? 'rgba(168, 85, 247, ' : 'rgba(124, 58, 237, ';
            const lineColor2 = isNearMouse ? 'rgba(192, 132, 252, ' : 'rgba(76, 29, 149, ';

            grad.addColorStop(0, `${lineColor1}${lineOpacity})`);
            grad.addColorStop(1, `${lineColor2}${lineOpacity * 0.5})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = isNearMouse ? 1.5 : 0.8;
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
        n1.draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
