import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-violet-500 opacity-30 blur-xl"></div>
              <div className="relative rounded-full bg-white p-6 shadow-xl">
                <div className="text-6xl font-bold text-gray-800">404</div>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Oops! Page Not Found
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          The page you&apos;re looking for seems to have wandered off.
          Don&apos;t worry, it happens to the best of us!
        </p>
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Here are some helpful links:
          </h2>
          <ul className="space-y-3 text-left">
            <li>
              <Link
                href="/"
                className="flex items-center text-blue-600 transition-colors hover:text-blue-800"
              >
                <span className="mr-2">🏠</span>
                Back to Home
              </Link>
            </li>
            <li>
              <Link
                href="/lessons"
                className="flex items-center text-blue-600 transition-colors hover:text-blue-800"
              >
                <span className="mr-2">📚</span>
                Browse Lessons
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="flex items-center text-blue-600 transition-colors hover:text-blue-800"
              >
                <span className="mr-2">👤</span>
                Your Profile
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="transform rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:from-blue-600 hover:to-violet-600"
          >
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
