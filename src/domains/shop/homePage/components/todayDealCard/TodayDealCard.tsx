"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { ClockIcon, HeartIcon } from "@/shared/components/icons/svgIcons";
// FontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faEye, faBalanceScale } from "@fortawesome/free-solid-svg-icons";
import { Heart, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrencyFromCookie } from "@/actions/server";
import { get } from "http";

type TProps = {
  productName: string;
  newPrice: number;
  oldPrice: number;
  image: string[];
  dealEndTime: string;
  desc?: string;
  url: string;
};

const TodayDealCard = ({ productName, newPrice, oldPrice, image, dealEndTime, desc = "", url }: TProps) => {
  const [currency, setCurrency] = useState<{
    code: string;
    symbol: string;
    exchange_rate_to_usd: number;
  } | null>(null);

  // Fetch currency from cookie
  useEffect(() => {
    const getCurrency = async () => {
      const currency = await getCurrencyFromCookie();
      setCurrency(currency);
    };
    getCurrency();
  }, []);

  // Convert price using exchange rate if currency is set and not USD
  const getConvertedPrice = (price: number) => {
    if (!currency) return price;
    if (currency.code !== "USD" && currency.exchange_rate_to_usd) {
      return price / currency.exchange_rate_to_usd;
    }
    return price;
  };

  const currencySymbol = currency?.symbol || "€";

  const saveAmount = getConvertedPrice(oldPrice) - getConvertedPrice(newPrice);

  const [remainedTime, setRemainedTime] = useState(() => {
    // Ensure dealEndTime is a Date object
    return typeof dealEndTime === "string" ? new Date(dealEndTime) : dealEndTime;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainedTime((prev) => {
        if (!prev || isNaN(prev.getTime())) return prev; // Prevent error
        const next = new Date(prev.getTime() - 1000);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper to format time safely
  const formatTime = (date: Date) => {
    if (!date || isNaN(date.getTime())) return "00:00:00";
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="relative p-2  rounded-xl shadow-sm  group bg-white border border-gray-200"
    >
      <motion.div
        className="absolute top-3 right-3 z-10 cursor-pointer flex gap-2"
        whileTap={{ scale: 0.8, rotate: -15 }}
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Heart width={22} className="fill-white drop-shadow-lg stroke-primary" />
      </motion.div>
      <motion.div
        className="absolute top-3 right-12 z-10 cursor-pointer flex gap-2"
        whileTap={{ scale: 0.8, rotate: -15 }}
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Scale width={22} className="fill-white drop-shadow-lg stroke-primary" />{" "}
      </motion.div>

      <Link
        href={url}
        className="imgWrapper w-full h-[220px] block relative overflow-hidden border-2 border-gray-200 rounded-xl group"
      >
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-full h-full"
        >
          <Image
            alt={productName}
            src={image[0]}
            fill
            sizes="(max-width:240px)"
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-110"
            style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.10))" }}
          />
        </motion.div>
      </Link>
      <motion.div
        className="absolute top-5 left-5 rounded-md px-2 py-1 bg-primary text-primary-foreground text-sm shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <span className="font-bold tracking-wide">
          Save {saveAmount.toLocaleString("en-us", { minimumFractionDigits: 2 })} {currencySymbol}
        </span>
      </motion.div>
      <Link href={url}>
        <motion.h3
          className="mt-3.5 mb-3 ml-2 text-gray-700 font-semibold text-lg truncate"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {productName}
        </motion.h3>
      </Link>

      <motion.span
        className="block h-14 w-full mb-1 text-sm text-gray-500 italic line-clamp-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {desc}
      </motion.span>

      <div className="flex flex-col gap-2 mx-2 mt-2">
        <div className="flex justify-between items-end">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <span className="block text-gray-400 text-xs line-through select-none">
              was {getConvertedPrice(oldPrice).toLocaleString("en-us", { useGrouping: true, minimumFractionDigits: 2 })} {currencySymbol}
            </span>
            <motion.span
              className="block text-2xl font-bold text-primary drop-shadow-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              {getConvertedPrice(newPrice).toLocaleString("en-us", { useGrouping: true, minimumFractionDigits: 2 })} {currencySymbol}
            </motion.span>
          </motion.section>
          <motion.section
            className="text-center text-red-500 flex items-center flex-col gap-1.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <ClockIcon width={18} className="fill-red-500 my-2 mt-2.5 mx-auto block" />
            <motion.span
              className="w-24 h-7 rounded-md border border-red-300 bg-white/60 pt-[1px] text-base font-semibold tracking-wider shadow-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              {formatTime(remainedTime)}
            </motion.span>
          </motion.section>
        </div>
        <Button>
          <FontAwesomeIcon icon={faCartPlus} className="text-white" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default TodayDealCard;
