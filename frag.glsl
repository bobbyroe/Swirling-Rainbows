#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 vUv;
// https://thebookofshaders.com/06/
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0),
                             6.0) - 3.0) - 1.0,  0.0, 1.0);
    rgb *= rgb * (3.0 - 2.0 * rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

vec3 stroke(float axis, float radius, float width, vec3 color) {
  radius = fract(radius + (time * 0.33)) - 0.1;
  float d = step(radius, axis + width * 0.5) - step(radius, axis - width * 0.5);
  return color * clamp(d, 0.0, 1.0);
}
// https://thebookofshaders.com/07/
float circleSDF(vec2 uv, float pct) {
  return length(uv - 0.5) * pct;
}
// https://thebookofshaders.com/08/
mat2 scale2D (vec2 amt) {
  return mat2 (amt.x, 0.0, 0.0, amt.y);
}

float randomFloat (vec2 p) {
  p = fract(p * vec2(123.45, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main () {
  vec2 uv = vUv;
  uv -= vec2(0.5);
  uv *= scale2D(vec2(0.8));
  uv += vec2(0.5);
  vec3 color = vec3(0.0);
  vec3 curCol = hsb2rgb(vec3(1.0, 1.0, 1.0));
  for (float i = 0.0; i < 1.0; i += 0.1) {
    float n = 0.5;
    float h = i;
    curCol = hsb2rgb(vec3(h, 1.0, 1.0 - i));
    color += stroke(circleSDF(uv, 1.5), 1.0 - i, 0.1, curCol);
  }
  gl_FragColor = vec4(color, 1.0);
}
// https://www.shadertoy.com/view/Ds3GWS