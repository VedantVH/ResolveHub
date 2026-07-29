import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Background3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const count = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Warm sage green (#94b281), terracotta orange (#e07a5f), and peach (#f4c095)
    const color1 = new THREE.Color(0x94b281); 
    const color2 = new THREE.Color(0xe07a5f); 
    const color3 = new THREE.Color(0xf4c095); 

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;

      const mixedColor = color1.clone().lerp(
        Math.random() > 0.5 ? color2 : color3,
        Math.random()
      );
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Sage Green Wireframe Torus
    const torusGeo = new THREE.TorusGeometry(7.5, 2.2, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x94b281,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(4, -2, -5);
    scene.add(torus);

    // Terracotta Octahedron
    const octGeo = new THREE.OctahedronGeometry(3.2, 2);
    const octMat = new THREE.MeshBasicMaterial({
      color: 0xe07a5f,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const octahedron = new THREE.Mesh(octGeo, octMat);
    octahedron.position.set(-6, 3, -4);
    scene.add(octahedron);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = elapsedTime * 0.02;

      torus.rotation.x = elapsedTime * 0.15 + targetY * 0.5;
      torus.rotation.y = elapsedTime * 0.2 + targetX * 0.5;

      octahedron.rotation.x = -elapsedTime * 0.2;
      octahedron.rotation.z = elapsedTime * 0.25;

      camera.position.x += (targetX * 2 - camera.position.x) * 0.05;
      camera.position.y += (-targetY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      octGeo.dispose();
      octMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default Background3D;
