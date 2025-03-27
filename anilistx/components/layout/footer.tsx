import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link href="/" className="font-bold text-lg">
            AnilistX
          </Link>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AnilistX. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="https://github.com" className="text-sm text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
} 