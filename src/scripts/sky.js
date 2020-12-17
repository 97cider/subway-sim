import * as THREE from "../../node_modules/three/build/three.module.js";
import SkyShaders from "../shaders/sky-shaders.js";

let Sky = function () {
    var shader = Sky.SkyShader;

    var material = new THREE.ShaderMaterial( {
        name: 'SkyShader',
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: THREE.UniformsUtils.clone( shader.uniforms ),
        side: THREE.DoubleSide,
        depthWrite: false
    } );

    //THREE.Mesh.call( this, new THREE.BoxBufferGeometry( 1, 1, 1 ), material );
    THREE.Mesh.call( this, new THREE.BoxBufferGeometry( 1, 1, 1 ), material );
};

Sky.prototype = Object.create( THREE.Mesh.prototype );

Sky.SkyShader = {
    uniforms: {
        "sunPosition": { value: new THREE.Vector3() },
    },
    vertexShader: SkyShaders.vertexShader,
    fragmentShader: SkyShaders.fragmentShader
}

export { Sky };