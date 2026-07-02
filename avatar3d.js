import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let mouth = null;
let eyesMesh = null;
let blinkTimer = null;

function frameObject(object, camera, fitOffset = 1.3) {
    const box    = new THREE.Box3().setFromObject(object);
    const size   = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    object.position.sub(center);

    const maxSize           = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
    const fitWidthDistance  = fitHeightDistance / camera.aspect;
    const distance          = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

    camera.position.set(0, 0, distance);
    camera.near = distance / 100;
    camera.far  = distance * 100;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
}

function init() {
    const canvas = document.getElementById('avatarCanvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene  = new THREE.Scene();
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
    new ResizeObserver(resize).observe(canvas);

    const loader = new GLTFLoader();
    loader.load('/bear_avatar.glb', (gltf) => {
        const model = gltf.scene;

        // Hiç rotasyon verme — model zaten +Z'ye bakıyor
        model.rotation.set(0, 0, 0);
        scene.add(model);

        resize();
        frameObject(model, camera, 1.3);

        // Tüm morph target'ları logla, isim ne olursa olsun bul
        gltf.scene.traverse((o) => {
            if (!o.morphTargetDictionary) return;
            const keys = Object.keys(o.morphTargetDictionary);

                // Ağız: viseme_aa tercihli, yoksa mouth_open, yoksa pattern'e uyan ilk key
            const mouthKey = keys.find(k => k === 'viseme_aa')
                          || keys.find(k => k === 'mouth_open')
                          || keys.find(k => /mouth|jaw|viseme/i.test(k));
            if (mouthKey && !mouth) { mouth = o; mouth._mouthKey = mouthKey; }

            // Göz: ismi "blink", "eye" geçen
            const blinkKey = keys.find(k => /blink|eye/i.test(k));
            if (blinkKey && !eyesMesh) { eyesMesh = o; eyesMesh._blinkKey = blinkKey; }
        });

        if (eyesMesh) startBlinkLoop();
    });

    let canvasVisible = false;
    new IntersectionObserver((entries) => {
        canvasVisible = entries[0].isIntersecting;
    }).observe(canvas);

    (function renderLoop() {
        requestAnimationFrame(renderLoop);
        if (canvasVisible) renderer.render(scene, camera);
    })();
}

function startBlinkLoop() {
    const blink = () => {
        if (eyesMesh && eyesMesh._blinkKey) {
            const idx = eyesMesh.morphTargetDictionary[eyesMesh._blinkKey];
            eyesMesh.morphTargetInfluences[idx] = 1;
            setTimeout(() => { eyesMesh.morphTargetInfluences[idx] = 0; }, 120);
        }
        blinkTimer = setTimeout(blink, 2500 + Math.random() * 2500);
    };
    blinkTimer = setTimeout(blink, 2000 + Math.random() * 3000);
}

function setViseme(_, value) {
    if (!mouth || !mouth._mouthKey) return;
    mouth.morphTargetInfluences[mouth.morphTargetDictionary[mouth._mouthKey]] = value;
}

function clearVisemes() {
    if (!mouth || !mouth._mouthKey) return;
    mouth.morphTargetInfluences[mouth.morphTargetDictionary[mouth._mouthKey]] = 0;
}

window.avatar3d = { setViseme, clearVisemes };

document.addEventListener('DOMContentLoaded', init);
