precision mediump float;

uniform float u_time;
uniform vec4 u_mainColor;

varying vec2 v_uv;  

void main() {
    vec4 returnColor = vec4(v_uv.x, v_uv.y, 0.0, 1.0);

    gl_FragColor = returnColor;
}