"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export const ParticleImage = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // シーンの作成
    const scene = new THREE.Scene();

    // カメラの設定
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 500;

    // レンダラーの設定
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    let particles: THREE.Points;
    let targetPositions: Float32Array;
    let initialPositions: Float32Array;
    let step = 0;
    const totalSteps = 200;
    let expanding = false;

    // 画像データの取得
    const getImageData = (image: HTMLImageElement) => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      if (!context) return null;
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height);
    };

    // 粒子の作成
    const createParticles = (imageData: ImageData) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array((imageData.data.length / 4) * 3);
      const colors = new Float32Array((imageData.data.length / 4) * 3);

      for (let i = 0; i < imageData.data.length; i += 4) {
        const x = (i / 4) % imageData.width;
        const y = Math.floor(i / 4 / imageData.width);

        const r = imageData.data[i] / 255;
        const g = imageData.data[i + 1] / 255;
        const b = imageData.data[i + 2] / 255;

        const index = (i / 4) * 3;
        positions[index] = x - imageData.width / 2;
        positions[index + 1] = -y + imageData.height / 2;
        positions[index + 2] = 0;

        colors[index] = r;
        colors[index + 1] = g;
        colors[index + 2] = b;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // アニメーションの設定
      targetPositions = positions.slice();
      initialPositions = new Float32Array(positions.length);
      for (let i = 0; i < initialPositions.length; i += 3) {
        initialPositions[i] = Math.random() * 2000 - 1000;
        initialPositions[i + 1] = Math.random() * 2000 - 1000;
        initialPositions[i + 2] = Math.random() * 2000 - 1000;
      }

      // 初期位置の設定
      particles.geometry.attributes.position.array.set(initialPositions);
      particles.geometry.attributes.position.needsUpdate = true;
    };

    // アニメーション関数
    const animate = () => {
      requestAnimationFrame(animate);

      if (!particles) return;

      const positions = particles.geometry.attributes.position.array;

      if (!expanding) {
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += (targetPositions[i] - positions[i]) * 0.05;
          positions[i + 1] +=
            (targetPositions[i + 1] - positions[i + 1]) * 0.05;
          positions[i + 2] +=
            (targetPositions[i + 2] - positions[i + 2]) * 0.05;
        }

        if (step < totalSteps) {
          step++;
        } else {
          expanding = true;
          step = 0;
        }
      } else {
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += (initialPositions[i] - positions[i]) * 0.01;
          positions[i + 1] +=
            (initialPositions[i + 1] - positions[i + 1]) * 0.01;
          positions[i + 2] +=
            (initialPositions[i + 2] - positions[i + 2]) * 0.01;
        }

        if (step < totalSteps) {
          step++;
        } else {
          expanding = false;
          step = 0;
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    // 画像の読み込みと初期化
    const loader = new THREE.TextureLoader();
    loader.load("/img.jpg", (texture) => {
      const imageData = getImageData(texture.image);
      if (imageData) {
        createParticles(imageData);
        animate();
      }
    });

    // ウィンドウリサイズ時の処理
    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />;
};
