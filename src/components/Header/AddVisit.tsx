"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { addVisit } from "@/actions/pageVisit/pageVisitServices";
import { TAddPageVisit } from "@/shared/types/common";

const AddVisit = () => {
  const pathName = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);
  useEffect(() => {
    // Avoid duplicate calls caused by React StrictMode double-invoking effects in development
    if (lastTrackedPathRef.current === pathName) return;
    lastTrackedPathRef.current = pathName;

    const addingVisit = async () => {
      // Only attempt tracking in production to eliminate noisy dev POSTs
      if (process.env.NODE_ENV !== "production") return;
      const deviceResolution = `${window.screen.width} x ${window.screen.height}`;

      const data: TAddPageVisit = {
        pageType: "MAIN",
        deviceResolution,
      };

      if (pathName.includes("/list/")) {
        data.pageType = "LIST";
        const pathArr = pathName.split("/list/");
        data.pagePath = pathArr[pathArr.length - 1];
      }
      if (pathName.includes("/product")) {
        data.pageType = "PRODUCT";
        const pathArr = pathName.split("/product/");
        data.productID = pathArr[pathArr.length - 1];
      }
      try {
        await addVisit(data);
      } catch (e) {
        // swallow logging errors in production; optionally add client-side logging service
        if (process.env.NODE_ENV !== "production") console.warn("addVisit failed", e);
      }
    };
    addingVisit();
  }, [pathName]);
  return <></>;
};

export default AddVisit;
