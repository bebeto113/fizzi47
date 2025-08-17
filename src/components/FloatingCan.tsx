"use client"

import { Float } from "@react-three/drei"
import { SodaCan, SodaCanProps } from "@/components/SodaCan"
import { forwardRef, ReactNode } from "react"
import { Group } from "three"


type FloatingCanProps = {
    flavor?: SodaCanProps["flavor"]
    floatSpeed?: number
    rotationSpeed?: number
    floatIntensity?: number
    floatingRange?: [number, number]
    children?: ReactNode
}

const FloatingCan = forwardRef<Group, FloatingCanProps>( //forwardRef<TipoDoRef, TipoDasProps>()
    ({
        flavor = "blackCherry",
        floatSpeed = 1.5,
        rotationSpeed = 1,
        floatIntensity = 1,
        floatingRange = [-0.1, 0.1], //baixo, cima
        children,
        ...props
    }, ref
    ) => {
        return (
            <group ref={ref} {...props}>  {/* e como se fosse ua div, mas é legivel para oque vamos fazer */}
                <Float
                    speed={floatSpeed}
                    rotationIntensity={rotationSpeed}
                    floatIntensity={floatIntensity}
                    floatingRange={floatingRange}
                >
                    {children} {/* conteudo */}
                    <SodaCan flavor={flavor} />
                </Float>
            </group>
        )
    })

FloatingCan.displayName = "FloatingCan"

export default FloatingCan