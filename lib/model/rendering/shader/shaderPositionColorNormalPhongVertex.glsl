attribute vec3 vertPosition;
attribute vec3 vertNormal;
attribute vec3 vertColor;

uniform mat4 mProj, mWorld;

varying vec3 normalInterp;
varying vec3 vertPos;
varying vec3 vertCol;

void main(){
    vec4 vertPos4 = mWorld * vec4(vertPosition, 1.0);
    normalInterp = vec3(mWorld * vec4(vertNormal, 0.0));
    vertPos = vec3(vertPos4) / vertPos4.w;
    vertCol = vertColor;
    // normalInterp = vec3(normalMat * vec4(normal, 0.0));
    gl_Position = mProj * vertPos4;
}
