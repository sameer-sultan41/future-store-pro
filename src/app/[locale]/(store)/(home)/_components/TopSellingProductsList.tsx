import Link from "next/link";
import { TopProducts } from "@/domains/product/constants";
import TopProductCard from "@/app/[locale]/(store)/(home)/_components/TopProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getCurrencyFromCookie } from "@/actions/server";
import { convertPrice } from "@/shared/utils/currency_action";
import { getConvertedPrice } from "@/shared/utils/helper";

export const TopSellingProductsList = async () => {
  const currency = await getCurrencyFromCookie();
  return (
    <section className="w-full mt-14 px-2 md:px-6 ">
      <div className="w-full bg-gray-100 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
        <div className="flex w-full justify-between items-center mb-7">
          <h2 className="text-2xl font-bold ">Top Selling Products</h2>
          <Link
            href={""}
            className="font-medium bg-[position:right_center] hover:pr-5 pr-6  bg-[url('/icons/arrowIcon02.svg')] bg-no-repeat bg-right-center transition-all duration-300 ease-out"
          >
            view all
          </Link>
        </div>
        <div className="relative">
          <Carousel className="w-full ">
            <CarouselContent className="-ml-1 gap-2 p-5">
              {TopProducts.map((product, index) => (
                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/4 ">
                  <TopProductCard
                    name={product.name}
                    imgUrl={product.imgUrl}
                    price={getConvertedPrice(currency, product.price)}
                    specs={product.specs}
                    url={product.url}
                    dealPrice={getConvertedPrice(currency, product.dealPrice || product.price)}
                    key={index}
                    staticWidth
                    currency={currency}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
