'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 pt-16">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-12 w-12" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </div>
      <div className="grid gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="border-white"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{' '}
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="border-white"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.twitter className="mr-2 h-4 w-4" />
          )}{' '}
          Twitter
        </Button>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/signup"
          className="hover:text-brand underline underline-offset-4"
        >
          Sign up
        </Link>
      </p>
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
}
