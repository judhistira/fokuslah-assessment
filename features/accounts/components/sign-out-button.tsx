"use client";

import { Button } from "@/components/ui/button";

import { useSignOut } from "@/features/accounts/api/use-sign-out";

export const SignOutButton = () => {
  const signOut = useSignOut();

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/";
      },
    });
  };
  return (
    <Button variant={"destructive"} onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};
