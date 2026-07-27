import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 text-center">
      <div className="max-w-md mx-auto py-12">
        <h1 className="text-6xl font-serif font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-serif font-semibold mb-4">Page Not Found</h2>
        <p className="text-foreground-muted mb-8">
          The page or gallery you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-all duration-300 shadow-md"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
