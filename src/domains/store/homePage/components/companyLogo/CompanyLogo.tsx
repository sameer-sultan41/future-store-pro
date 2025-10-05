import Image from "next/image";
import Link from "next/link";

type TProps = {
  width: number;
  bgPositionX: number;
  url: string;
};

const CompanyLogo = ({ bgPositionX, url, width }: TProps) => {
  return (
    <Link
      className="bg-[url('/icons/companiesIcons.png')] h-14 w-48 bg-no-repeat bg-[position-y:center] opacity-80 transition-opacity duration-300 hover:opacity-100"
      href={url}
    >
      <Image
        src={url}
        alt="Company Logo"
        width={width}
        height={56}
        className="object-contain"
      />
    </Link>
  );
};

export default CompanyLogo;
