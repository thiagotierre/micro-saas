import { FirestoreAdapter } from "@auth/firebase-adapter"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { firebaseCert } from "./firebase"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({ allowDangerousEmailAccountLinking: true })],
  adapter: FirestoreAdapter({
    credential: firebaseCert,
  }),
})