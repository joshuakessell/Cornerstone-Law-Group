export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const NAV_LINKS: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Our Approach", href: "/our-approach" },
  { label: "Team", href: "/our-team" },
  { label: "Reviews", href: "/reviews" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

