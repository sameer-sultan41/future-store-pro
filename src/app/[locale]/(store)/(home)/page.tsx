import { Metadata } from "next";

import {
  CollectionCards,
  CompanyLogoList,
  HomeCategoryList,
  HomeSlider,
  LatestBlogPosts,
  TodayDealCards,
  TopSellingProductsList,
  WideCardRow,
} from "@/domains/store/homePage/components";
import { threeSaleCards, twoSaleCards } from "@/domains/store/homePage/constants";

export const metadata: Metadata = {
  title: "Future Store - Homepage",
};

export default function Home() {
  return (
    <div className="w-full bg-mint-500">
      <div className="storeContainer flex-col">
        <div className="flex w-full mt-40">
          <HomeCategoryList />
          <HomeSlider />
        </div>
        <TodayDealCards />
        <WideCardRow cards={threeSaleCards} />
        {/* <WideCardRow cards={twoSaleCards} /> */}
        <CollectionCards />
        <TopSellingProductsList />
        <LatestBlogPosts />
        {/* <CompanyLogoList /> */}
      </div>
    </div>
  );
}
