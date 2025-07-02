import { DisclaimerModal } from './DisclaimerModal';

export function Footer() {
  return (
    <section className="flex-shrink-0 mt-auto px-4 md:px-8">
      <div className="flex flex-col items-center gap-3 text-center max-w-3xl mx-auto">
        <p className="text-xs text-muted-foreground/40">
          This platform is for educational purposes only. Read our{' '}
          <DisclaimerModal /> for more information.
        </p>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted-foreground/40">
            © {new Date().getFullYear()} Ask Author - Made by{' '}
            <a
              href="https://refact.co"
              target="_blank"
              className="text-primary hover:underline"
            >
              Refact
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
