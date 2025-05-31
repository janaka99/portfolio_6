"use server";
import { signIn } from "@/auth";

export const loginAction = async (email: string, password: string) => {
  try {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    return {
      error: false,
      message: "You have been successfully logged in.",
    };
  } catch (error) {
    return {
      error: true,
      message: "Invalid email or password. Please try again. 22 ",
    };
  }
};
