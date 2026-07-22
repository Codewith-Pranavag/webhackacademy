import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { NewsletterCTA } from "@/components/sections/NewsletterCTA";
import { Reveal } from "@/components/shared/Reveal";
import { site } from "@/constants/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${site.name} team — we're here to help with courses, mentorship and support.`,
};

const info = [
  { Icon: MapPin, label: "Visit us", value: site.address },
  { Icon: Phone, label: "Call us", value: site.phone, href: `tel:${site.phone}` },
  { Icon: Mail, label: "Email us", value: site.email, href: `mailto:${site.email}` },
  { Icon: Clock, label: "Working hours", value: "Mon – Fri, 9:00 – 18:00" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact"
        highlight="Us"
        crumb="Contact Us"
        subtitle="Have a question about courses, mentorship or partnerships? We'd love to hear from you."
      />

      <section className="py-16 lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          {/* Info */}
          <div className="flex flex-col gap-5">
            {info.map(({ Icon, label, value, href }, i) => (
              <Reveal key={label} delay={i * 0.08}>
                <div className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-deep">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-muted">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="font-semibold text-ink transition-colors hover:text-violet-deep"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-semibold text-ink">{value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Form */}
          <Reveal direction="left">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="pb-16 lg:pb-20">
        <div className="container-page">
          <div className="relative h-80 w-full overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface-soft">
            <iframe
              title="WebHack Academy location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-122.42%2C37.77%2C-122.39%2C37.79&layer=mapnik"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <NewsletterCTA />
    </>
  );
}
