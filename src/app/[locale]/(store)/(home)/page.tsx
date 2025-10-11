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
} from "@/domains/shop/homePage/components";
import { threeSaleCards } from "@/domains/shop/homePage/constants";
import { getSettingsData } from "@/actions/settings/settings";

export const metadata: Metadata = {
  title: "Future Store - Homepage",
};

export default async function Home() {
  const settings = await getSettingsData();

  return (
    <div className="w-full bg-mint-500">
      <div className="storeContainer flex-col">
        <div className="flex w-full mt-40">
          <HomeCategoryList />
          <HomeSlider CarouselData={settings.carousels} />
        </div>
        <TodayDealCards locale="en" />
        <WideCardRow cards={threeSaleCards} />
        {/* <WideCardRow cards={twoSaleCards} /> */}
        <CollectionCards />
        <TopSellingProductsList />
        {/* <LatestBlogPosts /> */}
        {/* <CompanyLogoList /> */}
      </div>
    </div>
  );
}
