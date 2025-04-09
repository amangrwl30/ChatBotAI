
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene, camera, renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create sphere for the AI "brain"
    const sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
    
    // Create custom shader material for glowing effect
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x8B5CF6) }, // Purple
        color2: { value: new THREE.Color(0x0EA5E9) }, // Blue
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          float noise = sin(vPosition.x * 10.0 + time) * sin(vPosition.y * 10.0 + time) * sin(vPosition.z * 10.0 + time);
          noise = (noise + 1.0) / 2.0; // Normalize to 0-1
          
          vec3 color = mix(color1, color2, noise);
          float alpha = 0.7 + 0.3 * sin(time + vPosition.x + vPosition.y);
          
          // Add edge glow
          float edge = 1.0 - max(0.0, dot(normalize(vPosition), vec3(0.0, 0.0, 1.0)));
          edge = pow(edge, 3.0);
          color += edge * 0.5;
          
          gl_FragColor = vec4(color, alpha * 0.9);
        }
      `,
      transparent: true,
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Create neural network connections
    const connectionCount = 50;
    const connections = new THREE.Group();
    
    for (let i = 0; i < connectionCount; i++) {
      const startPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      
      const endPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      
      const points = [];
      points.push(startPoint);
      points.push(endPoint);
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const lineMaterial = new THREE.LineBasicMaterial({
        color: Math.random() > 0.5 ? 0x8B5CF6 : 0x0EA5E9,
        transparent: true,
        opacity: 0.6 + Math.random() * 0.4,
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      connections.add(line);
      
      // Add node at each end
      const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x8B5CF6 : 0x0EA5E9,
        transparent: true,
        opacity: 0.8,
      });
      
      const startNode = new THREE.Mesh(nodeGeometry, nodeMaterial);
      startNode.position.copy(startPoint);
      connections.add(startNode);
      
      const endNode = new THREE.Mesh(nodeGeometry, nodeMaterial);
      endNode.position.copy(endPoint);
      connections.add(endNode);
    }
    
    scene.add(connections);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x8B5CF6, 2, 50);
    pointLight1.position.set(10, 5, 15);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x0EA5E9, 2, 50);
    pointLight2.position.set(-10, -5, 10);
    scene.add(pointLight2);

    // Position camera
    camera.position.z = 6;

    // Animation
    let mouseX = 0;
    let mouseY = 0;
    
    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', onMouseMove);

    // Create pulses that emit from the sphere
    const pulseGroup = new THREE.Group();
    scene.add(pulseGroup);
    
    const createPulse = () => {
      const pulseGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x8B5CF6 : 0x0EA5E9,
        transparent: true,
        opacity: 1,
      });
      
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
      
      // Random position on sphere surface
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      
      pulse.position.x = 2 * Math.sin(theta) * Math.cos(phi);
      pulse.position.y = 2 * Math.sin(theta) * Math.sin(phi);
      pulse.position.z = 2 * Math.cos(theta);
      
      pulseGroup.add(pulse);
      
      // Animate the pulse
      const vector = new THREE.Vector3().copy(pulse.position).normalize();
      
      let scale = 1;
      let opacity = 1;
      
      return {
        pulse,
        update: () => {
          scale += 0.03;
          opacity -= 0.02;
          
          pulse.position.x = vector.x * (2 + scale);
          pulse.position.y = vector.y * (2 + scale);
          pulse.position.z = vector.z * (2 + scale);
          
          pulse.scale.set(scale, scale, scale);
          pulseMaterial.opacity = opacity;
          
          if (opacity <= 0) {
            pulseGroup.remove(pulse);
            return false;
          }
          return true;
        },
      };
    };
    
    const pulses: { pulse: THREE.Mesh; update: () => boolean }[] = [];
    
    // Create new pulse every second
    const pulseInterval = setInterval(() => {
      const newPulse = createPulse();
      pulses.push(newPulse);
    }, 300);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      // Update time uniform for shader
      (sphereMaterial.uniforms.time as { value: number }).value += 0.01;
      
      // Update sphere rotation based on mouse position
      sphere.rotation.x += (mouseY * 0.05 - sphere.rotation.x) * 0.05;
      sphere.rotation.y += (mouseX * 0.05 - sphere.rotation.y) * 0.05;
      
      // Gently rotate connections
      connections.rotation.x += 0.001;
      connections.rotation.y += 0.002;
      
      // Update and filter pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const isActive = pulses[i].update();
        if (!isActive) {
          pulses.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      clearInterval(pulseInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="three-canvas" />;
};

export default HeroScene;
