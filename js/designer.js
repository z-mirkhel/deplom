// window.innerWidth / window.innerHeight

import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';

console.log("Подключили файл!!!!!!!!");

function init() {
    let container = document.querySelector('.cont');

    //Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#383736");

    //Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 0, 2.5);

    //render
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth - 60, window.innerHeight - 80)
    container.appendChild(renderer.domElement)

    let floor;
    {
        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 3),
            new THREE.MeshBasicMaterial({ color: "#5e5b56" })
        )
        floor.reciveShadow = true;
        floor.position.set(0, -1.35, 0);
        floor.rotateX(-Math.PI / 2);
        floor.name = 'ROOM';
        scene.add(floor)
    }
    let wallLeft;
    {
        wallLeft = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 2.7),
            new THREE.MeshBasicMaterial({ color: "#f0eae7" })
        )
        wallLeft.reciveShadow = true;
        wallLeft.rotateY(Math.PI / 2);
        wallLeft.position.set(-2, 0, 0);
        wallLeft.name = 'ROOM';
        scene.add(wallLeft)
    }
    let wallBack;
    {
        wallBack = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 2.7),
            new THREE.MeshBasicMaterial({ color: "#ede5e2" })
        )
        wallBack.reciveShadow = true;
        wallBack.position.set(0, 0, -1.5);
        wallBack.name = 'ROOM';
        scene.add(wallBack)
    }
    let wallRight;
    {
        wallRight = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 2.7),
            new THREE.MeshBasicMaterial({ color: "#f0eae7" })
        )
        wallRight.reciveShadow = true;
        wallRight.rotateY(-Math.PI / 2);
        wallRight.position.set(2, 0, 0);
        wallRight.name = 'ROOM';
        scene.add(wallRight)
    }
    let und;
    {
        und = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 3),
            new THREE.MeshBasicMaterial({ color: "#eae5e3" })
        )
        und.reciveShadow = true;
        und.position.set(0, 1.35, 0);
        und.rotateX(Math.PI / 2);
        und.name = 'ROOM';
        scene.add(und)
    }

    function addModelLoader(path, positionModel) {
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
            // Получаем bounding box модели
            var boundingBox = new THREE.Box3().setFromObject(gltf.scene);
            var positionY = 1.35 - (boundingBox.max.y - boundingBox.min.y) / 2;
            var positionZ = -1.5 + (boundingBox.max.z - boundingBox.min.z) / 2;

            switch (positionModel) {
                case "up":
                    lastUpModelPosition += (boundingBox.max.x - boundingBox.min.x) / 2;
                    gltf.scene.position.set(lastUpModelPosition, positionY - 0.35, positionZ);
                    console.log(gltf.scene);
                    scene.add(gltf.scene);
                    lastUpModelPosition += (boundingBox.max.x - boundingBox.min.x) / 2;
                    break;
                case "down":
                    lastDownModelPosition += (boundingBox.max.x - boundingBox.min.x) / 2;
                    gltf.scene.position.set(lastDownModelPosition, -positionY, positionZ);
                    scene.add(gltf.scene);
                    lastDownModelPosition += (boundingBox.max.x - boundingBox.min.x) / 2;
                    break;
            }
        });
    }

    let modelColor;
    let lastUpModelPosition = -2;
    let lastDownModelPosition = -2;
    // Model
    {
        addModelLoader('./example/untitled3.gltf', "up");
        addModelLoader('./example/untitled2.gltf', "up");
        addModelLoader('./example/untitled1.gltf', "down");
        addModelLoader('./example/untitled2.gltf', "up");
        addModelLoader('./example/untitled1.gltf', "down");
        addModelLoader('./example/untitled1.gltf', "down");
    }

    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 7, 0);
        light.lookAt(0, -1, 0);
        light.name = 'LIGHT';
        scene.add(light);

        // Helper
        // const helper = new THREE.DirectionalLightHelper(light, 5)
        // scene.add(helper)
    }

    {
        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(-3, 0, 7)
        light.lookAt(0, 1, 0)
        light.name = 'LIGHT';
        scene.add(light)

        // Helper
        // const helper = new THREE.DirectionalLightHelper(light, 5)
        // scene.add(helper)
    }

    {
        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(4, 0, -7)
        light.lookAt(0, 1, 0)
        light.name = 'LIGHT';
        scene.add(light)

        // Helper
        // const helper = new THREE.DirectionalLightHelper(light, 5)
        // scene.add(helper)
    }

    //OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);

    //Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)

    // Создаем переменную для хранения выбранной модели
    let selectedModel = null;

    // Добавляем обработчик клика на сцену
    document.addEventListener('click', (event) => {
        event.preventDefault();

        // Получаем координаты клика
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // Создаем Raycaster
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // Получаем все объекты на сцене, которые пересеклись с лучем
        const intersects = raycaster.intersectObjects(scene.children, true);

        // Выбираем первый объект из пересечений и меняем цвет
        if (intersects.length > 0) {
            console.log(intersects[0].object);
            switch (intersects[0].object['name']) {
                case "ROOM" || "LIGHT":
                    break;
                default:
                    switch (intersects[0].object.material.color.getHex()) {
                        case 0xff0000:
                            intersects[0].object.material.color.set(modelColor);
                            break;
                        default:
                            // Снимаем подсветку с предыдущей выбранной модели
                            if (selectedModel) {
                                selectedModel.material.color.set(modelColor);
                                selectedModel = null;
                                selectedModel = intersects[0].object;
                                modelColor = intersects[0].object.material.color.getHex();
                                selectedModel.material.color.set(0xff0000);
                            } else {// Подсвечиваем выбранную модель (меняем цвет на красный)
                                selectedModel = intersects[0].object;
                                modelColor = intersects[0].object.material.color.getHex();
                                selectedModel.material.color.set(0xff0000);
                            }
                    }
            }
        }
    }, false);

    // Обработчики событий для кнопок
    document.addEventListener('keydown', (event) => {
        if (selectedModel) {
            if (selectedModel.material.color.getHex() === 0xff0000) {
                switch (event.code) {
                    // Перемещение вправо
                    case 'ArrowRight':
                        selectedModel.position.x += 0.1;
                        break;
                    // Перемещение влево
                    case 'ArrowLeft':
                        selectedModel.position.x -= 0.1;
                        break;
                    // Перемещение вверх
                    case 'ArrowUp':
                        selectedModel.position.z -= 0.1;
                        break;
                    // Перемещение вниз
                    case 'ArrowDown':
                        selectedModel.position.z += 0.1;
                        break;
                    // Поворот на 90 градусов
                    case 'Space':
                        // modelSpace++;
                        selectedModel.rotation.y += Math.PI / 2;
                        break;
                }
            }
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