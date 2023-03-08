precision highp float;

const int TEXTURE_LOOKUP = 0;

varying vec4 fragColor;
varying vec3 vNormal;
varying vec3 cNormal;
varying vec3 vPosition;
varying vec4 vColor;
varying vec3 mNormal;

uniform mat4 mWorld;
uniform mat4 mProj;
uniform mat4 sWorld;
uniform mat4 sProj;

uniform float fTime;
uniform mat4 mProp;

//varying vec4 shadowPos;
//uniform sampler2D depthColorTexture;
const mat4 texUnitConverter = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);

void main()
{

    gl_FragColor = vColor;

}
