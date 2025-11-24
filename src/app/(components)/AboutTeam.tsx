'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';

gsap.registerPlugin(ScrollTrigger);

type GL = Renderer['gl'];

// Utility functions
function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function (this: unknown, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}


function autoBind<T extends object>(instance: T): void {
  const proto = Object.getPrototypeOf(instance) as Record<string, unknown>;
  Object.getOwnPropertyNames(proto).forEach((key) => {
    const val = (instance as Record<string, unknown>)[key];
    if (key !== 'constructor' && typeof val === 'function') {
      (instance as Record<string, unknown>)[key] = (val as (...args: unknown[]) => unknown).bind(instance);
    }
  });
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(
  gl: GL,
  text: string,
  font: string = 'bold 30px monospace',
  color: string = 'white'
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context');

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = getFontSize(font);
  const textHeight = Math.ceil(fontSize * 1.2);

  canvas.width = textWidth + 40;
  canvas.height = textHeight + 40;

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

// Title class for text labels
class Title {
  gl: GL;
  plane: Mesh;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({ gl, plane, text, textColor = '#ffffff', font = '28px sans-serif' }: {
    gl: GL;
    plane: Mesh;
    text: string;
    textColor?: string;
    font?: string;
  }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeightScaled = this.plane.scale.y * 0.25;
    const textWidthScaled = textHeightScaled * aspect;
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.15;
    this.mesh.setParent(this.plane);
  }
}

// Media class for gallery items
class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  scene: Transform;
  text: string;
  viewport: { width: number; height: number };
  screen: { width: number; height: number };
  bend: number;
  textColor: string;
  borderRadius: number;
  font?: string;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  scale!: number;
  padding!: number;
  width!: number;
  widthTotal!: number;
  x!: number;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;

  constructor(props: {
    geometry: Plane;
    gl: GL;
    image: string;
    index: number;
    length: number;
    scene: Transform;
    screen: { width: number; height: number };
    text: string;
    viewport: { width: number; height: number };
    bend: number;
    textColor: string;
    borderRadius: number;
    font?: string;
  }) {
    this.geometry = props.geometry;
    this.gl = props.gl;
    this.image = props.image;
    this.index = props.index;
    this.length = props.length;
    this.scene = props.scene;
    this.screen = props.screen;
    this.text = props.text;
    this.viewport = props.viewport;
    this.bend = props.bend;
    this.textColor = props.textColor;
    this.borderRadius = props.borderRadius || 0.5;
    this.font = props.font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 3.0 + uTime) * 0.8 + cos(p.y * 2.0 + uTime) * 0.8) * (0.08 + uSpeed * 0.4);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      text: this.text,
      textColor: this.textColor,
      font: this.font
    });
  }

  update(scroll: { current: number; last: number }, direction: 'right' | 'left') {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport }: { screen?: { width: number; height: number }; viewport?: { width: number; height: number } } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;
    this.scale = this.screen.height / 1500;
    const cardSize = (this.viewport.height * (700 * this.scale)) / this.screen.height;
    this.plane.scale.y = cardSize;
    this.plane.scale.x = cardSize;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 1.8;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

// Main App class for gallery
class GalleryApp {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: { ease: number; current: number; target: number; last: number; position?: number };
  onCheckDebounce: () => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  mediasImages: { image: string; text: string; id: string }[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;
  isDown: boolean = false;
  start: number = 0;
  autoScrollEnabled: boolean = true;
  autoScrollSpeed: number = 0.5;
  lastInteractionTime: number = 0;
  autoScrollResumeDelay: number = 2000;

  constructor(container: HTMLElement, config: {
    items: { image: string; text: string; id: string }[];
    bend: number;
    textColor: string;
    borderRadius: number;
    font: string;
    scrollSpeed?: number;
    scrollEase?: number;
    autoScroll?: boolean;
    autoScrollSpeed?: number;
  }) {
    this.container = container;
    this.scrollSpeed = config.scrollSpeed || 2;
    this.autoScrollSpeed = config.autoScrollSpeed || 0.5;
    this.autoScrollEnabled = config.autoScroll !== false;
    this.scroll = { ease: config.scrollEase || 0.1, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(config.items, config.bend, config.textColor, config.borderRadius, config.font);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 50
    });
  }

