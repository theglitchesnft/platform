import { GlitchesGrid } from '../components/glitchGrid';
import { LayoutContainer } from '../components/layout';
import { NextSeo } from 'next-seo';
import Image from 'next/image';

export default function HomePage() {
  return (
    <LayoutContainer>
      <NextSeo
        title="The Glitches - Diversity & Inclusion"
        description="NFTs on the Ethereum blockchain focused on diversity and inclusion."
        canonical="https://www.theglitches.xyz/"
      />
      <div className="mb-8 border-2 rounded-lg border-amber-700 bg-amber-50">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-24 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            <span className="block bg-gradient-to-br from-gray-800 via-gray-600 to-[#e30b0d] bg-clip-text pb-0.5 text-center font-black text-transparent">
              Looking to mint your new v2 Glitch?
            </span>
            <span className="mt-6 flex flex-col items-center justify-center lg:justify-start font-kaushan text-[#e30b0d] sm:mt-0 sm:flex-row">
              <span className="inline-flex pl-4 pr-1">
                <span className="w-24 h-24">
                  <Image
                    alt="logo"
                    src="/logos/base.png"
                    quality={100}
                    width={96}
                    height={96}
                    objectFit="contain"
                    layout="responsive"
                  />
                </span>
              </span>
              <div className="text-center sm:text-justify">Glitches 4 Life</div>
            </span>
          </h2>
          <div className="flex mt-8 lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex w-full">
              <div className="flex flex-col items-center w-full"></div>
            </div>
          </div>
        </div>
      </div>

      <GlitchesGrid />
    </LayoutContainer>
  );
}
