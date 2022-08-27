precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertNormal;

uniform mat4 mWorld;
uniform mat4 mProj;

varying vec3 position;
varying vec3 normal;

void main (){

    mat4 MVP = mProj *  mWorld;
    gl_Position = MVP * vec4(vertPosition, 1);
    position = (mWorld * vec4(vertPosition, 1)).xyz;
    normal = (mWorld * vec4(vertNormal, 0)).xyz;//(mWorld * vec4(vertNormal, 0)).xyz;

}