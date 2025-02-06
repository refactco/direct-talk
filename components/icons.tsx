import {
  type LightbulbIcon as LucideProps,
  Moon,
  SunMedium,
  Twitter,
  type LucideIcon
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  twitter: Twitter,
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="26"
      viewBox="0 0 25 26"
      fill="none"
      {...props}
    >
      <path
        opacity="0.2"
        d="M12.5 10L25 18L12.5 26L0 18L12.5 10Z"
        fill="white"
      />
      <path opacity="0.5" d="M12.5 5L25 13L12.5 21L0 13L12.5 5Z" fill="white" />
      <path d="M12.5 0L25 8L12.5 16L0 8L12.5 0Z" fill="white" />
    </svg>
  ),
  spinner: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  google: (props: LucideProps) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507.893 5.907 2.053l2.6-2.6C18.747 1.44 15.88 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  )
};
