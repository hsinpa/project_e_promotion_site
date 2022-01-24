precision mediump float;

uniform float u_time;
uniform vec4 u_mainColor;
uniform vec2 u_mousePos;
uniform int u_isMouseEnable;

uniform sampler2D u_front_tex;
uniform sampler2D u_highlight_tex;

varying vec2 v_uv;  
varying vec2 v_vertex;  

void main() {
    vec2 uv = vec2(v_uv.x, v_uv.y);
    vec4 returnColor = vec4(v_uv.x, v_uv.y, 0.0, 1.0);

    vec4 frontTex = texture2D(u_front_tex, uv);
    vec4 highlihtTex = texture2D(u_highlight_tex, uv);

    float minRange = 0.75;
    float dist = 1.0 - distance(v_vertex, u_mousePos);
    float lerpV = smoothstep(minRange, 1.0, dist);
    vec4 revealCol = mix(frontTex, highlihtTex, lerpV);
    gl_FragColor = revealCol;
}