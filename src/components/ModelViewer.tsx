'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ModelViewerProps {
  url: string;
  fileType: 'obj' | 'fbx';
  onLoad?: () => void;
  onError?: (msg: string) => void;
}

export default function ModelViewer({ url, fileType, onLoad, onError }: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e293b); // slate-800

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.001, 10000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);
    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;

    let animFrameId: number;
    let loadedObject: THREE.Object3D | null = null;

    const fitCameraToObject = (object: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      // Center the object
      object.position.sub(center);

      // Position camera
      const fov = camera.fov * (Math.PI / 180);
      const distance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.6;
      camera.position.set(0, 0, distance);
      camera.near = distance / 100;
      camera.far = distance * 100;
      camera.updateProjectionMatrix();

      controls.target.set(0, 0, 0);
      controls.update();
    };

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Load model
    if (fileType === 'obj') {
      const loader = new OBJLoader();
      loader.load(
        url,
        (object) => {
          // Apply a default material so it's always visible
          object.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (!mesh.material || (Array.isArray(mesh.material) && mesh.material.length === 0)) {
                mesh.material = new THREE.MeshStandardMaterial({
                  color: 0xf97316,
                  metalness: 0.3,
                  roughness: 0.6,
                });
              }
            }
          });
          loadedObject = object;
          scene.add(object);
          fitCameraToObject(object);
          onLoad?.();
        },
        undefined,
        () => {
          onError?.('Erro ao carregar o modelo OBJ.');
        }
      );
    } else {
      const loader = new FBXLoader();
      loader.load(
        url,
        (object) => {
          loadedObject = object;
          scene.add(object);
          fitCameraToObject(object);
          onLoad?.();
        },
        undefined,
        () => {
          onError?.('Erro ao carregar o modelo FBX.');
        }
      );
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      controls.dispose();

      if (loadedObject) {
        loadedObject.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (Array.isArray(mesh.geometry)) {
              // not expected but safe
            } else {
              mesh.geometry?.dispose();
            }
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else {
              (mesh.material as THREE.Material)?.dispose();
            }
          }
        });
      }

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [url, fileType, onLoad, onError]);

  return <div ref={mountRef} className="w-full h-full" />;
}
