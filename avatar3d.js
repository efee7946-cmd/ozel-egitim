import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let mouth = null;
let eyesMesh = null;
let blinkTimer = null;

function init() {
    const canvas = document.getElementById('avatarCanvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const key = new THREE.DirectionalLight(0xfff0d0, 3);
    key.position.set(2, 4, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd0e8ff, 1);
    fill.position.set(-3, 1, 2);
    scene.add(fill);

    const loader = new GLTFLoader();
    loader.load('/bear_avatar.glb', (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Bounding box ile kamerayı otomatik konumlandır
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        const focusY = center.y + size.y * 0.1;
        const dist   = size.y * 1.2;
        camera.position.set(center.x, focusY, center.z + dist);
        camera.lookAt(center.x, focusY, center.z);

        // Kullanıcının yazdığı traverse kodu
        gltf.scene.traverse((o) => {
            if (o.morphTargetDictionary) {
                if ('viseme_aa' in o.morphTargetDictionary) mouth = o;
                if ('blink'     in o.morphTargetDictionary) eyesMesh = o;
            }
        });

        if (eyesMesh) startBlinkLoop();
    });

    function resize() {
        const w = canvas.clientWidth  || 200;
        const h = canvas.clientHeight || 260;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    (function renderLoop() {
        requestAnimationFrame(renderLoop);
        renderer.render(scene, camera);
    })();
}

// Kullanıcının yazdığı blink döngüsü
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

// script.js'in erişebilmesi için global
window.avatar3d = { setViseme, clearVisemes };

document.addEventListener('DOMContentLoaded', init);
