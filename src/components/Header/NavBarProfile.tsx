"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileIcon } from "@/shared/components/icons/svgIcons";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/shared/lib/supabaseClient";
import { Urls } from "@/shared/constants/urls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, ShoppingBag, Heart, Bell } from "lucide-react";

interface UserData {
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

const NavBarProfile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const getInitials = (email?: string, fullName?: string) => {
    if (fullName) {
      const names = fullName.split(" ");
      return names.length > 1 ? `${names[0][0]}${names[1][0]}`.toUpperCase() : names[0][0].toUpperCase();
    }
    return email ? email[0].toUpperCase() : "U";
  };

  const getDisplayName = (email?: string, fullName?: string) => {
    if (fullName) return fullName;
    if (email) return email.split("@")[0];
    return "User";
  };

  if (loading) {
    return (
      <Button variant="ghost" disabled>
        <ProfileIcon width={16} className="fill-white transition-all duration-300 stroke-gray-500 stroke-2" />
        <span className="select-none hidden lg:block">Account</span>
      </Button>
    );
  }

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 gap-2 px-2">
            <ProfileIcon width={16} className="fill-white transition-all duration-300 stroke-gray-500 stroke-2" />
            <span className="select-none hidden lg:block">Account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="py-2">
              <p className="text-sm font-semibold">Welcome!</p>
              <p className="text-xs text-muted-foreground">Sign in to access your account</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push(Urls.signIn)} className="cursor-pointer py-2">
              <User className="mr-2 h-4 w-4" />
              <span>Sign In</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(Urls.signUp)} className="cursor-pointer py-2">
              <User className="mr-2 h-4 w-4" />
              <span>Sign Up</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const displayName = getDisplayName(user.email, user.user_metadata?.full_name);
  const initials = getInitials(user.email, user.user_metadata?.full_name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 gap-2 px-2">
          <Avatar className="h-8 w-8 border-2 bg-white border-primary/20">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="select-none hidden lg:block font-medium">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-2">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground truncate max-w-[150px]">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer py-2">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => router.push("/orders")} className="cursor-pointer py-2">
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Orders</span>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem onClick={() => router.push("/wishlist")} className="cursor-pointer py-2">
            <Heart className="mr-2 h-4 w-4" />
            <span>Wishlist</span>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem onClick={() => router.push("/notifications")} className="cursor-pointer py-2">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer py-2">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600  py-2">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavBarProfile;
