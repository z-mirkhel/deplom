import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import { RectAreaLightHelper } from 'RectAreaLightHelper';
import { RectAreaLightUniformsLib } from 'RectAreaLightUniformsLib';

console.log("Подключили файл!!!!!!!!");

function init() {
    let container = document.querySelector('.container');
    let models;

    //Scene
    const scene = new THREE.Scene()
    console.log(scene);
    scene.background = new THREE.Color("#E2DFE1");

    //Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 3, 5)

    //render
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    let floor;
    {
        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 3),
            new THREE.MeshBasicMaterial({ color: "#000" })
        )
        floor.reciveShadow = true;
        floor.position.set(0, -1, 0);
        floor.rotateX(-Math.PI / 2);
        scene.add(floor)
    }
    let wallLeft;
    {
        wallLeft = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 2.7),
            new THREE.MeshBasicMaterial({ color: "#3e3e3e" })
        )
        wallLeft.reciveShadow = true;
        wallLeft.rotateY(Math.PI / 2);
        wallLeft.position.set(-2, 0.35, 0);
        scene.add(wallLeft)
    }
    let wallBack;
    {
        wallBack = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 2.7),
            new THREE.MeshBasicMaterial({ color: "#2e2e2e" })
        )
        wallBack.reciveShadow = true;
        wallBack.position.set(0, 0.35, -1.5);
        scene.add(wallBack)
    }
    let wallRight;
    {
        wallRight = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 2.7),
            new THREE.MeshBasicMaterial({ color: "#3e3e3e" })
        )
        wallRight.reciveShadow = true;
        wallRight.rotateY(-Math.PI / 2);
        wallRight.position.set(2, 0.35, 0);
        scene.add(wallRight)
    }

    // Model
    {
        const loader = new GLTFLoader();
        loader.load(
            './cube/example.gltf',
            (gltf) => {
                models = gltf.scene;
                scene.add(gltf.scene);
                console.log('success');
            }
        )
    }

    {
        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(-2, 0, 10)
        light.lookAt(0, -1, 0)
        scene.add(light)

        // Helper
        // const helper = new THREE.DirectionalLightHelper(light, 5)
        // scene.add(helper)
    }

    {
        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(2, 0, 5)
        light.lookAt(0, 1, 0)
        scene.add(light)

        // Helper
        // const helper = new THREE.DirectionalLightHelper(light, 5)
        // scene.add(helper)
    }

    RectAreaLightUniformsLib.init();
    {
        const rectLight = new THREE.RectAreaLight(0xffffff, 1, 100, 100);
        rectLight.position.set(-10, 0, 0)
        rectLight.rotation.y = Math.PI + Math.PI / 4;
        scene.add(rectLight)
    }

    {
        const rectLight = new THREE.RectAreaLight(0xffffff, 1, 100, 100);
        rectLight.position.set(10, 0, 0)
        rectLight.rotation.y = Math.PI - Math.PI / 4;
        scene.add(rectLight)
    }

    //OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 5;
    // controls.enableDamping = true;

    //Resize
    window.addEventListener('resize', onWindowResize, false)

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    // Обработчики событий для кнопок
    document.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
            // Перемещение вправо
            case 39:
                models.position.x += 0.1;
                console.log(models);
                break;
            // Перемещение влево
            case 37:
                models.position.x -= 0.1;
                break;
            // Перемещение вверх
            case 38:
                models.position.y += 0.1;
                break;
            // Перемещение вниз
            case 40:
                models.position.y -= 0.1;
                break;
        }
    });

    // Animate
    function animate() {
        requestAnimationFrame(animate)
        controls.update();
        renderer.render(scene, camera)
    }
    animate()

}

init()