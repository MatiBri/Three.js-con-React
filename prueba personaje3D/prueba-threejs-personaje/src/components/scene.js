import * as THREE from 'three';
//import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useRef, useEffect } from "react";

const Scene = () => {

    //CREANDO UNA ESCENA

    // const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    // camera.position.z = 5;

    // function animate() {
    //     requestAnimationFrame(animate);
    //     cube.rotation.x += 0.01;
    //     cube.rotation.y += 0.01;
    //     renderer.render(scene, camera);
    // }


    // if (WebGL.isWebGLAvailable()) {

    //     Initiate function or other initializations here
    //     animate();

    // } else {

    //     const warning = WebGL.getWebGLErrorMessage();
    //     document.getElementById('container').appendChild(warning);

    // }


    //CREANDO LINEAS

    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);

    // const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight,
    //     window.innerHeight, 1, 500);
    // camera.position.set(0, 0, 100);
    // camera.lookAt(0, 0, 0);

    // const scene = new THREE.Scene();

    //create a blue LineBasicMaterial
    // const material = new THREE.LineBasicMaterial({ color: 0x000ff });

    //Añadimos una geometría con algunos vertices
    // const points = [];
    // points.push(new THREE.Vector3(- 10, 0, 0));
    // points.push(new THREE.Vector3(- 0, 10, 0));
    // points.push(new THREE.Vector3(10, 0, 0));

    // const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // const line = new THREE.Line(geometry, material);

    // scene.add(line);
    // renderer.render(scene, camera);

    // function animate() {
    //     requestAnimationFrame(animate);
    //     line.rotation.x += 0.01;
    //     line.rotation.y += 0.01;
    //     renderer.render(scene, camera);
    // }
    // animate();

    const mountRef = useRef(null);

    useEffect(() => {
        const currentRef = mountRef.current;
        const { clientWidth: width, clientHeight: height } = currentRef;

        //Scene, camara y render
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
        scene.add(camera);
        scene.background = new THREE.Color('skyblue');
        camera.position.set(50, 50, 50);
        camera.lookAt(new THREE.Vector3());
        const a = new THREE.Vector3(1, 0, 0);
        const b = new THREE.Vector3(0, 1, 0);
        const c = new THREE.Vector3();
        c.crossVectors(a, b);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Window.devicePixelRatio);
        currentRef.appendChild(renderer.domElement);

        //Orbit controls
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;


        //Resize
        const resize = () => {
            renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
            camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", resize);

        const personaje = new THREE.Group();
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('./models/PJ/Personaje.glb', (gltf) => {
            gltf.scene.scale.set(1, 1, 1);
            personaje.add(gltf.scene);
            scene.add(personaje);
        },);

        //Animar la escena
        const animate = () => {
            orbitControls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);

            personaje.rotation.y += 0.008;

        };
        animate();

        //Luces
        const ambientalLight = new THREE.AmbientLight(0xffffff, 1); //Sin una luz, el modelo no se va a poder ver pese a que esté cargado
        scene.add(ambientalLight);

        //Agrego un punto de luz (pointLight) para obtener una brillosidad en el modelo, parecido a como se ve en Blender
        const pointLight = new THREE.PointLight(0xffffff, 50);
        pointLight.position.set(5, 1, 4);
        scene.add(pointLight);

        return () => {
            window.removeEventListener("resize", resize);
            currentRef.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            className='Contenedor3D'
            ref={mountRef}
            style={{ width: "100%", height: "100vh" }}
        ></div>
    );
};

export default Scene