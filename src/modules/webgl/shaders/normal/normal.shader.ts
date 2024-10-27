import { ShaderMaterial, Vector3, type ShaderMaterialParameters } from 'three'
import vertexShader from './normal.vertex.glsl'
import fragmentShader from './normal.fragment.glsl'

export const normalShader: ShaderMaterialParameters = {
  uniforms: {
    lightPosition: { value: new Vector3(0, 10, 0) },
  },
  vertexShader,
  fragmentShader,
}

export const normalMaterial = new ShaderMaterial(normalShader)
