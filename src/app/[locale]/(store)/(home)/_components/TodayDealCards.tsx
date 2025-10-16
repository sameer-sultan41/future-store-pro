"use client";
import Link from "next/link";
import { FlashDeal, getTodayDeals } from "@/actions/product/deals";
import TodayDealCard from "@/domains/shop/homePage/components/todayDealCard/TodayDealCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Locale } from "next-intl";

export function TodayDealCards({ DealData }: { DealData: FlashDeal }) {
  return (
    <section className="w-full mt-14 px-2 md:px-6 ">
      <div className="w-full bg-gray-100 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
        <div className="flex w-full justify-between items-center mb-7">
          <h2 className="text-2xl font-bold ">{DealData.name}</h2>
          {/* <Link
            href={"/deals"} // You might want to create a page for all deals
            className="font-medium bg-[position:right_center] hover:pr-5 pr-6  bg-[url('/icons/arrowIcon02.svg')] bg-no-repeat bg-right-center transition-all duration-300 ease-out"
          >
            view all
          </Link> */}
        </div>

        <Carousel className="w-full ">
          <CarouselContent className="-ml-1">
            {DealData.flash_deal_products.map((deal, index) => (
              <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/4 p-4">
                <TodayDealCard
                  productName={deal.product?.product_translations[0].name || "Product"}
                  oldPrice={deal.product?.price || 0}
                  newPrice={deal.deal_price || 0}
                  image={deal.product?.images || ["/images/images/defaultUser.png"]}
                  desc={deal.product?.product_translations[0].description || ""}
                  dealEndTime={DealData.end_date}
                  url={`${deal.product?.url}`}
                  productId={deal.product?.id}
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
