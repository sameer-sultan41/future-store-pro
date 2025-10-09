import Image from "next/image";
import React from "react";

const NoResultImage = ({ className }: { className?: string }) => {
  return (
    <Image
      src={"/images/no-data-found.svg"}
      width={250}
      height={250}
      alt="no data found"
      className={`mx-auto my-36 ${className}`}
    />
  );
};

export default NoResultImage;
