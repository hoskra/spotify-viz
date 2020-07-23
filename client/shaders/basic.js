export const gridFragmentShader = `
  #include <common>
  #extension GL_OES_standard_derivatives : enable

  uniform vec3 iResolution;
  uniform vec3 gridColor;
  uniform float iTime;
  uniform float spacing;
  uniform float speed;
  uniform float barPulse;
  uniform float beatPulse;
  uniform float clock;
  uniform int option;
  uniform sampler2D iChannel0;

  // https://www.geeks3d.com/hacklab/20180611/demo-simple-2d-grid-in-glsl/
  // http://madebyevan.com/shaders/grid/

  float grid(vec2 st, float res) {
    vec2 grid = fract(st*res);
    return (step(res,grid.x) * step(res,grid.y));
  }

  void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;

    float z_shift = iTime/50.0;
    uv = (uv.xy + vec2(2.0, z_shift)) * 80.0;
    uv /= spacing;
    // uv.x /= clamp(pulse*60.0, 0.1, 1.0);

    if (option == 0) {
      // vec4 noise = texture2D(iChannel0, floor(uv));
      // float a = mod(noise.r + noise.g + noise.b + iTime * float(0.15), 1.0);
      // float p = 1.0 - min(a, 0.6);

      // float x = grid(uv, 0.5); // resolution
      // fragColor.rgb = vec3(1.0) * x * p;
      // fragColor.a = 1.0;
      // fragColor *= vec4( gridColor, 1.0);

      int TILES = 4;
      float TIMESCALE = 0.25;
      vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
      float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
      p = min(max(p * 3.0 - 1.8, 0.1), 2.0);

      vec2 r = mod(uv * float(TILES), 1.0);
      r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
      p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0)*beatPulse;

      fragColor = vec4(gridColor, 1.0) * p;
      fragColor.a = 0.9;

    } else if (option == 1) {
      float coord_f = length(uv);

      // Compute anti-aliased world-space grid lines
      float line = abs(fract(coord_f - 0.5) - 0.5) / fwidth(coord_f);

      // Just visualize the grid lines directly
      fragColor = vec4(vec3(1.0 - min(line, 1.0),1.0 - min(line, 1.0) ,1.0 - min(line, 1.0)      ),      1.0);
      // fragColor = vec4(vec3(1.0 - min(line, 1.0),1.0 - min(line * beatPulse/20.0, 1.0) ,1.0 - min(line * barPulse/20.0, 1.0)      ),      1.0);

      fragColor *= vec4( gridColor, 1.0);

    } else if (option == 2) {
      vec2 coord = uv;
      // Compute anti-aliased world-space grid lines
      vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
      float line = min(grid.x, grid.y);
      // line *= pulse/50.0;


      // fragColor = vec4(vec3(1.0 - min(line, 1.0),1.0 - min(line * beatPulse/20.0, 1.0) ,1.0 - min(line * barPulse/20.0, 1.0)      ),      1.0);
      fragColor = vec4(vec3(1.0 - min(line, 1.0),1.0 - min(line, 1.0) ,1.0 - min(line, 1.0)      ),      1.0);
      fragColor *= vec4( gridColor, 1.0);
    }

  }


  varying vec2 vUv;

  void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
  }
  `;

export const gridVertexShader = `
  varying vec2 vUv;
  uniform float iTime;
  uniform float wavelength;
  uniform float amplitude;
  uniform float speed;

  void main() {
    vUv = uv;
    float k = 2.0 * 3.14 / wavelength;

      float x = position.x +  vUv.x;
      float y = amplitude * cos(k * (position.x - clamp(speed, 1.0, 1.8) * iTime/40.0 - iTime));
      float z = position.z;

    // float x = position.x +  vUv.x;
    // float y = position.y;
    // float z = amplitude * cos(k * (position.x - clamp(speed, 1.0, 1.8) * iTime/40.0 - iTime));

    gl_Position = projectionMatrix * modelViewMatrix * vec4( x, y, z, 1.0 );
  }
`;
