import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const BreadCrumb = ({params}:{params: string[]}) => {
      const getLink = (array: string[], index: number) => {
    let link = "/list";
    for (let i = 0; i <= index; i++) {
      link += "/" + array[i];
    }
    return link;
  };
    const getPageHeader = () => {
    const pageName = params[params.length - 1].split("-");
    pageName.forEach((word, index) => {
      pageName[index] = word[0].toUpperCase() + word.slice(1);
    });

    return pageName.join(" ");
  };
  return (
      <div className="w-full h-auto md:h-[130px] py-5 px-2.5 md:p-0 flex mt-32 sm:mt-0 flex-col justify-center items-center bg-gray-200/80">
        <h1 className="text-2xl block font-light text-gray-900 mb-2">{getPageHeader()}</h1>
        <div className="flex gap-3 items-center text-sm">
          <Link
            href={"/"}
            className="text-gray-500 hover:text-gray-900  after:content-[''] after:w-1 after:h-2 after:ml-2 after:inline-block after:bg-no-repeat after:bg-center after:bg-[url('/icons/arrowIcon01.svg')] last:after:hidden"
          >
            Home
          </Link>
          {params.map((item, index) => (
            <Link
              className={cn(
                "after:w-1 after:h-2 after:ml-2 text-gray-500 after:inline-block after:bg-no-repeat after:bg-center after:bg-[url('/icons/arrowIcon01.svg')]",
                index === params.length - 1 && "after:w-0 text-gray-800"
              )}
              key={index}
              href={getLink(params, index)}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>
        {/* <div className="h-auto md:h-7">
          {!!subCategories?.length && (
            <div className="flex gap-3 border border-gray-300 bg-gray-100 rounded-md mt-2 px-3 py-1 text-gray-400 text-sm">
              More:
              {subCategories.map((cat, index) => (
                <Link
                  href={pathName + "/" + cat.url}
                  key={index}
                  className="text-gray-500 hover:text-gray-900 after:content-[''] md:after:content-['-'] after:w-1 after:h-2 after:ml-2 after:inline-block after:bg-no-repeat after:bg-center last:after:hidden"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          )}
        </div> */}
      </div>
  )
}

export default BreadCrumb