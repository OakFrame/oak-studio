precision highp float;

uniform float fTime;

vec4 encodeFloat (float depth) {
    const vec4 bitShift = vec4(
    256 * 256 * 256,
    256 * 256,
    256,
    1.0
    );
    const vec4 bitMask = vec4(
    0,
    1.0 / 256.0,
    1.0 / 256.0,
    1.0 / 256.0
    );
    vec4 comp = fract(depth * bitShift);
    comp -= comp.xxyz * bitMask;
    return comp;
}

//out vec4 outColor;

void main (void) {
    // Encode the distance into the scene of this fragment.
    // We'll later decode this when rendering from our camera's
    // perspective and use this number to know whether the fragment
    // that our camera is seeing is inside of our outside of the shadow
    gl_FragColor = encodeFloat(gl_FragCoord.z);
}
