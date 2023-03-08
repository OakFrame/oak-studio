attribute vec3 vertPosition;
attribute vec3 vertNormal;
attribute vec4 vertColor;

uniform mat4 sProj;
uniform mat4 sWorld;

uniform float fTime;


void main (void) {
    gl_Position = sProj * sWorld * vec4(vertPosition, 1.0);
}
