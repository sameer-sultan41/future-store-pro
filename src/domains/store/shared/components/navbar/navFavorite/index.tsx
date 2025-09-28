import { HeartIcon } from "@/shared/components/icons/svgIcons";

const NavBarFavorite = () => {
  return (
    <div className="flex relative items-center  stroke-gray-500 hover:stroke-gray-800 cursor-pointer">
      <HeartIcon width={20} className="fill-white transition-all duration-200 stroke-inherit" />
      <span className="absolute -top-0.5 text-sm leading-6 -right-4 size-6 bg-gray-300 text-center rounded-full">
        0
      </span>
    </div>
  );
};

export default NavBarFavorite;
