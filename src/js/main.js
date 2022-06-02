import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import WebGL from './webgl';

if ( WebGL.isWebGLAvailable() ) {
  /**
   * https://www.youtube.com/watch?v=hipW1cg7kyU&t=62s
   */

  //UIデバッグ
  const gui = new GUI();
  const myGeometry = {
    myRadius: 15.00,
    myWidthSegments: 32,
    myHeightSegments: 16
  };
  gui.add( myGeometry, "myRadius", 0, 15 );
  gui.add( myGeometry, "myWidthSegments", 0, 32 ).step(1);
  gui.add( myGeometry, "myHeightSegments", 0, 16 ).step(1);

  //サイズ
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  //シーン
  const scene = new THREE.Scene();

  // 座標軸の追加
  const axesHelper = new THREE.AxesHelper( 5 );
  scene.add( axesHelper );

  //カメラ
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(1, 1, 2);

  //レンダラー
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  /**
   * パーティクルを作ってみよう
   */
  // ジオメトリ
  const particlesGeometry = new THREE.BufferGeometry;
  // const particlesGeometry = new THREE.SphereGeometry( 15, 32, 16 );
  const count = 10000;

  const positionArray = new Float32Array(count * 3);
  const colorArray = new Float32Array(count * 3);

  for(let i=0; i < count * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 10;
    colorArray[i] = Math.random();
  }

  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

  // マテリアル
  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.07,
    // size: 1,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  // メッシュ化
  const particles = new THREE.Points(particlesGeometry, pointsMaterial);
  // const particles = new THREE.Mesh(particlesGeometry, pointsMaterial);

  scene.add(particles);

  //マウス操作
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  window.addEventListener("resize", onWindowResize);

  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();

    controls.update();

    //レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  //ブラウザのリサイズに対応
  function onWindowResize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }

  animate();

} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}