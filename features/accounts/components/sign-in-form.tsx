"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useSignIn } from "@/features/accounts/api/use-sign-in";

import { UserSchema } from "@/prisma/generated/zod";

const formSchema = UserSchema.pick({
  username: true,
  password: true,
});

type formValues = z.infer<typeof formSchema>;

export const SignInForm = () => {
  const login = useSignIn();
  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: formValues) => {
    try {
      toast("Signing in...");
      login.mutate(values);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-[500px] rounded-2xl border py-4">
      <CardHeader>
        <CardTitle>Log In</CardTitle>

        <CardDescription>
          Enter your username and password to sign in
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="block" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-8 space-y-4 md:mb-12">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input
                        disabled={login.isPending}
                        placeholder="johndoe  "
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                      <Input
                        type="password"
                        disabled={login.isPending}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={login.isPending}
              className="mb-6 block w-full"
            >
              Sign In
            </Button>

            <p className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href={"/auth/sign-up"} className="font-bold">
                Sign Up
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
