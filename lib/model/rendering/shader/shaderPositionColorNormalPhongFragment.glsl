precision mediump float;
varying vec3 L, N, E;
//varying vec3 normalInterp;// Surface normal
//varying vec3 vertPos;// Vertex position
varying vec3 fragColor;

float ambientProduct = 1.0;// Ambient reflection coefficient
float diffuseProduct = 1.0;// Diffuse reflection coefficient
float specularProduct = 0.4;// Specular reflection coefficient
float shininess = 5.0;// Shininess

void main() {

        vec4 diffuse = max(dot(L, N), 0.0) * diffuseProduct;
        vec3 H = normalize(L+E);
        vec4 specular =
        pow(max(dot(N, H), 0.0), shininess) * specularProduct;

        if (dot(L, N) < 0.0)
        specular = vec4(0.0, 0.0, 0.0, 1.0);

        vec4 fColor = (ambientProduct + diffuse + specular);
        fColor.a = 1.0;

        gl_FragColor = fColor;

/*
    gl_FragColor = vec4(
    Ka * ambientColor +
    Kd * lambertian * fragColor +
    Ks * specular * specularColor
    , 1.0);*/

    // only ambient
    //   if(mode == 2) gl_FragColor = vec4(Ka * ambientColor, 1.0);
    // only diffuse
    // if(mode == 3) gl_FragColor = vec4(Kd * lambertian * fragColor, 1.0);
    // only specular
    // if(mode == 4) gl_FragColor = vec4(Ks * specular * specularColor, 1.0);
}
