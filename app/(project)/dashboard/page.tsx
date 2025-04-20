import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">Micro Saas</h1>
      <small className="mt-2 text-gray-500">Dashboard</small>
      <img
        className="mt-4 h-32 w-32 rounded-full"
        src={session?.user?.image}
        alt="User Avatar"
      />
      <div className="mt-4 flex items-center justify-center border-b-black border-2 rounded-lg p-4 display flex-col">
        <h3 className="mt-4 text-2xl ">
          {session?.user?.name
            ? `Bem-vindo ${session?.user?.name}`
            : "Usuário não está logado"}
        </h3>
        <p className="mt-4 text-lg">
          {session?.user?.email
            ? session?.user?.email
            : "Usuário não está logado"}
        </p>
      </div>
      
      {
      session?.user?.email && (
        <form action={handleAuth}>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 cursor-pointer"
            type="submit"
          >
            <span className="flex items-center justify-center">Logout</span>
          </button>
        </form>
      )}
      <Link href={"/pagamentos"}>Pagamentos</Link>
    </div>
  );
}
