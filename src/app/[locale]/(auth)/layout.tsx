import { getSetting } from "@/actions/settings/settings";
import { getLogo } from "@/lib/utils";
import { Heart, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { site } = await getSetting();
  return (
    <div className="flex flex-col items-center min-h-screen highlight-link  ">
      <header className="mt-8">
        <Link href="/">
          <Image
            src={site.logo || getLogo()}
            alt="logo"
            width={184}
            height={64}
            priority
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-sm md:max-w-5xl p-4">
        <div className="py-12">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: marketing / benefits */}
              <div className="space-y-6">
                <h2 className="text-4xl font-extrabold leading-tight">Welcome back to your favorite store.</h2>
                <p className="text-lg text-muted-foreground">
                  Sign in to access your saved items, track orders, and enjoy personalized shopping.
                </p>

                <ul className="space-y-4 mt-6">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                      <ShoppingBag className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold">Continue shopping</p>
                      <p className="text-sm text-muted-foreground">Pick up where you left off with your saved cart.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                      <Heart className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold">Your wishlist</p>
                      <p className="text-sm text-muted-foreground">
                        Access your favorite products and get notified of price drops.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                      <Star className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold">Exclusive deals</p>
                      <p className="text-sm text-muted-foreground">
                        Get early access to sales and member-only discounts.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {children}
            </div>
          </div>
        </div>
      </main>
      <footer className=" flex-1 mt-8  bg-gray-800 w-full flex flex-col gap-4 items-center p-8 text-sm">
        <div className="flex justify-center space-x-4">
          <Link href="/page/conditions-of-use">Conditions of Use</Link>
          <Link href="/page/privacy-policy"> Privacy Notice</Link>
          <Link href="/page/help"> Help </Link>
        </div>
        <div>
          <p className="text-gray-400">{site.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
