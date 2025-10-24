import { useGLTF } from '@react-three/drei'
import { useEffect, useState, type FC } from 'react'
import { Light, Mesh, MeshToonMaterial, Object3D } from 'three'

interface Props {
  readonly src: string
  readonly isToon?: boolean
  readonly name?: string
}

export const WebGLGLTFModel: FC<Props> = ({ src, isToon, name }) => {
  const gltf = useGLTF(src)

  const [lights, setLights] = useState<Light[]>([])
  const [model, setModel] = useState<Object3D | undefined>()

  useEffect(() => {
    if (gltf) {
      const lights: Light[] = []
      gltf.scene.traverse((child) => {
        if (child instanceof Light) {
          lights.push(child)
          child.intensity = child.intensity / 100
          child.castShadow = true
          child.shadow.camera.near = 0.001
          child.shadow.camera.far = 100
          child.shadow.mapSize.width = 2560
          child.shadow.mapSize.height = 2560
          child.shadow.bias = -0.002
          child.shadow.radius = 1
          return
        }

        if (child instanceof Mesh) {
          child.geometry.computeVertexNormals()
          child.castShadow = true
          child.receiveShadow = child.name.includes('Floor')
          console.log(child)

          const material = child.material
          if (isToon) {
            child.material = new MeshToonMaterial({ color: material?.color, map: material?.map })
          }
        }
      })

      setLights(lights)
    }
  }, [gltf])

  useEffect(() => {
    let modelFound: Object3D | undefined

    if (gltf && name) {
      gltf.scene.traverse((child) => {
        if (!modelFound && child.name === name) {
          modelFound = child.clone()
          modelFound.position.set(0, 0, 0)
        }
      })
    }

    setModel(modelFound)
  }, [gltf, name])

  return (
    <group>
      <>
        {model ? <primitive object={model} /> : gltf && <primitive object={gltf.scene} />}

        {lights.map((light, index) => (
          <primitive key={index} object={light} />
        ))}
      </>
    </group>
  )
}
