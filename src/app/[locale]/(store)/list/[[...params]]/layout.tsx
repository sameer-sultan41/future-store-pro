import { Metadata } from "next";
import BreadCrumb from "./_components/BreadCrumb";
import DropDownList from "@/shared/components/UI/dropDown";
import { sortDropdownData } from "@/domains/shop/productList/constants";
import Filters from "@/app/[locale]/(store)/list/[[...params]]/_components/Filters";
import Image from "next/image";
import SortByFilters from "./_components/SortByFilters";
import { getAllBrands } from "@/actions/brands/brands";

export const metadata: Metadata = {
  title: "future - Products List",
};

const ListLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string; params: string[] };
}) => {
  const result = await getAllBrands();

  return (
    <div className="mt-[136px] bg-white">
      <BreadCrumb params={params.params} />

      <div className="storeContainer flex flex-col">
        <div className="flex visible lg:hidden w-full mt-3 px-3 justify-between">
          <button
            className="border border-gray-200 rounded-md cursor-pointer pr-5 py-2 pl-8 bg-white text-gray-700 text-sm tracking-[1px] bg-[url('/icons/filterIcon.svg')] bg-no-repeat bg-[position:10px_center] transition-all duration-300 hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 active:border-gray-400"
            // onClick={() => toggleFiltersWindow(true)}
          >
            FILTERS
          </button>
          <DropDownList data={sortDropdownData} width="180px" />
        </div>
        <div className="w-full flex pt-3 lg:mt-9 md:pt-2">
          {result.res && <Filters brands={result.res} />}
          <div className="flex-grow flex flex-col ml-0 2xl:ml-4 lg:ml-3">
            <div className="w-full items-center text-sm mb-5 ml-3 hidden lg:flex">
              <Image src={"/icons/sortIcon.svg"} alt="Sort" width={16} height={12} className="mr-3" />
              <span className="font-medium w-14 mr-3 text-gray-900">Sort By:</span>
              <SortByFilters />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListLayout;
