"use client";

import { signOut } from "@/actions/auth/login";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline">
        Sign Out
      </Button>
    </form>
  );
}
