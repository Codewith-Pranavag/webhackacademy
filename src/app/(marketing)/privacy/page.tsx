import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { LegalContent } from "@/components/shared/LegalContent";
import { site } from "@/constants/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects your data.`,
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy" highlight="Policy" crumb="Privacy" />
      <LegalContent
        updated="July 2026"
        sections={[
          {
            heading: "1. Information we collect",
            body: [
              "We collect information you provide directly — such as your name, email and course activity — as well as limited technical data to keep the platform secure and performant.",
            ],
          },
          {
            heading: "2. How we use your data",
            body: [
              "Your data is used to provide and improve the learning experience, personalise course recommendations, and communicate important updates.",
            ],
          },
          {
            heading: "3. Sharing",
            body: [
              `${site.name} does not sell your personal data. We share information only with trusted service providers necessary to operate the platform.`,
            ],
          },
          {
            heading: "4. Your rights",
            body: [
              "You may access, correct or delete your personal data at any time by contacting our support team.",
            ],
          },
          {
            heading: "5. Contact",
            body: [`Questions about privacy? Email us at ${site.email}.`],
          },
        ]}
      />
    </>
  );
}
