import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { controls } from './orbit-controls'
import { gl } from './webgl'
import { moebiusShader } from './shaders/moebius/moebius.shader'

export class TCanvas {
  private readonly material = new THREE.ShaderMaterial(moebiusShader)

  constructor(private container: HTMLElement) {}

  async loadModel(src: string): Promise<void> {
    const loader = new GLTFLoader()
    const loadedModel = await loader.loadAsync(src)
    const model = loadedModel.scene
    if (!model) {
      return
    }

    let sceneCamera: THREE.Camera | undefined
    model.traverse((child) => {
      if (child instanceof THREE.Camera) {
        sceneCamera = child
        return
      }

      if (child instanceof THREE.Light) {
        child.intensity = child.intensity / 500
        child.castShadow = true
        child.shadow.camera.near = 1
        child.shadow.camera.far = 200
        child.shadow.mapSize.width = 2048
        child.shadow.mapSize.height = 2048
        child.shadow.bias = -0.002
        child.shadow.radius = 1
        return
      }

      if (child instanceof THREE.Mesh) {
        child.geometry.computeVertexNormals()
        child.castShadow = true
        child.receiveShadow = true // child.name.includes('Floor')
        // child.material = this.material
      }
    })
    if (sceneCamera) {
      gl.camera.position.set(sceneCamera.position.x, sceneCamera.position.y, sceneCamera.position.z)
      gl.camera.rotation.set(
        sceneCamera.rotation.x,
        sceneCamera.rotation.y,
        sceneCamera.rotation.z,
        sceneCamera.rotation.order,
      )
    }

    model?.position.setX(0)
    model?.position.setY(0)
    model?.position.setZ(0)

    // wait until the model can be added to the scene without blocking due to shader compilation
    await gl.renderer.compileAsync(model, gl.camera, gl.scene)

    gl.scene.add(model)

    // console.log(loadedModel)
  }

  async start(): Promise<void> {
    this.init()
    this.createScene()
    gl.requestAnimationFrame(this.tick)
  }

  private init() {
    gl.setup(this.container)

    gl.scene.background = new THREE.Color('#8a92d5')
    gl.camera.position.z = 10.5
  }

  private createScene() {
    const light = new THREE.AmbientLight(0x606060)
    light.intensity = 1
    light.position.setY(10)
    // const mesh = new THREE.Mesh(new THREE.SphereGeometry())

    gl.scene.add(light)
  }

  // ----------------------------------
  // animation
  private tick = () => {
    controls.update()
    gl.render()
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
  }
}
