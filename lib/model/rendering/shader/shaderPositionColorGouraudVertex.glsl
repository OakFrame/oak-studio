precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;
attribute vec3 vertNormal;

varying vec3 fragColor;
varying vec3 normalInterp;
varying vec3 vertPos;

uniform mat4 mWorld;
uniform mat4 mProj;

//uniform mat4 mWorld, mProj;

void main(){
    vec4 vertPos4 = mWorld * vec4(vertPosition, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = vertNormal;
    fragColor = vertColor;
    //vec3(normalMat * vec4(normal, 0.0));
   // gl_Position = projection * vertPos4;
    gl_Position = mProj * mWorld * vec4(vertPosition, 1.0);
}
