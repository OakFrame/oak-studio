import {BufferedMesh} from "./BufferedMesh";

import CubePLY from "./ply/Cube00.ply";
export const MeshCube = new BufferedMesh();
MeshCube.parsePLY(CubePLY);

import HumanHead00PLY from "./ply/HumanHead00.ply";
export const MeshHumanHead00 = new BufferedMesh();
MeshHumanHead00.parsePLY(HumanHead00PLY);
