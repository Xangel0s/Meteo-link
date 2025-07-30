"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, useTexture, Environment } from "@react-three/drei"
import * as THREE from "three"

// Highlight effect for Peru (moved outside Earth)
function HighlightCountry({ highlightRef, selectedCountry }: Readonly<{ highlightRef: React.RefObject<THREE.Mesh>, selectedCountry: string | null }>) {
  if (!selectedCountry) return null
  return (
    <mesh ref={highlightRef as React.RefObject<THREE.Mesh>}>
      <sphereGeometry args={[2.02, 32, 32]} attach="geometry" />
      <meshBasicMaterial
        color="#3b82f6"
        opacity={0.3}
        transparent={true}
        side={THREE.BackSide}
        attach="material"
      />
    </mesh>
  )
}

// Earth component with single texture
const Earth = ({ onSelectCountry }: { onSelectCountry: (country: string) => void }) => {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const highlightRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [textureLoaded, setTextureLoaded] = useState(false)

  // Load texture
  const colorMap = useTexture("/assets/textures/earth_daymap.jpg", () => {
    setTextureLoaded(true)
  })

  // Rotate the earth slowly
  useFrame(() => {
    if (earthRef.current && !hovered) {
      earthRef.current.rotation.y += 0.0005
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0007 // Clouds rotate slightly faster
    }
    if (highlightRef.current) {
      highlightRef.current.rotation.y = earthRef.current?.rotation.y ?? 0
    }
  })

  // Handle country selection (simplified - in a real app, you'd use proper geo data)
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    setSelectedCountry("peru")
    onSelectCountry("peru")
  }

  if (!textureLoaded) {
    return null // Don't render until texture is loaded
  }

  return (
    <>
      {/* Earth with texture */}
      <mesh
        ref={earthRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[2, 64, 64]} attach="geometry" />
        <meshStandardMaterial
          map={colorMap}
          metalness={0.1}
          roughness={0.7}
          attach="material"
        />
      </mesh>

      {/* Atmosphere glow effect */}
      <mesh>
        <sphereGeometry args={[2.1, 32, 32]} attach="geometry" />
        <meshStandardMaterial
          color="#93c5fd"
          opacity={0.1}
          transparent={true}
          side={THREE.BackSide}
          attach="material"
        />
      </mesh>

      {/* Clouds layer (simplified without texture) */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.05, 32, 32]} attach="geometry" />
        <meshStandardMaterial
          color="white"
          opacity={0.2}
          transparent={true}
          depthWrite={false}
          attach="material"
        />
      </mesh>

      <HighlightCountry highlightRef={highlightRef as React.RefObject<THREE.Mesh>} selectedCountry={selectedCountry} />

      {/* Marker for Lima, Peru removed for a cleaner look */}
      {/* <group position={[-0.7, 0.3, 1.8]} rotation={[0, Math.PI / 2, 0]}>
        <Html transform distanceFactor={8} position={[0, 0, 0.1]} className="pointer-events-none">
          <div className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-md">
            Lima, Perú
          </div>
        </Html>
        <mesh>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group> */}
    </>
  )
}

export function Globe() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSelectCountry = (country: string) => {
    // Navigate to the country page
    router.push(`/${country}/lima`)
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />

        <Earth onSelectCountry={handleSelectCountry} />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.1}
        />
      </Canvas>
    </div>
  )
}
