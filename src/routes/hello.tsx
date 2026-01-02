import { createFileRoute, redirect } from "@tanstack/react-router";
import { useUser } from "@clerk/tanstack-react-start";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";

const authStateFn = createServerFn({ method: "GET" }).handler(async () => {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    throw redirect({
      to: "/",
    });
  }

  return { userId };
});

export const Route = createFileRoute("/hello")({
  component: Hello,
  beforeLoad: async () => await authStateFn(),
});

function Hello() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4">
        Hello, {user?.firstName || user?.username || "Guest"}!
      </h1>
      <p className="text-gray-400">Your User ID is: {user?.id}</p>
      <a href="/" className="mt-8 text-cyan-400 hover:underline">
        Go back home
      </a>
    </div>
  );
}
