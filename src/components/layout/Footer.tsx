import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { site, mainNav } from "@/constants/site";

const categories = [
  "Computer Science",
  "Engineering",
  "Music Lessons",
  "Writing & Reading",
  "Foreign Languages",
];

const socials = [
  { label: "Twitter", href: site.social.twitter, Icon: Twitter },
  { label: "Instagram", href: site.social.instagram, Icon: Instagram },
  { label: "Facebook", href: site.social.facebook, Icon: Facebook },
  { label: "LinkedIn", href: site.social.linkedin, Icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white/70">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-violet-deep/30 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky/20 blur-[120px]"
      />

      <div className="container-page relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-5">
            <Logo variant="light" />
            <p className="max-w-sm text-[0.95rem] leading-relaxed">
              {site.name} helps you learn in-demand skills with online video and
              real-time courses taught by world-class mentors.
            </p>
            <div className="flex gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:-translate-y-0.5 hover:bg-violet-deep"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Company">
            {mainNav.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Categories">
            {categories.map((c) => (
              <FooterLink key={c} href="/courses">
                {c}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Get in touch">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
              <span>{site.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-violet" />
              <a href={`tel:${site.phone}`} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-violet" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
          </FooterCol>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <ul className="flex flex-col gap-3 text-[0.95rem]">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}
