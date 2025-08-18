"use client"

import FloatingCan from "@/components/FloatingCan"

import { Environment } from "@react-three/drei"
import { Group } from "three"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(useGSAP, ScrollTrigger)

import { useRef } from "react"

import { useStore } from "@/hooks/useStore";

type Props = {}

export default function Scene({ }: Props) {

    const isReady = useStore((state) => state.isReady)

    const can1Ref = useRef<Group>(null) //useRef(tipo do Ref) Group é um elemento do three.js para dizer que dentro dele vai objetos 3d
    const can2Ref = useRef<Group>(null)
    const can3Ref = useRef<Group>(null)
    const can4Ref = useRef<Group>(null)
    const can5Ref = useRef<Group>(null)

    const can1GroupRef = useRef<Group>(null)
    const can2GroupRef = useRef<Group>(null)

    const groupRef = useRef<Group>(null)

    const FLOAT_SPEED = 1.5

    useGSAP(() => {
        if (!can1Ref.current ||
            !can2Ref.current ||
            !can3Ref.current ||
            !can4Ref.current ||
            !can5Ref.current ||
            !can1GroupRef.current ||
            !can2GroupRef.current ||
            !groupRef.current
        ) return;

        isReady()

        //.set das latinhas
        gsap.set(can1Ref.current.position, { x: -1.5 })  //precisamos delcarar oque vamos mudar, pois estamos mexendo com 3d, loucura ne
        gsap.set(can1Ref.current.rotation, { z: -.5 })

        gsap.set(can2Ref.current.position, { x: 1.5 })
        gsap.set(can2Ref.current.rotation, { z: .5 })

        gsap.set(can3Ref.current.position, { y: 5, z: 2 })
        gsap.set(can4Ref.current.position, { x: 2, y: 4, z: 2 })
        gsap.set(can5Ref.current.position, { y: -5 })

        const introTl = gsap.timeline({
            defaults: {
                duration: 3,
                ease: 'back.out(1.4)'
            }
        })

        introTl  //como todos estao com esse zero depois, isso ta falano que todos vao comecar ao mesmo tempo, isso é o delay para comecar a animacao...
            .from(can1GroupRef.current.position, { x: 1, y: -5 }, 0)
            .from(can1GroupRef.current.rotation, { z: 3 }, 0)
            .from(can2GroupRef.current.position, { x: -1, y: 5 }, 0)
            .from(can2GroupRef.current.rotation, { z: 3 }, 0)


        const scrollTl = gsap.timeline({
            defaults: {
                duration: 2,

                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5
                }
            }
        })

        scrollTl
        //rotate group can
            .to(groupRef.current.rotation, {y: Math.PI * 2}) //360 graus
        
            //can 1 - blackCherry
            .to(can1Ref.current.position, {x: -.2, y:-.7, z:-2}, 0)
            .to(can1Ref.current.rotation, {z:.3}, 0)

            //can 2 - lemonline
            .to(can2Ref.current.position, {x: 1, y:-.2, z:-1}, 0)
            .to(can2Ref.current.rotation, {z:0}, 0)
            
            //can 3 - grapes
            .to(can3Ref.current.position, {x: -.3, y:.5, z:-1}, 0)
            .to(can3Ref.current.rotation, {z:-.1}, 0)

            //can 4 - strawberry lemonade
            .to(can4Ref.current.position, {x: 0, y:-.3, z:.5}, 0)
            .to(can4Ref.current.rotation, {z:.3}, 0)
            
            //can 5 - watermelon
            .to(can5Ref.current.position, {x: .3, y:.5, z:-.5}, 0)
            .to(can5Ref.current.rotation, {z:-.25}, 0)

            //move todo grupo para direita e da uma rotacionada
            .to(groupRef.current.position, {x:1, duration:3, ease:'sine.inOut' }, 1.3) //comeca no segundo 1.3


    })


    return (
        <group ref={groupRef}>
            <group ref={can1GroupRef}> {/* o group é necessario para nos referirmos a tal objeto 3d, assim ele sabe que vamos mexer em um objeto 3d */}
                <FloatingCan
                    ref={can1Ref}
                    flavor="blackCherry"
                    floatSpeed={FLOAT_SPEED}
                />
            </group>
            <group ref={can2GroupRef}>
                <FloatingCan
                    ref={can2Ref}
                    flavor="lemonLime"
                    floatSpeed={FLOAT_SPEED}
                />
            </group>
            
            <FloatingCan
                ref={can3Ref}
                flavor="grape"
                floatSpeed={FLOAT_SPEED}
            />
            <FloatingCan
                ref={can4Ref}
                flavor="strawberryLemonade"
                floatSpeed={FLOAT_SPEED}
            />
            <FloatingCan
                ref={can5Ref}
                flavor="watermelon"
                floatSpeed={FLOAT_SPEED}
            />

            <Environment files='/hdr/lobby.hdr' environmentIntensity={1.5} />
        </group>
    )
}