"use client"

import { FC } from "react";

import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger)

import { Bounded } from "@/components/Bounded";
import Button from "@/components/Button";
import { TextSplitter } from "@/components/TextSplitter";


export type HeroProps = SliceComponentProps<Content.HeroSlice>;

const Hero: FC<HeroProps> = ({ slice }) => {

  useGSAP(() => {
    const introTl = gsap.timeline()

    introTl.set('.hero', { opacity: 1 }) //questao de estetica, todos elementos entram ao mesmo tempo, fica melhor a animacao, para isso colocamos opacity-0 no hero
      .from(".hero-header-word", {
        scale: 3,
        opacity: 0,
        ease: 'power4.in',
        delay: 0.1,
        stagger: 0.5
      })
      .from(".hero-subheading", {
        opacity: 0,
        y: 30,
      }, '+=0.8')
      .from(".hero-body", {
        opacity: 0,
        y: 10,
      })
      .from(".hero-button", {
        opacity: 0,
        y: 10,
        duration: .6
      })


    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      }
    })

    scrollTl
      .fromTo("body", {
        backgroundColor: "#FDE047"
      }, 
      {
        backgroundColor: '#D9F99D',
        overwrite: "auto"
      }, 1 //duracao da timeLine
      )
      //👇️ele apenas comeca a animacao quando entra na tela, pois antes de entrar nela nao tinha scroll para ele, mas assim que ele aparece na tela, o scrolltrigger entra em acao pois encontra um scroll para se basear
      .from('.text-side-heading .split-char', {  //usamos .from pois assim vamos ver os elementos chegando em sua posicao no finalzinho da secao, vai ser complementado, é como se ela so acontecesse depois que a de cima acabasse(na teoria nao é assim, mas na pratica ficou) 
        scale: 1.3,              
        y:40,
        rotate:-25,
        opacity:0,
        stagger: .1,
        ease: 'back.out(3)',
        duration:.5
      })
      .from(".text-side-body", {
        y:20,
        opacity:0,
      })

  })

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="hero opacity-0"
    >
      <div className="grid">

        <div className="grid h-screen place-items-center">
          <div className="grid auto-rows-min place-items-center text-center">
            <h1 className="hero-header-word lg:text-[13rem] text-7xl font-black uppercase leading-[.8] text-orange-500 md:text-[9rem]">
              <TextSplitter text={asText((slice.primary.heading))} wordDisplayStyle="block" className="hero-header-word" />
            </h1>

            <div className="hero-subheading mt-12 text-5xl font-semibold text-sky-950 lg:text-6xl">
              <PrismicRichText field={slice.primary.subheading} />
            </div>

            <div className="hero-body text-2xl font-normal text-sky-950">
              <PrismicRichText field={slice.primary.body} />
            </div>

            <Button
              buttonLink={slice.primary.button_link}
              buttonText={slice.primary.button_text}
              className="hero-button mt-12"
            />
          </div>
        </div>

        <div className="grid text-side relative z-[80] h-screen items-center gap-4 md:grid-cols-2">
          <PrismicNextImage
            className="md:hidden w-full"
            field={slice.primary.cans_image}
          />

          <div>
            <h2 className="text-side-heading text-balance text-6xl uppercase text-sky-950 font-black lg:text-8xl ">
              <TextSplitter text={asText(slice.primary.second_heading)} />
            </h2>
            <div className="text-side-body mt-4 max-w-xl text-balance text-xl font-normal text-sky-950">
              <PrismicRichText field={slice.primary.second_body} />
            </div>
          </div>
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;
