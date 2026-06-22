import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

import './Radar.css';

function hexToVec3(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255
  ];
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uScale;
uniform vec3 uColor;
uniform vec3 uBgColor;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;

#define PI 3.14159265359

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.x / uResolution.y;

  if (uEnableMouse) {
    vec2 m = uMouse * 2.0 - 1.0;
    m.x *= uResolution.x / uResolution.y;
    p -= m * uMouseInfluence * 0.4;
  }

  float r = length(p) * uScale * 1.5;
  float a = atan(p.y, p.x);
  float t = uTime * uSpeed * 0.8;

  // 3D Logarithmic grid tunnel coordinates
  float tunnelZ = 1.0 / (r + 0.001);
  float tunnelAngle = a / (2.0 * PI) + 0.5;

  vec2 gridUv = vec2(tunnelZ + t * 2.5, tunnelAngle * 12.0);
  vec2 ip = floor(gridUv);
  vec2 fp = fract(gridUv);

  // Digital mesh pattern
  float gridLines = smoothstep(0.12, 0.0, abs(fp.x - 0.5)) + 
                    smoothstep(0.12, 0.0, abs(fp.y - 0.5));
  gridLines *= smoothstep(0.15, 1.4, r); // Fade center out

  // High speed radial light particles/packets
  float stream = 0.0;
  for (int i = 0; i < 6; i++) {
    float id = float(i);
    float angleOffset = hash(vec2(id, 28.3)) * 2.0 * PI;
    float speedMult = hash(vec2(id, 82.7)) * 1.2 + 0.6;
    float beamActive = step(0.65, hash(vec2(floor(t * speedMult + id), id)));
    
    float diff = abs(sin(a - angleOffset));
    if (diff < 0.12 && beamActive > 0.0) {
      float pulse = fract(t * speedMult + r * 0.6);
      stream += (1.0 - smoothstep(0.0, 0.12, diff)) * 
                (1.0 - smoothstep(0.0, 0.35, abs(pulse - 0.5))) * 
                smoothstep(0.1, 1.2, r);
    }
  }

  // Pulsing central Core
  float coreGlow = exp(-r * 4.5) * 2.5;

  // Concentric data rings pulsing outward
  float ring = smoothstep(0.06, 0.0, abs(r - (0.55 + sin(t * 3.0) * 0.08)));

  float finalIntensity = (gridLines * 0.45 + stream * 0.95 + ring * 0.5) * smoothstep(1.8, 0.1, r) + coreGlow;
  
  // Custom neon cyber palette shifts dynamically
  vec3 neonColor = mix(uColor, vec3(0.9, 0.1, 0.6), sin(a * 4.0 + t * 1.5) * 0.5 + 0.5);
  vec3 col = neonColor * finalIntensity + uBgColor;

  float vignette = smoothstep(2.5, 0.7, length(p));
  col *= vignette;

  gl_FragColor = vec4(col, clamp(length(col), 0.0, 1.0));
}
`;

export default function Radar({
  speed = 1.0,
  scale = 0.5,
  ringCount = 10.0,
  spokeCount = 10.0,
  ringThickness = 0.05,
  spokeThickness = 0.01,
  sweepSpeed = 1.0,
  sweepWidth = 2.0,
  sweepLobes = 1.0,
  color = '#9f29ff',
  backgroundColor = '#000000',
  falloff = 2.0,
  brightness = 1.0,
  enableMouseInteraction = true,
  mouseInfluence = 0.1
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    let program;
    let currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];

    function handleMouseMove(e) {
      const rect = gl.canvas.getBoundingClientRect();
      targetMouse = [
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height
      ];
    }

    function handleMouseLeave() {
      targetMouse = [0.5, 0.5];
    }

    function resize() {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      if (program) {
        program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height];
      }
    }
    window.addEventListener('resize', resize);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height] },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uRingCount: { value: ringCount },
        uSpokeCount: { value: spokeCount },
        uRingThickness: { value: ringThickness },
        uSpokeThickness: { value: spokeThickness },
        uSweepSpeed: { value: sweepSpeed },
        uSweepWidth: { value: sweepWidth },
        uSweepLobes: { value: sweepLobes },
        uColor: { value: hexToVec3(color) },
        uBgColor: { value: hexToVec3(backgroundColor) },
        uFalloff: { value: falloff },
        uBrightness: { value: brightness },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseInfluence: { value: mouseInfluence },
        uEnableMouse: { value: enableMouseInteraction }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);

    if (enableMouseInteraction) {
      gl.canvas.addEventListener('mousemove', handleMouseMove);
      gl.canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    let animationFrameId;

    function update(time) {
      animationFrameId = requestAnimationFrame(update);
      program.uniforms.uTime.value = time * 0.001;

      if (enableMouseInteraction) {
        currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
        program.uniforms.uMouse.value[0] = currentMouse[0];
        program.uniforms.uMouse.value[1] = currentMouse[1];
      } else {
        program.uniforms.uMouse.value[0] = 0.5;
        program.uniforms.uMouse.value[1] = 0.5;
      }

      renderer.render({ scene: mesh });
    }
    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (enableMouseInteraction) {
        gl.canvas.removeEventListener('mousemove', handleMouseMove);
        gl.canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [speed, scale, ringCount, spokeCount, ringThickness, spokeThickness, sweepSpeed, sweepWidth, sweepLobes, color, backgroundColor, falloff, brightness, enableMouseInteraction, mouseInfluence]);

  return <div ref={containerRef} className="radar-container" />;
}
