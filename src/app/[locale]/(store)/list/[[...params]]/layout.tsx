import { Metadata } from "next";
import BreadCrumb from "./_components/BreadCrumb";
import DropDownList from "@/shared/components/UI/dropDown";
import { sortDropdownData } from "@/domains/shop/productList/constants";

export const metadata: Metadata = {
  title: "future - Products List",
};

const ListLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string; params: string[] };
}) => {
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
        {children}
      </div>
    </div>
  );
};

export default ListLayout;
