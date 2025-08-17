import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";

import { SignInForm } from "@/features/accounts/components/sign-in-form";

const SignInPage = async () => {
  const user_id = await getServerSession();

  console.log(user_id);

  if (user_id !== null) {
    return redirect("/");
  }

  return <SignInForm />;
};

export default SignInPage;
