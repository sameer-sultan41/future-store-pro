import Image from "next/image";
import Link from "next/link";

import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/shared/components/icons/svgIcons";
import { Button } from "@/components/ui/button";

const policies = [
  "Privacy Policy",
"Shipping Policy",
"Billing Policy",
"Refund / Return Policy",
];
const support = [
  "FAQs",
"Integration Docs",
"Contact Us",
"Login / Account",
];
const payment = [
  "JazzCash",
"EasyPaisa",
"NayaPay",

];

const LEGALS = ["Conditions of Use & Sale", "Privacy Notice", "Imprint", "Cookies Notice", "Interest-Based Ads Notice"];

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="flex flex-col border-t bg-white z-50 border-t-gray-300 w-full mt-5">
      <div className="flex-col storeContainer">
        {/* <div className="flex w-full items-center h-32 border-b border-b-gray-300">
          <Link href={"/"}>
            <Image alt="future Logo" src={"/images/logo.png"} width={125} height={40} />
          </Link>
          <div className="h-11 w-full relative ml-16">
            <input
              type="text"
              className="w-full h-full rounded-lg text-gray-700 border border-gray-300 pl-12 focus:border-gray-600"
              placeholder="Search"
            />
            <Image
              src="/icons/searchIcon.svg"
              width={16}
              height={16}
              alt="Search"
              className="absolute top-3.5 left-5 hidden sm:block"
            />
          </div>
        </div> */}
        <section className="flex flex-col lg:flex-row items-start justify-between">
          <div className="md:max-w-[300px]">
            <h3 className="text-lg text-gray-900 font-medium mt-9 mb-4">About FUTURESTORE</h3>
            <span className="text-gray-500 block text-sm leading-5">Unified neon demo for an advanced e-commerce frontend — replace placeholders with real APIs and server-side endpoints.</span>
            <h2 className="text-blue-600 font-medium my-2">+92 315 0242899</h2>
            <span className="text-gray-500 block text-sm leading-5">
              Address: Shop #20 Bhayani Avenue, Nazimabad, Karachi 
            </span>
            <span className="text-gray-500 block text-sm leading-5">futurestore@gmail.com</span>
          </div>
          <div>
            <h3 className="text-lg text-gray-900 font-medium mt-9 mb-4">Policies</h3>
            <ul className="p-0 mb-4">
              {policies.map((item) => (
                <li
                  key={item}
                  className="text-sm leading-7 transition-all duration-150 hover:text-gray-800 text-gray-700"
                >
                  <Link href={""}>{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg text-gray-900 font-medium mt-9 mb-4">Support & Tools</h3>
            <ul>
              {support.map((item) => (
                <li
                  key={item}
                  className="text-sm leading-7 transition-all duration-150 hover:text-gray-800 text-gray-700"
                >
                  <Link href={""}>{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg text-gray-900 font-medium mt-9 mb-4">Payments Gateways</h3>
            <ul>
              {payment.map((item) => (
                <li
                  key={item}
                  className="text-sm leading-7 transition-all duration-150 hover:text-gray-800 text-gray-700"
                >
                  <Link href={""}>{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:mb-0 mb-12">
            <h3 className="text-lg text-gray-900 font-medium mt-9 mb-4">Sign Up to Newsletter</h3>
            <div className="flex w-auto justify-start">
              <input
                type="text"
                placeholder="email address"
                className="w-[200px] text-sm h-8 rounded-md px-4 border border-gray-300 focus:border-gray-800"
              />
              <Button className="h-8  px-4 ml-2 rounded-md border text-sm border-gray-300 bg-gray-100 text-gray-700  hover:bg-gray-200 active:bg-gray-300 active:text-gray-900">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </div>
      <section className="w-full xl:h-20 bg-gray-100 text-sm">
        <div className="h-full flex-col gap-4 xl:flex-row xl:gap-0 justify-between items-center storeContainer">
          <span className="text-gray-500 mt-6 xl:mt-0 mx-auto">© {CURRENT_YEAR} future Store. All Rights Reserved.</span>
        
       
        </div>
      </section>
    </footer>
  );
};

export default Footer;
