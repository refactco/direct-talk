import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in to Ask Author to start conversations with your favorite thinkers.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Sign In | Ask Author',
    description: 'Sign in to Ask Author to start conversations with your favorite thinkers.',
  },
  twitter: {
    title: 'Sign In | Ask Author',
    description: 'Sign in to Ask Author to start conversations with your favorite thinkers.',
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
} 