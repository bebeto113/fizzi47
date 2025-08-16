import { FC } from "react";

import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

import { Bounded } from "@/components/Bounded";
import Button from "@/components/Button";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid">

        <div className="grid h-screen place-items-center">
          <div className="grid auto-rows-min place-items-center text-center">
            <h1 className="hero-header lg:text-[13rem] text-7xl font-black uppercase leading-[.8] text-orange-500 md:text-[9rem]">
              {asText(slice.primary.heading)}
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
            <h2 className="text-side-heading text-balance text-6xl
                          uppercase text-sky-950 font-black lg:text-8xl ">
              <PrismicRichText field={slice.primary.second_heading} />
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
