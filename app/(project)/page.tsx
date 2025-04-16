import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">
        Landing Page
      </h1>
      <Link href="/login">
        <button className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Go to Login
        </button> 
      </Link>
    </div>
      )
}
