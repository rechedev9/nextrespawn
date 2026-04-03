import type React from "react";
import Link from "next/link";
import { config } from "@/config";

export function Footer(): React.ReactElement {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} {config.appName}. All rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          {config.legal.privacyUrl && (
            <Link href={config.legal.privacyUrl} className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          )}
          {config.legal.termsUrl && (
            <Link href={config.legal.termsUrl} className="hover:text-foreground transition-colors">
              Terms
            </Link>
          )}
          <Link href={config.social.github} className="hover:text-foreground transition-colors">
            GitHub
          </Link>
          <Link href={config.social.twitter} className="hover:text-foreground transition-colors">
            Twitter
          </Link>
        </nav>
      </div>
    </footer>
  );
}
