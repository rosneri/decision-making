export const metadata = {
  title: "Offline — Decision Making",
};

export default function OfflinePage() {
  return (
    <main className="flex flex-1 items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-3">
        <h1 className="font-spectral text-3xl">You&apos;re offline</h1>
        <p className="text-sm opacity-70">
          This page isn&apos;t available without a connection. Reopen the app
          once you&apos;re back online.
        </p>
      </div>
    </main>
  );
}
