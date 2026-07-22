import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { LegalContent } from "@/components/shared/LegalContent";
import { site } from "@/constants/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms governing your use of ${site.name}.`,
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of" highlight="Service" crumb="Terms" />
      <LegalContent
        updated="July 2026"
        sections={[
          {
            heading: "1. Acceptance of terms",
            body: [
              `By accessing or using ${site.name}, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.`,
            ],
          },
          {
            heading: "2. Accounts",
            body: [
              "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
            ],
          },
          {
            heading: "3. Course access & content",
            body: [
              "Course materials are provided for your personal, non-commercial learning. Redistribution or resale of any content is prohibited without written permission.",
            ],
          },
          {
            heading: "4. Payments & refunds",
            body: [
              "Paid courses are subject to the pricing shown at checkout. Refund eligibility is described at the point of purchase.",
            ],
          },
          {
            heading: "5. Changes",
            body: [
              "We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms.",
            ],
          },
        ]}
      />
    </>
  );
}
