"use client";
import Link from "next/link";

import { TodayDeals } from "@/domains/product/constants";

import TodayDealCard from "../../../../../domains/store/homePage/components/todayDealCard/TodayDealCard";
import { Carousel, CarouselContent, CarouselItem ,  CarouselNext,
  CarouselPrevious,} from "@/components/ui/carousel";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


export function TodayDealCards() {
  // Embla ref for carousel navigation
  const emblaApiRef = useRef<any>(null);

  return (
    <section className="w-full mt-14 px-2 md:px-6 ">
      <div className="w-full bg-gray-100 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
        <div className="flex w-full justify-between items-center mb-7">
          <h2 className="text-2xl font-bold ">Today’s Deals</h2>
          <Link
            href={""}
            className="font-medium bg-[position:right_center] hover:pr-5 pr-6  bg-[url('/icons/arrowIcon02.svg')] bg-no-repeat bg-right-center transition-all duration-300 ease-out"
          >
            view all
          </Link>
        </div>
        
          <Carousel className="w-full ">
      <CarouselContent className="-ml-1">

             {TodayDeals.map((deal, index) => (
                <CarouselItem
                 
                 key={index}
                  className="pl-1 md:basis-1/2 lg:basis-1/4 p-4"
                >
                  <TodayDealCard
                    productName={deal.name}
                    oldPrice={deal.price}
                    newPrice={deal.dealPrice}
                    image={deal.imgUrl}
                    spec={deal.specs}
                    dealEndTime={deal.dealDate}
                    url={deal.url}
                  />
                </CarouselItem>
              ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
        </div>

    </section>
  );
}
