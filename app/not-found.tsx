import Link from 'next/link';
import { Logo } from '@/components/icons/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <Logo className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-lg text-muted-foreground">Page not found</p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-foreground bg-accent hover:bg-accent/80 rounded-lg transition-colors duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
