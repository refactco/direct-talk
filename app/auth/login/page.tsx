'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons/Logo';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading] = useState<boolean>(false);

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 pt-16">
      <div className="flex flex-col space-y-2 text-center">
        <Logo />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </div>
      <div className="grid gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="border-border"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2 h-4 w-4" />
          )}{' '}
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="border-border"
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
