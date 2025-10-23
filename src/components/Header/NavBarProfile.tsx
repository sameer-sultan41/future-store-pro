"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";

import { ProfileIcon } from "@/shared/components/icons/svgIcons";
import { Button } from "@/components/ui/button";
import { useToggleMenu } from "@/shared/hooks/useToggleMenu";
import { createSupabaseClient } from "@/shared/lib/supabaseClient";
import { cn } from "@/shared/utils/styling";

const NavBarProfile = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useToggleMenu(false, menuRef as React.RefObject<HTMLDivElement>);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const router = useRouter();

  const toggleMenu = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    const supabase = createSupabaseClient();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="relative">
      <Button
        onClick={toggleMenu}
      variant={"ghost"}
      >
        <ProfileIcon width={16} className="fill-white transition-all duration-300 stroke-gray-500 stroke-2" />
        <span className="select-none hidden lg:block">Account</span>
      </Button>
      {/* TODO: Create hook for menu */}
      <div
        ref={menuRef}
        className={cn(
          "w-[140px] absolute rounded-lg overflow-hidden flex flex-col items-center top-[42px] right-0 border border-gray-300 bg-white shadow-md scale-[0.97] invisible opacity-0 transition-all duration-300 p-1 z-10",
          isActive && "scale-100 visible opacity-100"
        )}
      >
        {user ? (
          <>
            <Button className="border-white font-semibold text-sm hover:bg-gray-100">
              {user.email}
            </Button>
            <Button 
            variant={"link"}
              onClick={handleSignOut}
              className="border-white font-semibold text-sm hover:bg-gray-100"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button 
                 variant={"link"}
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
            <Button variant={"link"} onClick={() => router.push('/signup')}>
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBarProfile;
