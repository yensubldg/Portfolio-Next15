import Terminal from "~/components/Terminal";

export default function Home() {
  return (
    <main className="container mx-auto max-w-6xl">
      <div className="my-8 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl md:text-3xl font-mono font-bold">
            Yensubldg&apos;s Portfolio
          </h1>
          <p className="text-sm md:text-base opacity-80">
            Type &apos;help&apos; to see available commands
          </p>
        </div>
        <Terminal />
      </div>
    </main>
  );
}
