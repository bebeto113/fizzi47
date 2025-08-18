"use client"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(useGSAP, ScrollTrigger)

import FloatingCan from '@/components/FloatingCan'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Content } from '@prismicio/client'
import { Cloud, Clouds, Environment, Text } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'


type SkyDiveProps = {
    sentence: string | null
    flavor: Content.SkyDiveSliceDefaultPrimary["flavor"]  //aqui ele esta pegando os dados que criamos no select pelo prismic
}

export default function Scene({ sentence, flavor }: SkyDiveProps) {

    const groupRef = useRef<THREE.Group>(null) //o useRef deixa usar coisas específicas desse objeto(THREE.Group)
    const canRef = useRef<THREE.Group>(null)
    const cloud1Ref = useRef<THREE.Group>(null)
    const cloud2Ref = useRef<THREE.Group>(null)
    const cloudsRef = useRef<THREE.Group>(null)
    const wordsRef = useRef<THREE.Group>(null)

    const ANGLE = 75 * (Math.PI / 180)

    const getXPosition = (distance: number) => distance * Math.cos(ANGLE)
    const getYPosition = (distance: number) => distance * Math.sin(ANGLE)

    const getXYPositions = (distance: number) => ({
        x: getXPosition(distance),
        y: getYPosition(-1 * distance)  //transformamos a altura negativa para comecar debaixo e conseguirmos ver ela subindo
    })

    useGSAP(() => {
        if (
            !groupRef.current ||
            !canRef.current ||
            !cloud1Ref.current ||
            !cloud2Ref.current ||
            !cloudsRef.current
        ) return

        //Set inicials positions
        gsap.set(cloudsRef.current.position, { z: 10 })
        gsap.set(canRef.current.position, { ...getXYPositions(-4) })  //invertemos os valores aqui, ou seja, antes estava vindo debaixo e da direita, agora vem de cima e da esquerda
        if (wordsRef.current) {
            gsap.set(
                wordsRef.current.children.map((word) => word.position),
                { ...getXYPositions(7), z: 2 } //os três pontos desembrulham as propriedades do objeto.
            )
        }

        //spinning can
        gsap.to(canRef.current.rotation, { y: Math.PI * 2, duration: 1.7, repeat: -1, ease: 'none' })

        //infinite cloud movement
        const DISTANCE = 15
        const DURATION = 6

        gsap.set([cloud2Ref.current.position, cloud1Ref.current.position],
            { ...getXYPositions(DISTANCE) })

        gsap.to(cloud1Ref.current.position, {
            y: `+=${getYPosition(DISTANCE * 2)}`,
            x: `+=${getXPosition(DISTANCE * -2)}`,
            ease: 'none',
            duration: DURATION,
            repeat: -1
        })
        gsap.to(cloud2Ref.current.position, {
            y: `+=${getYPosition(DISTANCE * 2)}`,
            x: `+=${getXPosition(DISTANCE * -2)}`,
            ease: 'none',
            duration: DURATION,
            delay: DURATION / 2,
            repeat: -1
        })

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".skydive",
                pin: true,
                start: "top top",
                end: "+=2000",
                scrub: 1.5
            }
        })

        scrollTl
            .to("body", {
                backgroundColor: "#c0f0f5",
                overwrite: 'auto',
                duration: .1,
            })
            .to(cloudsRef.current.position, { z: 0, duration: .3 }, 0)
            .to(canRef.current.position, { x: 0, y: 0, duration: .3, ease: 'none' })
        if (wordsRef.current) {
            scrollTl.to(wordsRef.current.children.map((word) => word.position),
                {
                    keyframes: [
                        { x: 0, y: 0, z: -.5 },
                        { ...getXYPositions(-7), z: -7 }
                    ],
                    stagger: .2
                }, 0)
        }
        scrollTl
            .to(canRef.current.position, { ...getXYPositions(4), duration: .5, ease: 'back.in(1.7)' })
            .to(cloudsRef.current.position, {z:10})
            .to("body", {backgroundColor:"#FDE047"})

    })


    return (
        <group ref={groupRef}>
            <group rotation={[0, 0, 0.5]}> {/*x,y,z*/}{/* poderiamos colocar o rotation direto na lata, mas isso ficaria oscilando, pois vamos fazer ela ficar em looping, entao é melhor colocar no container dela */}
                <FloatingCan ref={canRef} flavor={'blackCherry'}
                    rotationSpeed={0}
                    floatIntensity={3}
                    floatSpeed={3}
                >
                    <pointLight intensity={30} color={'#8c0413'} decay={0.6} />
                </FloatingCan>
            </group>

            {/* clouds */}
            <Clouds ref={cloudsRef}>
                <Cloud ref={cloud1Ref} bounds={[10, 10, 2]} />
                <Cloud ref={cloud2Ref} bounds={[10, 10, 2]} />
            </Clouds>

            {/* text */}
            <group ref={wordsRef}>
                {sentence && <ThreeText sentence={sentence} color='#f97315' />} {/* Quando você escreve <ThreeText sentence={sentence} />, o React chama a função automaticamente passando as props.  */}
            </group>

            {/* lights */}
            <ambientLight intensity={2} color="#9ddefa" />
            <Environment files={'/hdr/field.hdr'} environmentIntensity={1.5} />
        </group>
    )
}

function ThreeText({ sentence, color = 'white' }: {  //TIPAGEM INLINE do typescript
    color?: string
    sentence: string
}) {

    const words = sentence.toUpperCase().split(" ") //Pega a frase (sentence) e transforma em maiusculas. //Depois separa em palavras, criando um array words

    const material = new THREE.MeshLambertMaterial() //Cria um material do Three.js para objetos 3D.
    const isDesktop = useMediaQuery("min-width: 950px", true)

    return words.map((word: string, wordIndex: number) => ( //Para cada palavra do array words, retorna um <Text> do drei // Cada palavra vira um objeto 3D separado, permitindo animar ou posicionar individualmente.
        <Text
            key={`${wordIndex}-${word}`}
            scale={isDesktop ? 1 : 1}
            color={color}
            material={material}
            font='/fonts/Alpino-Variable.woff'
            fontWeight={900}
            anchorX={'center'}
            anchorY={'middle'}
            characters='ABCDEFGHIJKLMNOPQRSUVWXYZ!,.?'
        >
            {word}
        </Text>
    ))
}

/* ☝️☝️☝️ Isso é um React Functional Component (FC). 
Ou seja:
A função ThreeText recebe props como argumento ({ sentence, color }).
Retorna JSX (<Text> ... </Text>).
*/