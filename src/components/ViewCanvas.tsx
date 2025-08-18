'use client'

import { Canvas } from "@react-three/fiber"
import { View } from "@react-three/drei"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const Loader = dynamic( //dynamic do Next.js para importar o Loader do Drei somente no cliente e sem renderização do lado servidor (SSR).
    () => import("@react-three/drei").then((mod) => mod.Loader), {  
        ssr: false
    }
)

type Props = {}

export default function ViewCanvas({ }: Props) {

    return (
        <>
            <Canvas
                style={
                    {
                        position: 'fixed',
                        top: 0,
                        left: '50%',
                        transform: "translateX(-50%)",
                        overflow: 'hidden',
                        pointerEvents: 'none',
                        zIndex: 30
                    }}
                shadows
                dpr={[1, 1.5]}
                gl={{ antialias: true }}
                camera={{
                    fov: 30
                }}
            >
                <Suspense fallback={null} > {/* fallback = o que será exibido enquanto o conteúdo assíncrono ainda está carregando. */}
                    <View.Port />
                </Suspense>
            </Canvas>
            <Loader />
        </>
    )
}