  createMedias(items: { image: string; text: string; id: string }[], bend: number, textColor: string, borderRadius: number, font: string) {
    this.mediasImages = items.concat(items);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font
      });
    });
  }

  pauseAutoScroll() {
    this.lastInteractionTime = Date.now();
  }

  shouldAutoScroll(): boolean {
    if (!this.autoScrollEnabled) return false;
    const timeSinceInteraction = Date.now() - this.lastInteractionTime;
    return timeSinceInteraction > this.autoScrollResumeDelay;
  }

  onTouchDown = (e: MouseEvent | TouchEvent) => {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = 'touches' in e ? e.touches[0].clientX : e.clientX;
    this.pauseAutoScroll();
  };

  onTouchMove = (e: MouseEvent | TouchEvent) => {
    if (!this.isDown) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = (this.scroll.position ?? 0) + distance;
  };

  onTouchUp = () => {
    this.isDown = false;
    this.onCheck();
  };

  onWheel = (e: Event) => {
    const wheelEvent = e as WheelEvent;
    const delta = wheelEvent.deltaY;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.pauseAutoScroll();
    this.onCheckDebounce();
  };

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize = () => {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  };

  update = () => {
    // Apply auto-scroll if enabled and no recent interaction
    if (this.shouldAutoScroll()) {
      this.scroll.target += this.autoScrollSpeed;
    }

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  };

  setAutoScroll(enabled: boolean) {
    this.autoScrollEnabled = enabled;
    if (enabled) {
      this.lastInteractionTime = 0;
    }
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('wheel', this.onWheel);
    window.addEventListener('mousedown', this.onTouchDown);
    window.addEventListener('mousemove', this.onTouchMove);
    window.addEventListener('mouseup', this.onTouchUp);
    window.addEventListener('touchstart', this.onTouchDown);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('mousedown', this.onTouchDown);
    window.removeEventListener('mousemove', this.onTouchMove);
    window.removeEventListener('mouseup', this.onTouchUp);
    window.removeEventListener('touchstart', this.onTouchDown);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchUp);
    if (this.renderer?.gl?.canvas?.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas as HTMLCanvasElement);
    }
  }
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  role: string;
  image: string;
}

export default function MeetTheTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgCircle1Ref = useRef<HTMLDivElement>(null);
  const bgCircle2Ref = useRef<HTMLDivElement>(null);
  const bgCircle3Ref = useRef<HTMLDivElement>(null);
  const galleryAppRef = useRef<GalleryApp | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'teamMembers'));
        const members: TeamMember[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          members.push({
            id: doc.id,
            name: data.name || '',
            position: data.position || '',
            role: data.role || '',
            image: data.image || 'https://placehold.co/400x400/6B46C1/FFF?text=User'
          });
        });
        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    if (!galleryRef.current || loading || teamMembers.length === 0) return;

    const items = teamMembers.map(member => ({
      image: member.image,
      text: member.name,
      id: member.id
    }));

    const app = new GalleryApp(galleryRef.current, {
      items,
      bend: 2.5,
      textColor: '#ffffff',
      borderRadius: 0.5,
      font: 'bold 28px sans-serif',
      scrollSpeed: 2,
      scrollEase: 0.1,
      autoScroll: true,
      autoScrollSpeed: 0.5
    });

    galleryAppRef.current = app;

    return () => {
      app.destroy();
      galleryAppRef.current = null;
    };
  }, [loading, teamMembers]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      if (bgCircle1Ref.current) {
        gsap.to(bgCircle1Ref.current, {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }

      if (bgCircle2Ref.current) {
        gsap.to(bgCircle2Ref.current, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }

      if (bgCircle3Ref.current) {
        gsap.to(bgCircle3Ref.current, {
          y: -120,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  const toggleAutoScroll = () => {
    const newState = !autoScrollEnabled;
    setAutoScrollEnabled(newState);
    if (galleryAppRef.current) {
      galleryAppRef.current.setAutoScroll(newState);
    }
  };

  return (
    <section ref={sectionRef} aria-label="Meet The Team Section" className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div aria-label="Background Decorations" className="absolute inset-0 overflow-hidden">
        <div ref={bgCircle1Ref} aria-label="Background Blur Circle 1" className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div ref={bgCircle2Ref} aria-label="Background Blur Circle 2" className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div ref={bgCircle3Ref} aria-label="Background Blur Circle 3" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div aria-label="Team Container" className="container mx-auto px-6 relative z-10">
        <div aria-label="Team Content" className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div ref={headerRef} aria-label="Team Header" className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Meet the Team
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-4">
              Scroll or drag to explore our talented team members
            </p>
            
            {/* Auto-scroll Toggle */}
            <button
              onClick={toggleAutoScroll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-white rounded-lg transition-all duration-300 border border-purple-500/30"
            >
              <span className={`w-3 h-3 rounded-full ${autoScrollEnabled ? 'bg-green-400' : 'bg-gray-400'}`}></span>
              <span className="text-sm font-medium">
                Auto-scroll: {autoScrollEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* Circular Gallery */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div 
              ref={galleryRef}
              className="w-full h-[500px] cursor-grab active:cursor-grabbing mb-8"
            />
          )}

          {/* View All Members Button */}
          <div className="text-center mt-12">
            <Link
              href="/team"
              className="inline-block px-8 py-3 bg-[#685885] text-white rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 font-semibold"
            >
              View Team Details
            </Link>
          </div>

          {/* Bottom CTA */}
          <div ref={ctaRef} aria-label="Call to Action" className="text-center mt-16 pt-12 border-t border-gray-700/50">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Brand?
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              Let Combine Zenith be your strategic partner in navigating the complexities of the modern market. We&apos;re here to help you achieve unprecedented success.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-[#685885] text-white rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 font-semibold"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}