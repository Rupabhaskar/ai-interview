import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">AI Mock Interview</h1>
        <p className="mb-6">Resume-based mock interview system</p>

        <Link
          href="/interview"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Start Interview
        </Link>
      </div>
    </main>
  );
}
