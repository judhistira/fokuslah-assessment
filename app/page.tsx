import Link from "next/link";

import { getServerSession } from "@/lib/auth";

import { SignOutButton } from "@/features/accounts/components/sign-out-button";

const RootPage = async () => {
  const userId = await getServerSession();

  if (!userId) {
    return (
      <div>
        <p>Not signed in</p>
        <Link href="/auth/sign-in">Sign in</Link>
      </div>
    );
  }
  return (
    <div>
      <p>Signed in as {userId}</p>
      <SignOutButton />
    </div>
  );
};

export default RootPage;
