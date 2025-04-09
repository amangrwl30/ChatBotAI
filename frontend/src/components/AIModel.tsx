
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AIModelProps {
  type: 'brain' | 'assistant' | 'network';
  size?: number;
  color?: string;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
}

const AIModel = ({ 
  type = 'brain',
  size = 1,
  color = '#8B5CF6',
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0 }
}: AIModelProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Set camera position
    camera.position.z = 5;

    // Create model based on type
    const modelGroup = new THREE.Group();
    
    if (type === 'brain') {
      // Create brain-like structure
      const sphereGeometry = new THREE.SphereGeometry(size, 32, 32);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.8,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.3,
      });
      
      const brain = new THREE.Mesh(sphereGeometry, sphereMaterial);
      modelGroup.add(brain);
      
      // Add neural connections
      for (let i = 0; i < 30; i++) {
        const startPoint = new THREE.Vector3(
          (Math.random() - 0.5) * size * 1.5,
          (Math.random() - 0.5) * size * 1.5,
          (Math.random() - 0.5) * size * 1.5
        );
        
        const connectionGeometry = new THREE.SphereGeometry(size * 0.05, 8, 8);
        const connectionMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color(color),
          emissive: new THREE.Color(color),
          emissiveIntensity: 0.5,
        });
        
        const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
        connection.position.copy(startPoint);
        modelGroup.add(connection);
      }
      
    } else if (type === 'assistant') {
      // Create humanoid assistant (using cylinder + sphere instead of capsule)
      // Body (cylinder)
      const bodyGeometry = new THREE.CylinderGeometry(size * 0.5, size * 0.5, size, 16);
      const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.9,
      });
      
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      modelGroup.add(body);
      
      // Head
      const headGeometry = new THREE.SphereGeometry(size * 0.3, 32, 32);
      const headMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.9,
      });
      
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = size * 0.9;
      modelGroup.add(head);
      
      // Add rounded ends to cylinder to approximate capsule shape
      const topSphere = new THREE.Mesh(
        new THREE.SphereGeometry(size * 0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        bodyMaterial
      );
      topSphere.position.y = size / 2;
      modelGroup.add(topSphere);
      
      const bottomSphere = new THREE.Mesh(
        new THREE.SphereGeometry(size * 0.5, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
        bodyMaterial
      );
      bottomSphere.position.y = -size / 2;
      modelGroup.add(bottomSphere);
      
    } else if (type === 'network') {
      // Create network node structure
      const nodes: THREE.Vector3[] = [];
      
      // Create nodes
      for (let i = 0; i < 15; i++) {
        const nodePos = new THREE.Vector3(
          (Math.random() - 0.5) * size * 2,
          (Math.random() - 0.5) * size * 2,
          (Math.random() - 0.5) * size * 2
        );
        
        nodes.push(nodePos);
        
        const nodeGeometry = new THREE.SphereGeometry(size * 0.1, 16, 16);
        const nodeMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color(color),
          emissive: new THREE.Color(color),
          emissiveIntensity: 0.5,
        });
        
        const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
        nodeMesh.position.copy(nodePos);
        modelGroup.add(nodeMesh);
      }
      
      // Create connections between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          // Only connect some nodes randomly
          if (Math.random() > 0.7) continue;
          
          const points = [];
          points.push(nodes[i]);
          points.push(nodes[j]);
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(color),
            transparent: true,
            opacity: 0.5,
          });
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          modelGroup.add(line);
        }
      }
    }
    
    // Set position and rotation
    modelGroup.position.set(position.x, position.y, position.z);
    modelGroup.rotation.set(rotation.x, rotation.y, rotation.z);
    scene.add(modelGroup);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      modelGroup.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [type, size, color, position, rotation]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default AIModel;
