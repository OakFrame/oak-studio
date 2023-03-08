precision highp float;

attribute vec3 vertPosition;
attribute vec3 vertNormal;
attribute vec4 vertColor;

uniform mat4 mWorld;
uniform mat4 mProj;
uniform mat4 sWorld;
uniform mat4 sProj;

uniform float fTime;
varying vec3 vNormal;
varying vec3 cNormal;
varying vec3 mNormal;
varying vec3 vPosition;
varying vec4 vColor;
varying vec4 fragColor;
varying vec4 shadowPos;

const mat4 texUnitConverter = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);


void main()
{

    vec4 vertPos4 = mWorld * vec4(vertPosition, 1.0);
    vNormal = vertNormal;
    mNormal = vec3(mWorld * vec4(vertNormal, 0.0));
    vPosition = vertPosition;
    vColor = vertColor;
    gl_Position = mProj * mWorld * vec4(vertPosition, 1.0);
    shadowPos = texUnitConverter * sProj * sWorld * vec4(vertPosition, 1.0);
    fragColor = vertColor;

}
