import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let mouth = null;
let eyesMesh = null;
let blinkTimer = null;

function frameObject(object, camera, fitOffset = 1.3) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    object.position.sub(center);

    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
    const fitWidthDistance  = fitHeightDistance / camera.aspect;
    const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

    camera.position.set(0, 0, distance);
    camera.near = distance / 100;
    camera.far  = distance * 100;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
}

function init() {
    const canvas = document.getElementById('avatarCanvas');
    if (!canvas) return;

    const container = canvas.parentElement;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 1000);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const key = new THREE.DirectionalLight(0xfff0d0, 3);
    key.position.set(2, 4, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd0e8ff, 1);
    fill.position.set(-3, 1, 2);
    scene.add(fill);

    function resize() {
        const w = canvas.clientWidth  || 160;
        const h = canvas.clientHeight || 160;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loader = new GLTFLoader();
    loader.load('/bear_avatar.glb', (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        resize();
        frameObject(model, camera, 1.3);

        gltf.scene.traverse((o) => {
            if (o.morphTargetDictionary) {
                if ('viseme_aa' in o.morphTargetDictionary) mouth = o;
                if ('blink'     in o.morphTargetDictionary) eyesMesh = o;
            }
        });

        if (eyesMesh) startBlinkLoop();
    });

    (function renderLoop() {
        requestAnimationFrame(renderLoop);
        renderer.render(scene, camera);
    })();
}

function startBlinkLoop() {
    const blink = () => {
        if (eyesMesh && 'blink' in eyesMesh.morphTargetDictionary) {
            const idx = eyesMesh.morphTargetDictionary['blink'];
            eyesMesh.morphTargetInfluences[idx] = 1;
            setTimeout(() => { eyesMesh.morphTargetInfluences[idx] = 0; }, 120);
        }
        blinkTimer = setTimeout(blink, 2500 + Math.random() * 2500);
    };
    blinkTimer = setTimeout(blink, 800 + Math.random() * 1500);
}

function setViseme(name, value) {
    if (!mouth || !(name in mouth.morphTargetDictionary)) return;
    mouth.morphTargetInfluences[mouth.morphTargetDictionary[name]] = value;
}

function clearVisemes() {
    if (!mouth) return;
    for (const key of Object.keys(mouth.morphTargetDictionary)) {
        if (key.startsWith('viseme_')) mouth.morphTargetInfluences[mouth.morphTargetDictionary[key]] = 0;
    }
}

window.avatar3d = { setViseme, clearVisemes };

document.addEventListener('DOMContentLoaded', init);
