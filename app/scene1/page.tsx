import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        About Kimino Signal
      </h1>
      <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300">
        This is your new page route. You can customize this content to explain your product,
        mission, or team.
      </p>
      <Link
        href="/"
        className="inline-flex w-fit rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Back to Home
      </Link>
    </main>
  );
}
