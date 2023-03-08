import {BufferedMesh} from "./BufferedMesh";

export interface VBOMeshComponent {
    staticMesh?:BufferedMesh;
    dynamicMesh?:BufferedMesh;
    castMesh?:BufferedMesh;
    receiveMesh?:BufferedMesh;
}
