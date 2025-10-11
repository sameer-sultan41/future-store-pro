import { COMPANIES_LOGOS } from "@/shared/constants/store/homePage/compayLogos";

import CompanyLogo from "@/domains/shop//homePage/components/companyLogo/CompanyLogo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export const CompanyLogoList = () => {
  return (
  <Carousel className="w-full max-w-sm">
      <CarouselContent className="-ml-1 ">
        {COMPANIES_LOGOS.map((companyLogo, idx) =>  (
          <CarouselItem key={idx} className="pl-1 flex aspect-square gap-0 items-center justify-center  md:basis-1/2 lg:basis-1/3">
            <Link
              // className=" h-14 w-48 bg-no-repeat bg-[position-y:center] opacity-80 transition-opacity duration-300 hover:opacity-100"
              href={companyLogo.url}
            >
              <Image
                src={companyLogo.url}
                alt="Company Logo"
                width={companyLogo.width}
                height={56}
                className="object-contain"
              />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
