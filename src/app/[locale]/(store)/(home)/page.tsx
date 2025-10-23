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
import { FlashDeal, getTodayDeals } from "@/actions/product/deals";

export const metadata: Metadata = {
  title: "Future Store - Homepage",
};

export default async function Home({ params }: { params: Promise<{ locale: string; params?: string[] }> }) {
  const { locale } = await params;
  const settings = await getSettingsData();

  const { data: flashDeals, error } = await getTodayDeals(locale);

  return (
    <div className="w-full bg-mint-500">
      <div className="storeContainer flex-col">
        <div className="flex w-full mt-40">
          <HomeCategoryList />
          <HomeSlider CarouselData={settings.carousels} />
        </div>
        <WideCardRow cards={threeSaleCards} />
        {flashDeals?.map((item) => (
          <TodayDealCards key={item.id} DealData={item} />
        ))}

        {/* <WideCardRow cards={twoSaleCards} /> */}
        <CollectionCards />
        <TopSellingProductsList />
        {/* <LatestBlogPosts /> */}
        {/* <CompanyLogoList /> */}
      </div>
    </div>
  );
}
