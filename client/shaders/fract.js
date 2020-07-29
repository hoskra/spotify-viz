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

  vec2 N(float angle) {
    return vec2(sin(angle), cos(angle));
  }

  // https://www.youtube.com/watch?v=il_Qg9AqQkE
  void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = (fragCoord.xy - 0.5*iResolution.xy) / iResolution.xy;
    vec3 col = vec3(0.0);


    float angle = (5.0/6.0)*3.1415;
    vec2 n = N(angle);

    uv *= 3.;
    uv.x = abs(uv.x);
    uv.y += tan(angle);
    float dist = dot(uv-vec2(0.5, 0), n);
    uv -= n*max(0.0, dist)*2.0;


    angle = (2.0/3.0)*3.1415;

    if (kochOption) {
        n = vec2(sin(angle+iTime), cos(angle+iTime));
    } else {
      if(beatPulse > 0.5)  {
        n = vec2(sin(angle + 1.0 - beatPulse*0.5), cos(angle + 1.0 - beatPulse*0.5));
      }else {
        n = vec2(sin(angle+beatPulse*0.5), cos(angle+beatPulse*0.5));
      }

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
    col += smoothstep(0.001/iResolution.y, 0.0, 0.2*d/scale);

    if(kochOption){
      vec4 noise = texture2D(iChannel0, floor(uv *iTime*float(0.03)) / float(10.0+spacing));
      float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(0.03), 1.0);
      p = min(max(p * 3.0 - 1.8, 0.1), 2.0);



      // noise = texture2D(iChannel0, floor(uv *iTime*float(0.03)) / float(10.0+spacing));
      vec4 texture = texture2D(iChannel0, uv + iTime*2.0);
      uv /= scale;
      col.rgb += noise.rgb;
      if (barPulse > 0.5){
        col *= p;
      }
      col -= 2.0*distance(vec2(0.1),uv);
    }

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
  uniform bool kochOption;
  uniform float spacing;
  uniform float barPulse;
  uniform float beatPulse;

  void main() {
    vUv = uv;
    float k = 2.0 * 3.14 / wavelength;

    float x = position.x +  vUv.x;
    // float y =  position.y + cos(k * (position.x - clamp(speed, 1.0, 1.8) * iTime));
    float y =  position.y;

    if(!kochOption){
      x = x + x*clamp(beatPulse/2., 0.0, 1.9);
      y = y + y*clamp(beatPulse/2., 0.0, 1.9);
    }

    float z = position.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( x,y,z, 1.0 );


  }
`;
