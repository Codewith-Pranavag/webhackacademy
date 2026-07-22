/** Central brand + navigation config. Rebranding happens here. */

export const site = {
  name: "WebHack Academy",
  shortName: "WebHack",
  tagline: "Learn From Experts",
  description:
    "WebHack Academy — learn in-demand skills with online video and real-time courses taught by industry experts.",
  url: "https://webhackacademy.com",
  email: "hello@webhackacademy.com",
  phone: "+1 (555) 018-2043",
  address: "24 Innovation Drive, Suite 200, San Francisco, CA",
  social: {
    twitter: "https://twitter.com/webhackacademy",
    instagram: "https://instagram.com/webhackacademy",
    facebook: "https://facebook.com/webhackacademy",
    linkedin: "https://linkedin.com/company/webhackacademy",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Course", href: "/courses" },
  {
    label: "Mentors",
    href: "/mentors",
    children: [{ label: "Mentors Details", href: "/mentors" }],
  },
  { label: "Contact Us", href: "/contact" },
];
