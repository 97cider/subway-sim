const SkyShaders = {
    vertexShader:
        `
        uniform vec3 sunPosition;
        precision mediump float;

        varying vec2 vUv;
        varying vec3 vSunDirection;
        varying float vSunfade;
        varying vec3 vWorldPosition;
        varying vec3 vSunPosition;

        void main() {
            vUv = uv;
            vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
		    vWorldPosition = worldPosition.xyz;
            vSunDirection = normalize( sunPosition );
            vSunPosition = sunPosition;
            vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `,
    fragmentShader:
        `
        varying vec3 vWorldPosition;
        varying vec3 vSunDirection;
        varying float vSunfade;
        varying vec3 vSunPosition;

        const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );
        const float sunAngularDiameterCos = 0.9994;

        void main() {
            vec3 direction = normalize( vWorldPosition - cameraPos );

            float cosTheta = dot( direction, vSunDirection );
            float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
            gl_FragColor = (vec4(1.0, 1.0, 0.2, 1.0)) * sundisk;
        }
        `
}

export default SkyShaders;