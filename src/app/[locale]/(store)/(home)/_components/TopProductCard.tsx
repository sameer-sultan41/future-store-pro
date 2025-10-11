import Image from "next/image";
import Link from "next/link";
import { TProductCard } from "@/shared/types/common";
import { cn } from "@/shared/utils/styling";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faEye, faBalanceScale } from "@fortawesome/free-solid-svg-icons";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopProductCard = ({
  name,
  imgUrl,
  price,
  dealPrice = undefined,
  specs,
  url,
  isAvailable = true,
  staticWidth = false,
  currency,
}: TProductCard) => {
  const currencySymbol = currency?.symbol || "Rs";

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-3 transition-all duration-500 relative border border-gray-200 shadow-sm hover:shadow-lg group overflow-hidden flex flex-col",
        staticWidth && "min-w-64"
      )}
    >
      {/* Top right action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-row gap-2 items-center">
        <span className="cursor-pointer">
          <Heart width={22} className="fill-white drop-shadow-lg stroke-primary" />
        </span>
        <button
          title="Compare"
          className="bg-white rounded-full p-1 shadow hover:bg-gray-100 transition border border-gray-200"
        >
          <FontAwesomeIcon icon={faBalanceScale} className="text-gray-500" />
        </button>
        <button
          title="View"
          className="bg-white rounded-full p-1 shadow hover:bg-gray-100 transition border border-gray-200"
        >
          <FontAwesomeIcon icon={faEye} className="text-gray-500" />
        </button>
      </div>
      {!isAvailable && (
        <div className="flex left-2 right-2 bottom-2 top-2 bg-white/60 backdrop-blur-[2px] absolute z-[1] items-center justify-center rounded-2xl">
          <span className="mt-14 text-gray-100 font-light px-6 py-1 backdrop-blur-[6px] rounded-md shadow-gray-200 bg-black/60">
            Out of Stock
          </span>
        </div>
      )}
      <div className="imageWrapper w-full h-[200px] block relative rounded-xl border border-gray-100 overflow-hidden transition-all duration-500 bg-gray-50 flex items-center justify-center">
        <Image
          src={imgUrl[0]}
          alt={name}
          fill
          sizes="(max-width: 240px)"
          className="object-contain transition-all duration-400 ease-out group-hover:opacity-0 group-hover:scale-95"
        />
        <Image
          src={imgUrl[1]}
          alt={name}
          fill
          sizes="(max-width: 240px)"
          className="object-contain transition-all duration-400 ease-out opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100"
        />
      </div>
      <div className="flex flex-col items-start mt-3 mb-2 px-1">
        <span className="text-base font-semibold text-gray-900 truncate w-full mb-1">{name}</span>
        <div className="h-12 flex flex-col w-full">
          {specs.map((spec, index) => (
            <span key={index} className="block text-xs text-gray-500 truncate">
              {spec}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 mx-1 mt-auto">
        <div className="flex items-end">
          <div className="flex-grow relative flex flex-col justify-end">
            {dealPrice ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs rounded px-2 py-0.5 text-primary bg-primary/10">
                    -{(100 - (dealPrice / price) * 100).toLocaleString("en-us", { maximumFractionDigits: 0 })}%
                  </span>
                  <span className="line-through text-gray-400 text-xs">
                    was {price.toLocaleString("en-us", { minimumFractionDigits: 2 })}
                    {currencySymbol}
                  </span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {dealPrice.toLocaleString("en-us", { minimumFractionDigits: 2 })}
                  {currencySymbol}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">
                {price.toLocaleString("en-us", { minimumFractionDigits: 2 })}
                {currencySymbol}
              </span>
            )}
          </div>
        </div>
        <Button className="w-full mt-2 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faCartPlus} className="text-white" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default TopProductCard;
