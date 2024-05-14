"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signin() {
    return await signIn("google");
}

export async function signout() {
    return await signOut();
}