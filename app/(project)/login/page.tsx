import { handleAuth } from "@/app/actions/handle-auth";

export default function Login() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">Login Page</h1>
      <form action={handleAuth}>
        <button className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 cursor-pointer" type="submit">
          <span className="flex items-center justify-center">
          Signin with Google
          </span>
        </button>
      </form>
    </div>
  );
}
