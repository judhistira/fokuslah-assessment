import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";

import { SignUpForm } from "@/features/accounts/components/sign-up-form";

const SignUpPage = async () => {
  const user_id = await getServerSession();

  if (user_id) {
    return redirect("/");
  }

  return <SignUpForm />;
};

export default SignUpPage;
