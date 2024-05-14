import React from "react";
import Form from "./Form";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export type formData = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: "male" | "female";
};

const defaultData = {
  firstName: "",
  lastName: "",
  phone: "",
};

export const metadata = {
  title: "Profile",
};

export default async function Page() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="p-4 md:px-8 max-w-4xl w-full mx-auto bg-popover shadow-md rounded-xl">
          <h1 className="text-xl py-4 md:text-2xl">Please Login</h1>
        </div>
      </div>
    );
  }

  const profile =
    (await prisma.profile.findUnique({
      where: { userId: session.user.email },
    })) || defaultData;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="p-4 md:px-8 max-w-4xl w-full mx-auto bg-popover shadow-md rounded-xl">
        <h1 className="text-xl mt-4 mb-2 md:text-2xl">
          <b>My Profile</b>
        </h1>
        <hr />
        <Form profile={profile as formData} />
      </div>
    </div>
  );
}
