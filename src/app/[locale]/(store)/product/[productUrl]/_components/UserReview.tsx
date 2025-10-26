import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import React from "react";

const UserReview = () => {
  return (
    <>
      {" "}
      <div className="flex flex-col w-full h-auto">
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
          <h2 className="font-light block text-2xl text-gray-900">User Reviews</h2>
          <button className="text-sm text-gray-900 px-6 py-1.5 rounded-md bg-gray-100 border border-gray-700 hover:bg-gray-200 active:bg-light-300">
            New Review
          </button>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center flex-wrap w-full mt-5 text-sm">
            <div className="flex h-8 items-center text-gray-800 font-medium">
              <Image
                src={"/images/images/defaultUser.png"}
                className="rounded-full overflow-hidden mr-3"
                alt=""
                width={32}
                height={32}
              />
              <span>T. Mihai</span>
            </div>
            <span className="text-[#f97a1f] ml-8 font-medium">Verified Purchase</span>
            <div>
              <div className="inline-block ml-8 pl-6 bg-[url('/icons/dateIcon.svg')] bg-no-repeat bg-[position:left_center]">
                30 November 2023
              </div>
              <div className="ml-10 inline-block">
                <button className="h-8 mr-3 font-medium px-3 bg-white border border-white rounded-md text-gray-900 hover:border-green-600 hover:bg-green-800 hover:[&>svg]:fill-green-700 active:border-green-500 active:[&>svg]:fill-green-600">
                  <ThumbsUp width={16} className="fill-white stroke-gray-1000 mr-2" />0
                </button>
                <button className="h-8 mr-3 font-medium px-3 bg-white border border-white rounded-md text-gray-900 hover:border-red-700 hover:bg-[rgba(220,38,38,0.4)] hover:[&>svg]:fill-red-800 active:border-red-500 active:[&>svg]:fill-red-700 [&>svg]:inline-block [&>svg]:[-scale-x-100] [&>svg]:rotate-180 [&>svg]:-translate-y-[3px]">
                  <ThumbsUp width={16} className="fill-white stroke-gray-1000 mr-2" /> 0
                </button>
              </div>
            </div>
          </div>
          <div className="my-4 ml-12 text-sm leading-5 text-gary-900">
            <span>
              {`Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Temporibus suscipit debitis reiciendis repellendus! Repellat rem beatae quo quis 
                    tenetur. Culpa quae ratione delectus id odit in nesciunt saepe pariatur vitae.`}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserReview;
