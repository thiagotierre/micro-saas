"use server";

import { auth, signIn, signOut } from "@/app/lib/auth";

export async function handleAuth() {
    // Check if the user is already authenticated
    const session = await auth();
    if (session) {
        // If the user is authenticated, sign them out
        return await signOut({
            redirectTo: "/login"
        });
    }
  await signIn("google", {
    redirectTo: "/dashboard"
  });
}
