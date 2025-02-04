#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
// https://thebookofshaders.com/06/
vec3 hsb2rgb (in vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0),
                             6.0) - 3.0) - 1.0,  0.0, 1.0);
    rgb *= rgb * (3.0 - 2.0 * rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float stroke (float shape, float radius, float width) {
  float outerEdge = step(radius, shape + width * 0.5);
  float innerEdge = step(radius, shape - width * 0.5);
  return outerEdge - innerEdge;
}
// https://thebookofshaders.com/07/
float circleSDF(vec2 uv, float pct) {
  return length(uv - 0.5) * pct;
}

void main () {
  vec2 uv = vUv;
  uv.x *= resolution.x / resolution.y;
  vec3 color = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 0.1) {
    vec3 curCol = hsb2rgb(vec3(i, 1.0, 1.0 - i));
    float shape = circleSDF(uv, 1.0);
    float delta = time * 1.0;
    float radius = fract(1.0 - i + delta) - 0.1;
    color += curCol * stroke(shape, radius, 0.1);
  }
  gl_FragColor = vec4(color, 1.0);
}
// https://www.shadertoy.com/view/Ds3GWS