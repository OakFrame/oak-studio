precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;
attribute vec3 vertNormal;

varying vec3 fragColor;
varying vec3 normalInterp;
varying vec3 vertPos;

// Material color
uniform vec3 ambientColor = vec3(0.0, 0.0, 0.0);
uniform vec3 specularColor = vec3(1.0, 1.0, 1.0);
uniform vec3 lightPos = vec3(10000.0, 10000.0, 10000.0);// Light position

uniform mat4 mWorld;
uniform mat4 mProj;

//uniform mat4 mWorld, mProj;

mediump mat4 transpose(in mediump mat4 inMatrix) {
    mediump vec4 i0 = inMatrix[0];
    mediump vec4 i1 = inMatrix[1];
    mediump vec4 i2 = inMatrix[2];
    mediump vec4 i3 = inMatrix[3];

    mediump mat4 outMatrix = mat4(
    vec4(i0.x, i1.x, i2.x, i3.x),
    vec4(i0.y, i1.y, i2.y, i3.y),
    vec4(i0.z, i1.z, i2.z, i3.z),
    vec4(i0.w, i1.w, i2.w, i3.w)
    );

    return outMatrix;
}

float det(mat2 matrix) {
    return matrix[0].x * matrix[1].y - matrix[0].y * matrix[1].x;
}

mat4 inverse(mat4 m) {
    float
    a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

    b00 = a00 * a11 - a01 * a10,
    b01 = a00 * a12 - a02 * a10,
    b02 = a00 * a13 - a03 * a10,
    b03 = a01 * a12 - a02 * a11,
    b04 = a01 * a13 - a03 * a11,
    b05 = a02 * a13 - a03 * a12,
    b06 = a20 * a31 - a21 * a30,
    b07 = a20 * a32 - a22 * a30,
    b08 = a20 * a33 - a23 * a30,
    b09 = a21 * a32 - a22 * a31,
    b10 = a21 * a33 - a23 * a31,
    b11 = a22 * a33 - a23 * a32,

    deta = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    return mat4(
    a11 * b11 - a12 * b10 + a13 * b09,
    a02 * b10 - a01 * b11 - a03 * b09,
    a31 * b05 - a32 * b04 + a33 * b03,
    a22 * b04 - a21 * b05 - a23 * b03,
    a12 * b08 - a10 * b11 - a13 * b07,
    a00 * b11 - a02 * b08 + a03 * b07,
    a32 * b02 - a30 * b05 - a33 * b01,
    a20 * b05 - a22 * b02 + a23 * b01,
    a10 * b10 - a11 * b08 + a13 * b06,
    a01 * b08 - a00 * b10 - a03 * b06,
    a30 * b04 - a31 * b02 + a33 * b00,
    a21 * b02 - a20 * b04 - a23 * b00,
    a11 * b07 - a10 * b09 - a12 * b06,
    a00 * b09 - a01 * b07 + a02 * b06,
    a31 * b01 - a30 * b03 - a32 * b00,
    a20 * b03 - a21 * b01 + a22 * b00) / deta;
}

void main(){

    fragColor = vertColor;

    vec3 angles = radians(vec3(0.0,0.0,0.0));
    vec3 c = cos(angles);
    vec3 s = sin(angles);
    mat4 rx = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, c.x, s.x, 0.0,
    0.0, -s.x, c.x, 0.0,
    0.0, 0.0, 0.0, 1.0
    );
    mat4 ry = mat4(
    c.y, 0.0, -s.y, 0.0,
    0.0, 1.0, 0.0, 0.0,
    s.y, 0.0, c.y, 0.0,
    0.0, 0.0, 0.0, 1.0
    );

    vec3 pos = (mWorld * rx * ry * vec4(vertPosition,1.0)).xyz;
    vec3 lightPos = (mWorld * vec4(lightPos,1.0)).xyz;

    L = normalize(lightPos - pos);
    N = normalize((mWorld * rx * ry * vec4(vertNormal,1.0)).xyz);
    E = -normalize(pos);

    gl_Position =
    mProj * mWorld * rx * ry * vec4(vertPosition,1.0);

}