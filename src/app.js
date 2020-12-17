import * as THREE from "../node_modules/three/build/three.module.js";
 
let camera, scene, renderer;
let geometry, material, mesh, sceneOrtho, cameraOrtho;
let subwaySprite, railingSprite;

let mouse = new THREE.Vector2();

const frontParallaxSensitivity = 20;
const backParallaxSensitivity = 10;
 
init();
animate();
 
function init() {
 
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
    camera.position.z = 1500;

    cameraOrtho = new THREE.OrthographicCamera( -width / 2, width / 2, height / 2, -height / 2, 1, 10);
    cameraOrtho.position.z = 10;
 
    scene = new THREE.Scene();
    sceneOrtho = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(window.devicePixelRatio);

    let textureLoader = new THREE.TextureLoader();
    let subwayTexture = textureLoader.load("../public/images/overlay-bg.png");
    let railingTexture = textureLoader.load("../public/images/overlay-railing.png");
    //subwayTexture.anisotropy = renderer.getMaxAnisotropy();

    let subwayMaterial = new THREE.SpriteMaterial( { map: subwayTexture } );
    let railingMaterial = new THREE.SpriteMaterial( { map: railingTexture } );
    // let subwayWidth = subwayMaterial.map.image.width;
    // let subwayHeight = subwayMaterial.map.image.height;
    
    subwaySprite = new THREE.Sprite( subwayMaterial );
    subwaySprite.center.set( 0.5, 0.5 );
    subwaySprite.scale.set( 2048, 1024, 1.0 );
    sceneOrtho.add(subwaySprite);

    railingSprite = new THREE.Sprite( railingMaterial );
    railingSprite.center.set( 0.5, 0.5 );
    railingSprite.scale.set( 2048, 1024, 1.0 );
    sceneOrtho.add( railingSprite );
    
 
    geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    material = new THREE.MeshNormalMaterial();
 
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
 
    document.body.appendChild( renderer.domElement );
 
}

function onDocumentMouseMove(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function animate() {
 
    requestAnimationFrame( animate );

    subwaySprite.position.x = mouse.x * backParallaxSensitivity;
    railingSprite.position.x = mouse.x * frontParallaxSensitivity;
 
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
 
    renderer.render( scene, camera );
    renderer.clearDepth();
    renderer.render( sceneOrtho, cameraOrtho);
 
}