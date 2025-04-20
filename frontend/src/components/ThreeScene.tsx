import { useEffect, useRef } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  Points,
  AmbientLight,
} from 'three';

interface ThreeSceneProps {
  className?: string;
}

const ThreeScene = ({ className = '' }: ThreeSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const particlesRef = useRef<Points | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new Scene();
    sceneRef.current = scene;

    // Camera setup with adjusted field of view and position
    const camera = new PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3.8; // Moved back slightly for better view of small particles

    // Renderer setup with optimized settings
    const renderer = new WebGLRenderer({ 
      antialias: false, // Disabled for performance
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles with smaller settings
    const particlesGeometry = new BufferGeometry();
    const particleCount = 1000; // Increased count for better detail
    const posArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5.5; // Slightly tighter spread
    }
    
    particlesGeometry.setAttribute('position', new BufferAttribute(posArray, 3));
    
    const particlesMaterial = new PointsMaterial({
      size: 0.02, // Reduced size for more delicate appearance
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.62, // Slightly reduced opacity
      sizeAttenuation: true,
    });
    
    const particles = new Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Simplified lighting
    const ambientLight = new AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    let mouseX = 0;
    let mouseY = 0;
    
    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 150;
      mouseY = (event.clientY - window.innerHeight / 2) / 150;
    };

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0001; // Slower rotation
        particlesRef.current.rotation.x += 0.0001;
        particlesRef.current.rotation.y += mouseX * 0.00005; // More subtle mouse movement
        particlesRef.current.rotation.x += mouseY * 0.00005;
      }

      renderer.render(scene, camera);
    };

    // Throttled resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('mousemove', onDocumentMouseMove, { passive: true });
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      cancelAnimationFrame(frameRef.current);
      
      // Cleanup resources
      if (particlesRef.current) {
        scene.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as PointsMaterial).dispose();
      }
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`three-canvas ${className}`} />;
};

export default ThreeScene;
