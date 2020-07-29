export const fragmentShader = `
  #include <common>

  uniform vec3 iResolution;
  uniform float iTime;
  uniform sampler2D iChannel0;

  // By Daedelus: https://www.shadertoy.com/user/Daedelus
  // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  #define TIMESCALE 0.25
  #define TILES 6
  #define COLOR 0.7, 1.6, 2.8

  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;

    vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
    float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
    p = min(max(p * 3.0 - 1.8, 0.1), 2.0);

    vec2 r = mod(uv * float(TILES), 1.0);
    r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
    p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);

    fragColor = vec4(COLOR, 1.0) * p;
  }

  varying vec2 vUv;

  void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
  }
  `;

export const vertexShader = `
varying vec2 vUv;
uniform float iTime;
uniform float wavelength;
uniform float amplitude;
uniform float speed;

void main() {
  vUv = uv;
  float k = 2.0 * 3.14 / wavelength;

    float x = position.x +  vUv.x;
    float y = position.y;
    float z = 5.0 * cos(k * (position.x - clamp(speed, 1.0, 1.8) * iTime/40.0 - iTime));

  // float x = position.x +  vUv.x;
  // float y = position.y;
  // float z = amplitude * cos(k * (position.x - clamp(speed, 1.0, 1.8) * iTime/40.0 - iTime));

  gl_Position = projectionMatrix * modelViewMatrix * vec4( x, y, z, 1.0 );
}
`;
