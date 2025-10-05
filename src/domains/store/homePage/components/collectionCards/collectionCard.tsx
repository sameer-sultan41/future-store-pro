
"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TCollectionCard } from "../../types";

type TProps = {
  collection: TCollectionCard;
};


const CollectionCard = ({ collection }: TProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{  borderColor: "#a5b4fc" }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="min-w-[324px] h-[250px] flex relative rounded-xl bg-white overflow-hidden mb-5 border border-gray-200 group"
    >
      <div className="flex-grow-2 ml-[30px] flex flex-col justify-center">
        <h2 className="text-gray-800 mb-3 mt-7 font-semibold text-lg tracking-wide group-hover:text-primary transition-colors duration-300">{collection.name}</h2>
        {collection.collections.map((collection, index) => (
          <Link
            href={collection.url}
            key={index}
            className="block relative text-sm leading-6 text-gray-700 z-[2] hover:text-primary transition-colors duration-200"
          >
            {collection.label}
          </Link>
        ))}
      </div>
      <motion.div
        className="absolute top-2 right-3.5 w-[140px] h-[180px] z-[1]"

        // transition={{ type: "spring", stiffness: 200 }}
      >
        <Image src={collection.imgUrl} alt={collection.name} fill sizes="(max-width:140px)" className="object-cover transition-transform duration-500 ease-out " />
      </motion.div>
      <Link
        href={collection.url}
        className="w-auto absolute right-5 bottom-5 pr-5 text-sm font-semibold text-primary bg-primary/10 rounded-lg px-4 py-2 shadow hover:bg-primary hover:text-white transition-colors duration-200 flex items-center gap-2"
      >
        {`All ${collection.name}`}
        <span className="inline-block w-4 h-4 bg-[url('/icons/arrowIcon01.svg')] bg-no-repeat bg-center" />
      </Link>
    </motion.div>
  );
};

export default CollectionCard;
