"use client"

import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { Bounded } from "@/components/Bounded";
import Scene from "./Scene";
import { View } from "@react-three/drei";

export type SkyDiveProps = SliceComponentProps<Content.SkyDiveSlice>;


const SkyDive: FC<SkyDiveProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="skydive h-screen"
    >
      <h2 className="sr-only">{slice.primary.sentence}</h2>

{/* o View que renderiza as animacoes 3d, entao a personalizacao dele é na verdade em relacao a "div" que guarda essas animacoes/latas */}
      <View className="h-screen w-screen"> 
        <Scene flavor={slice.primary.flavor} sentence={slice.primary.sentence} /> {/*slice.primary.flavor E  slice.primary.sentence sao os code snippets dos elementos que criamos pelo prismic... */}
      </View>

    </Bounded>
  );
};

export default SkyDive;
