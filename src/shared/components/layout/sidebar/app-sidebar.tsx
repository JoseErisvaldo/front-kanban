import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import type { AppSidebarConfig, SidebarNavigationItem } from "./sidebar-config";

type AppSidebarProps = {
  config: AppSidebarConfig;
  mobileOpen: boolean;
  onClose: () => void;
  onItemClick?: () => void;
  onAction?: (action: string) => void;
};

function BrandMark() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: 30,
        height: 30,
        display: "grid",
        flexShrink: 0,
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: "3px",
        p: "3px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "rgba(116, 99, 232, 0.2)",
        borderRadius: "10px",
        background: "linear-gradient(145deg, #8979ff, #6955e8)",
        boxShadow: "0 5px 15px rgba(91, 75, 222, 0.2)",
        transform: "rotate(-5deg)",
        "& > span": { borderRadius: "2px", bgcolor: "#fff" },
        "& > span:nth-of-type(2), & > span:nth-of-type(3)": { opacity: 0.68 },
        "& > span:nth-of-type(4)": { bgcolor: "#c9c3ff" },
      }}
    >
      <Box component="span" />
      <Box component="span" />
      <Box component="span" />
      <Box component="span" />
    </Box>
  );
}

function NavigationItems({
  items,
  onItemClick,
  onAction,
}: {
  items: SidebarNavigationItem[];
  onItemClick?: () => void;
  onAction?: (action: string) => void;
}) {
  return (
    <List disablePadding>
      {items.map((item) => (
        <ListItemButton
          key={item.to ?? item.label}
          component={item.to ? NavLink : "button"}
          to={item.to}
          onClick={() => {
            if (item.action) onAction?.(item.action);
            onItemClick?.();
          }}
          sx={{
            minHeight: 44,
            mb: 0.6,
            px: 1.5,
            borderRadius: "9px",
            color: "#777d91",
            textDecoration: "none",
            "&:hover": { color: "#5143bd", bgcolor: "#f6f4ff" },
            "&.active": { color: "#6554d5", bgcolor: "#f1efff" },
            "&.active:hover": { bgcolor: "#eae7ff" },
            "& .MuiListItemIcon-root": { minWidth: 36, color: "inherit" },
            "& .MuiListItemText-primary": { fontSize: 13, fontWeight: 600 },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );
}

function SidebarContents({
  brand,
  sectionLabel,
  items,
  footerItems,
  footerLabel,
  onItemClick,
  onAction,
}: AppSidebarConfig & Pick<AppSidebarProps, "onItemClick" | "onAction">) {
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        px: 2.25,
        pt: 3.5,
        pb: 2.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.4,
          mb: 5.75,
          pl: 0.6,
        }}
      >
        <BrandMark />
        <Typography
          component="span"
          sx={{
            color: "#242842",
            fontFamily: 'Manrope, "DM Sans", sans-serif',
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-0.7px",
          }}
        >
          {brand}
        </Typography>
      </Box>

      {sectionLabel && (
        <Typography
          sx={{
            mb: 1.4,
            ml: 1.5,
            color: "#a0a4b3",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "1.2px",
          }}
        >
          {sectionLabel}
        </Typography>
      )}
      <NavigationItems items={items} onItemClick={onItemClick} onAction={onAction} />

      <Box sx={{ flex: 1, minHeight: 6 }} />
      {footerItems && footerItems.length > 0 && (
        <>
          {footerLabel && (
            <Typography
              sx={{
                mb: 1.4,
                ml: 1.5,
                color: "#a0a4b3",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "1.2px",
              }}
            >
              {footerLabel}
            </Typography>
          )}
          <Divider sx={{ mb: 1.2, borderColor: "#eceef5" }} />
          <NavigationItems items={footerItems} onItemClick={onItemClick} onAction={onAction} />
        </>
      )}
      <Typography
        sx={{
          mt: 2.1,
          ml: 1.5,
          color: "#a9adba",
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.55px",
        }}
      >
        {brand.toUpperCase()} · ESPAÇO DE TRABALHO
      </Typography>
    </Box>
  );
}

const drawerSx = {
  width: 264,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 264,
    boxSizing: "border-box",
    border: 0,
    borderRight: "1px solid #eceef5",
    bgcolor: "#fff",
  },
};

export function AppSidebar({
  config,
  mobileOpen,
  onClose,
  onItemClick,
  onAction,
}: AppSidebarProps) {
  return (
    <>
      <Drawer variant="permanent" sx={{ ...drawerSx, display: { xs: "none", md: "block" } }}>
        <SidebarContents {...config} onItemClick={onItemClick} onAction={onAction} />
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ ...drawerSx, display: { xs: "block", md: "none" } }}
      >
        <SidebarContents {...config} onItemClick={onItemClick ?? onClose} onAction={onAction} />
      </Drawer>
    </>
  );
}
