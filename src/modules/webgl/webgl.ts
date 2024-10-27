import * as THREE from 'three'
import { EffectComposer, RenderPass } from 'postprocessing'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { MoebiusPass } from './shaders/moebius/moebius.pass'

class WebGL {
  readonly renderer: THREE.WebGLRenderer
  readonly scene: THREE.Scene
  readonly camera: THREE.PerspectiveCamera
  readonly composer: EffectComposer
  readonly time = { delta: 0, elapsed: 0 }

  private clock = new THREE.Clock()
  private resizeCallback?: () => void
  private stats?: Stats

  constructor(width?: number, height?: number) {
    const size = this.size
    width = width ?? size.width
    height = height ?? size.height
    const aspect = width / height

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.VSMShadowMap

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.01, 100)
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(new MoebiusPass())

    const depthTexture = new THREE.DepthTexture(width, height)

    // const depthRenderTarget = FBO(width, height, {
    //   depthTexture,
    //   depthBuffer: true,
    // })

    window.addEventListener('resize', this.handleResize)
  }

  private handleResize = () => {
    this.resizeCallback && this.resizeCallback()

    const { width, height, aspect } = this.size
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.composer.setSize(width, height)
  }

  get size() {
    const { innerWidth, innerHeight } = window
    const width = Math.min(800, innerWidth - 20)
    const height = Math.min(innerHeight - 20, width / 1)

    return { width, height, aspect: width / height }
  }

  setup(container: HTMLElement) {
    container.appendChild(this.renderer.domElement)
  }

  setStats(container: HTMLElement) {
    this.stats = new Stats()
    container.appendChild(this.stats.dom)
  }

  setResizeCallback(callback: () => void) {
    this.resizeCallback = callback
  }

  getMesh<T extends THREE.Material>(name: string) {
    return this.scene.getObjectByName(name) as THREE.Mesh<THREE.BufferGeometry, T>
  }

  render() {
    this.composer.render()
    // this.renderer.render(this.scene, this.camera)
  }

  requestAnimationFrame(callback: () => void) {
    gl.renderer.setAnimationLoop(() => {
      this.time.delta = this.clock.getDelta()
      this.time.elapsed = this.clock.getElapsedTime()
      this.stats?.update()
      callback()
    })
  }

  cancelAnimationFrame() {
    gl.renderer.setAnimationLoop(null)
  }

  dispose() {
    this.cancelAnimationFrame()
    gl.scene?.clear()
  }
}

export const gl = new WebGL()
