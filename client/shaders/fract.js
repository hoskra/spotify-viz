export const fractFragmentShader = `
  #include <common>
  #extension GL_OES_standard_derivatives : enable

  uniform float amplitude;
  uniform vec3 iResolution;
  uniform vec3 gridColor;
  uniform float iTime;
  uniform float spacing;
  uniform float speed;
  uniform float barPulse;
  uniform float beatPulse;
  uniform bool kochOption;
  uniform int option;
  uniform sampler2D iChannel0;

  // https://www.youtube.com/watch?v=il_Qg9AqQkE
  void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = (fragCoord.xy - 0.5*iResolution.xy) / iResolution.xy;
    vec3 col = vec3(0.0);


    float angle = (2.0/3.0)*3.1415;
    vec2 n;
    if (kochOption) {
      if (beatPulse > 0.5){
        n = vec2(sin(angle+(1.0-beatPulse)), cos(angle+(1.0-beatPulse)));
      } else {
        n = vec2(sin(angle+beatPulse), cos(angle+beatPulse));
      }
    } else {
        n = vec2(sin(angle+barPulse*0.1), cos(angle+barPulse*0.1));
      // n = vec2(sin(angle), cos(angle));
    }

    uv.x += 0.5;

    float scale = 1.0;
    for (int i = 0; i < 4; i++) {
      uv *= 3.0;
      scale *= 3.0;
      uv.x -= 1.5;
      uv.x = abs(uv.x);
      uv.x -= 0.5;
      uv -= n*min(0.0, dot(uv, n))*2.0;

    }

    float pulse = barPulse;
    if (kochOption) {
      pulse = beatPulse;
    }

    float d = length(uv - vec2(clamp(max(0.9, pulse)*uv.x, -1.0, 1.0), 0.0));
    col += smoothstep(0.003/iResolution.y, 0.0, d/scale);
    // col.rg += uv;

    if(col.r < 0.1){
      fragColor = vec4(col, 0.0);
    } else {
      fragColor = vec4(col*gridColor, 1.0);
    }
  }

  varying vec2 vUv;

  void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
  }
  `;

export const fractVertexShader = `
  varying vec2 vUv;
  uniform float iTime;
  uniform float amplitude;
  uniform float wavelength;
  uniform float speed;

  void main() {
    vUv = uv;
    float k = 2.0 * 3.14 / wavelength;

    float x = position.x +  vUv.x;
    float y =  position.y + cos(k * (position.x - clamp(speed, 1.0, 1.8) * iTime));
    float z = position.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( x,y,z, 1.0 );


  }
`;
