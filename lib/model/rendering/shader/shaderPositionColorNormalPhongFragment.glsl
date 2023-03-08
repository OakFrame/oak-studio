precision mediump float;

varying vec3 normalInterp;  // Surface normal
varying vec3 vertPos;       // Vertex position

int mode = 1;   // Rendering mode
float Ka = 1.0;   // Ambient reflection coefficient
float Kd = 1.0;   // Diffuse reflection coefficient
float Ks = 1.0;   // Specular reflection coefficient
float shininessVal = 20.0; // Shininess

// Material color
vec3 ambientColor = vec3(1.0,1.0,1.0);
vec3 diffuseColor = vec3(1.0,1.0,1.0);
vec3 specularColor = vec3(1.0,1.0,1.0);
vec3 lightPos = vec3(1.0,10.0,10.0); // Light position

void main() {

        vec3 N = normalize(normalInterp);
        vec3 L = normalize(lightPos - vertPos);

        // Lambert's cosine law
        float lambertian = max(dot(N, L), 0.0);
        float specular = 0.0;
        if(lambertian > 0.0) {
                vec3 R = reflect(-L, N);      // Reflected light vector
                vec3 V = normalize(-vertPos); // Vector to viewer
                // Compute the specular term
                float specAngle = max(dot(R, V), 0.0);
                specular = pow(specAngle, shininessVal);
        }
        gl_FragColor = vec4(Ka * ambientColor +
        Kd * lambertian * diffuseColor +
        Ks * specular * specularColor, 1.0);

        // only ambient
       // if(mode == 2) gl_FragColor = vec4(Ka * ambientColor, 1.0);
        // only diffuse
       // if(mode == 3) gl_FragColor = vec4(Kd * lambertian * diffuseColor, 1.0);
        // only specular
        //if(mode == 4) gl_FragColor = vec4(Ks * specular * specularColor, 1.0);
}
