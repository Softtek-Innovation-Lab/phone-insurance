export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Insurance Demo",
  description: "Insurance Demo.",
  navItems: [
    {
      label: "Get Insurance",
      href: "/get-insurance",
    },
    {
      label: "Cart",
      href: "/cart",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
  ],
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    docs: "https://docs.example.com",
    discord: "https://discord.gg",
    sponsor: "https://patreon.com",
  },
};
