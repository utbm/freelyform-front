export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "FreelyForm",
  description: "Create custom forms and surveys with ease.",
  navItems: [],
  navMenuItems: [
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  authentication: {
    login: {
      label: "Login",
      href: "/login",
    },
    logout: {
      label: "Logout",
      href: "/logout",
    },
  },
  links: {
    github: "https://github.com/utbm/freelyform-front",
  },
};
