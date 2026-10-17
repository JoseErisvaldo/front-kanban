import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import type { ReactNode } from "react";

export type SidebarNavigationItem = {
  label: string;
  icon: ReactNode;
  to?: string;
  action?: string;
};

export type AppSidebarConfig = {
  brand: string;
  sectionLabel?: string;
  items: SidebarNavigationItem[];
  footerLabel?: string;
  footerItems?: SidebarNavigationItem[];
};

export const FLUXTIVA_SIDEBAR_CONFIG: AppSidebarConfig = {
  brand: "Fluxtiva",
  sectionLabel: "ESPAÇO DE TRABALHO",
  items: [
    {
      label: "Home",
      to: "/home",
      icon: <HomeRoundedIcon fontSize="small" />,
    },
  ],
  footerItems: [
    {
      label: "Sair da conta",
      action: "logout",
      icon: <LogoutRoundedIcon fontSize="small" />,
    },
  ],
};
