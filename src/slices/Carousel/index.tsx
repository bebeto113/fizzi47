"use client"

import clsx from "clsx";

import { FC, useRef, useState } from "react";

import { Content } from "@prismicio/client";
import { PrismicRichText, PrismicText, SliceComponentProps } from "@prismicio/react";
import { Center, Environment, View } from "@react-three/drei";
import { Group } from "three";

import FloatingCan from "@/components/FloatingCan";
import { SodaCanProps } from "@/components/SodaCan";

import { ArrowIcon } from "@/slices/Carousel/ArrowIcon";
import { WavyCircles } from "./WavyCircles";

import gsap from "gsap";

const SPINS_ON_CHANGE = 8

const FLAVORS: {
  flavor: SodaCanProps["flavor"];
  color: string;
  name: string;
}[] = [   //o colchete vazio indica que você terá uma lista (array) desses objetos.
    { flavor: "blackCherry", color: "#710523", name: "Black Cherry" },
    { flavor: "grape", color: "#572981", name: "Grape Goodness" },
    { flavor: "lemonLime", color: "#164405", name: "Lemon Lime" },
    { flavor: "strawberryLemonade", color: "#690B3D", name: "Strawberry Lemonade" },
    { flavor: "watermelon", color: "#4B7002", name: "Watermelon Crush" },
  ];


export type CarouselProps = SliceComponentProps<Content.CarouselSlice>;

const Carousel: FC<CarouselProps> = ({ slice }) => {

  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0) //Depois que o componente rerenderiza(ou seja, dps que ele sai funcao e consegue debitar o set), aí currentFlavorIndex === nextIndex
  const sodaCanRef = useRef<Group>(null)  //estamos falando q ele vai estar em um group, que vamos mexer com elementos 3d

  function changeFlavor(index: number) {

    if (!sodaCanRef.current) return
    const nextIndex = (index + FLAVORS.length) % FLAVORS.length //index = 0 => (0 + 5) : 5 = resto 0 (posicao 0) 

    /* ANimacao */
    const tl = gsap.timeline()

    tl.to(sodaCanRef.current.rotation, {
      y: index > currentFlavorIndex ?
        `-=${Math.PI * 2 * SPINS_ON_CHANGE}` :
        `+=${Math.PI * 2 * SPINS_ON_CHANGE}`,
      ease: 'power2.inOut',
      duration: 1
    }, 0)
      .to(".background, .wavy-circles-outer, .waves-circles-inner", {
        backgroundColor: FLAVORS[nextIndex].color,
        fill: FLAVORS[nextIndex].color,
        ease: 'power2.inOut',
        duration: 1
      }, 0)
      .to(".text-wrapper", {duration:.2, y:-10, opacity:0}, 0)
      .to(
        {},
        {onStart: ()=> setCurrentFlavorIndex(nextIndex)}, .5)  //o set é assíncrono — ele não altera o valor na hora, ate pq ele nao consegue, ele esta "preso" na funcao, so consegue sair dela quando a funcao se completa, ai sim ele consegue chegar ate o currentFlavorIndex para depositar o valor que esta carregando no set
      .to(".text-wrapper", {duration:.2, y:0, opacity:1}, .7)

  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="carousel relative grid h-screen grid-rows-[auto, 4fr, auto] justify-center overflow-hidden bg-white py-12 text-white"
    /* O grid-rows ☝️ só define como as linhas do grid vão ser dimensionadas.
      Quem realmente ocupa essas linhas são os filhos diretos do container grid. */
    >
      {/* como essa div ta 👇️em absolute inset-0, ele sai do fluxo normal do grid (não ocupa linha, fica por cima) */}
      <div className="background pointer-events-none absolute inset-0 bg-[#710523] opacity-50" /> {/* INSET-0 = o elemento vai ocupar todo o espaço do elemento pai (se tiver position: absolute ou fixed) */}
      <WavyCircles className="absolute left-1/2 top-1/2 h-[120vmin] -translate-x-1/2 -translate-y-1/2 text-[#710523]" />  {/* background central */}

      {/*1ª linha do grid-rows carousel */}
      <h2 className="relative text-center text-5xl font-bold">
        <PrismicText field={slice.primary.heading} />
      </h2>

      {/*2ª linha do grid-rows carousel */}
      <div className="grid grid-cols-[auto,auto,auto] items-center">

        {/* left */}
        <ArrowButton
          onClick={() => changeFlavor(currentFlavorIndex + 1)} /* fizemos a funcao que muda o carossel conforme o index, aqui estamos mudando o index da funcao */
          direction="left"
          label="Previous Flavor"
        />

        {/* can */}
        <View className="aspect-square h-[70vmin] min-h-40 " > {/* 70vmin significa 70% do menor lado da tela, */}
          <Center position={[0, 0, 1.5]}/* x,y,z */>
            <FloatingCan ref={sodaCanRef} floatIntensity={.3} rotationSpeed={1} flavor={FLAVORS[currentFlavorIndex].flavor} />
          </Center>
          <Environment files={'/hdr/lobby.hdr'} environmentIntensity={.6} environmentRotation={[0, 3, 0]} /* rotação no eixo X (inclinação para cima/baixo), rotação no eixo Y (gira o ambiente horizontalmente), rotação no eixo Z (inclinação lateral) */ />
          <directionalLight intensity={6} position={[0, 1, 1]} />
        </View>

        {/* right */}
        <ArrowButton
          onClick={() => changeFlavor(currentFlavorIndex - 1)} /* fizemos a funcao que muda o carossel conforme o index, aqui estamos mudando o index da funcao */
          direction="right"
          label="Next Flavor"
        />
      </div>

      {/*3ª linha do grid-rows carousel */}
      <div className="text-area relative mx-auto text-center">
        <div className="text-wrapper text-6xl font-medium">
          <p>{FLAVORS[currentFlavorIndex].name}</p>
        </div>
        <div className="text-2xl font-normal placeholder-opacity-90">
          <PrismicRichText field={slice.primary.price_copy} />
        </div>
      </div>
    </section>
  );
};

export default Carousel;

type ArrowButtonProps = {
  direction?: "right" | "left"
  label: string
  onClick: () => void
}

function ArrowButton({ label, onClick, direction = "right" }: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      className="size-12 rounded-full border-2 border-white bg-white/10 p-3 opacity-85 ring-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-16 lg:size-20"
    >
      <ArrowIcon className={clsx(direction === "right" && '-scale-x-100')} />

      <span className="sr-only">
        {label}
      </span>
    </button>
  )
}