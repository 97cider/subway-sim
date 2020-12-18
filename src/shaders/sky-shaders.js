const SkyShaders = {
    vertexShader:
        `
        uniform vec3 sunPosition;
        precision mediump float;

        varying vec2 vUv;
        varying vec3 vSunDirection;
        varying float vSunFade;
        varying vec3 vWorldPosition;
        varying vec3 vSunPosition;
        varying vec3 vBetaR;

        const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );
        const float rayleigh = 3.0;

        void main() {
            vUv = uv;
            vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
		    vWorldPosition = worldPosition.xyz;
            vSunDirection = normalize( sunPosition );
            vSunPosition = sunPosition;
            vSunFade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

            float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunFade ) );

            vBetaR = totalRayleigh * rayleighCoefficient;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `,
    fragmentShader:
        `
        uniform vec2 resolution;

        varying vec3 vWorldPosition;
        varying vec3 vSunDirection;
        varying float vSunFade;
        varying vec3 vBetaR;

        const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );
        const float sunAngularDiameterCos = 0.9994;
        const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
        const float ONE_OVER_FOURPI = 0.07957747154594767;
        const float pi = 3.141592653589793238462643383279502884197169;

        const float rayleighZenithLength = 8.4E3;

        float rayleighPhase( float cosTheta ) {
		    return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
        }
        
        float hgPhase( float cosTheta, float g ) {
		    float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

        void main() {
            vec3 direction = normalize( vWorldPosition - cameraPos );

            float zenithAngle = acos( max( 0.0, dot( vec3(0.0, -0.6, 0.0), direction ) ) );
            float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
            float sR = rayleighZenithLength * inverse;

            vec3 FofEX = exp( - ( vBetaR * sR ) );
            float extinction = exp(- sR);

            // scattering
            float cosTheta = dot( direction, vSunDirection );
            float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
            vec3 betaRTheta = vBetaR * rPhase;

            vec3 Lin = pow ( 0.1 * ( betaRTheta / vBetaR ) * ( 1.0 - FofEX), vec3( 2.0 ) );
            Lin *= mix( vec3( 1.0 ), pow( 0.8 * ( ( betaRTheta ) / ( vBetaR ) ) * FofEX, vec3( 0.1 ) ), clamp( pow( 2.0 - dot( vec3(0.0, 1.0, 0.0), vSunDirection ), 5.0 ), 0.0, 1.0 ) );

            // Night sky color
            vec3 L0 = vec3( 0.32, 0.38, 0.5 ) * FofEX;

            // sun calculating
            float sunDisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
            vec3 sunColor = vec3(1.0, 0.2, 1.0);


            L0 += (sunColor) * sunDisk;

            vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );
            vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + (1.2 * vSunFade ) ) ) );

           vec2 st = vec2(gl_FragCoord.xy) / resolution.xy;

            vec3 skyColor = vec3( 0.32, 0.38, 0.5 );
            vec3 skyDarkColor = vec3( 0.25, 0.28, 0.39 );
            vec3 skyBaseColor = vec3( 0.592, 0.64, 0.68 );

            vec3 skyGradient = mix(skyBaseColor, skyDarkColor, st.y + 0.3);
            vec3 sky = skyGradient + (FofEX / vec3(2.0)) + (sunDisk * sunColor);
            gl_FragColor = vec4(sky, 1.0 );
        }
        `
}

export default SkyShaders;