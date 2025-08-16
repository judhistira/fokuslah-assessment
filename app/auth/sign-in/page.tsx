import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";

import { SignInForm } from "@/features/accounts/components/sign-in-form";

const SignInPage = async () => {
  const user_id = await getServerSession();

  if (user_id) {
    return redirect("/");
  }

  return <SignInForm />;
};

export default SignInPage;
