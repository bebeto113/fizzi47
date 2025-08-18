"use client"

import FloatingCan from "@/components/FloatingCan"

import { Environment } from "@react-three/drei"
import { useRef, useState } from "react"
import { Group } from "three"

import { useMediaQuery } from "@/hooks/useMediaQuery"
import { SodaCanProps } from "@/components/SodaCan"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(useGSAP, ScrollTrigger)

const FLAVORS: {
    flavor: SodaCanProps["flavor"];
}[] = [   //o colchete vazio indica que você terá uma lista (array) desses objetos.
        { flavor: "blackCherry" },
        { flavor: "grape" },
        { flavor: "lemonLime" },
        { flavor: "strawberryLemonade" },
        { flavor: "watermelon" },
    ];

type Props = {}

export default function Scene({ }: Props) {


    const canRef = useRef<Group>(null)
    const bgColors = ["#ffa6b5", "#e9cff6", "#cbef9a",]

    const isDesktop = useMediaQuery('(min-width: 768px)', true)

    const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0)
    const flavorIndexRef = useRef(0)

    function changeFlavor(index: number) {
        if (!canRef.current) return

        const nextIndex = (index + FLAVORS.length) % FLAVORS.length
        setCurrentFlavorIndex(nextIndex)
        flavorIndexRef.current = nextIndex //ele esta em tempo real aqui, antes quando estava dentro do forEach ele so rodava uma vez essa funcao //antes estava assim no onStart-> changeFlavor(currentFlavorIndex + 1)
    }

    useGSAP(() => {
        if (!canRef.current) return
        const sections = gsap.utils.toArray(".alternating-section")  // transformamos todos elementos q tem essa classe em array, no caso so tem ele
        // Ou seja, gsap.utils.toArray é só uma forma conveniente de transformar seletores em arrays para animar cada item.

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".alternating-text-view", //define o elemento que inicia o controle do scroll (isso eu ja sei)
                endTrigger: ".alternating-text-container", //indica até onde o ScrollTrigger deve ir
                pin: true,
                start: "top top", //indica quando a animação inicia, No caso, quando o topo do trigger (.alternating-text-view) alinha com o topo da viewport.
                end: "bottom bottom", //indica quando a animação termina, Aqui é quando o bottom do endTrigger (.alternating-text-container) alinha com o bottom da viewport.
                scrub: 1.5
            }
        })

        sections.forEach((_, index) => {
            if (!canRef.current) return
            if (index === 0) return

            const isOdd = index % 2 !== 0  //diferente de 0 = Impar ///LEMBRANDO da regra que definimos no index.tsx: se o numero for par comece na esquerda, senao comece na direita

            const xPosition = isDesktop ? (isOdd ? "-1" : "1") : 0
            const yPosition = isDesktop ? (isOdd ? ".4" : "-.4") : 0
            const xSetRotation = isDesktop ? 0 : -0.5
            const yRotation = isDesktop ? 0 : Math.PI * 2

            scrollTl
            .set(canRef.current.rotation, {z: xSetRotation})
                .to(canRef.current.position, {
                    x: xPosition,
                    ease: 'circ.inOut',
                    delay: .5,
                    onStart: () => {
                        if (!canRef.current) return  
                        changeFlavor(flavorIndexRef.current + 1)
                        gsap.to(canRef.current.rotation, {
                            y: yRotation,
                            ease: "power2.inOut"
                        })
                    },
                    onReverseComplete: () => {
                        if (!canRef.current) return  
                        changeFlavor(flavorIndexRef.current - 1)
                        gsap.to(canRef.current.rotation, {
                            y:( -1 * yRotation),
                            ease: "power2.inOut"
                        })
                    }
                })
                .to(canRef.current.rotation, {
                    y: yPosition,
                    ease: 'back.inOut',

                }, "<")
                .to(".alternating-text-container", {
                    backgroundColor: gsap.utils.wrap(bgColors, index),

                })
        })
    }, { dependencies: [isDesktop] })

    return (
        <group ref={canRef} position-x={isDesktop ? 1 : 0} rotation-y={isDesktop ? -0.3 : 0}>
            <FloatingCan flavor={FLAVORS[currentFlavorIndex].flavor} />
            <Environment files='/hdr/lobby.hdr' environmentIntensity={1.5} />
        </group>
    )
}