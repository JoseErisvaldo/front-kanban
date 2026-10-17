import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function BrandMark() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: 30,
        height: 30,
        display: "grid",
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

export function NotFoundView() {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: { xs: 2.5, sm: 4 },
        background:
          "radial-gradient(circle at 10% 90%, rgba(111, 92, 231, 0.1), transparent 26%), #f4f6fb",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "min(100%, 620px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 4, sm: 7 },
          border: "1px solid #e8eaf2",
          borderRadius: "24px",
          bgcolor: "#fff",
          boxShadow: "0 24px 70px rgba(35, 43, 77, 0.09)",
          textAlign: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 5 }}>
          <BrandMark />
          <Typography
            component="span"
            sx={{
              color: "#242842",
              fontFamily: 'Manrope, "DM Sans", sans-serif',
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            Fluxtiva
          </Typography>
        </Box>

        <Typography
          component="p"
          sx={{
            color: "#7463e8",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "3px",
          }}
        >
          404
        </Typography>
        <Typography
          component="h1"
          variant="h3"
          sx={{
            mt: 1.5,
            color: "#20243a",
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 700,
            letterSpacing: "-1.5px",
          }}
        >
          Esta página saiu do fluxo.
        </Typography>
        <Typography
          component="p"
          sx={{
            maxWidth: 390,
            mt: 1.5,
            color: "#777d91",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          Não encontramos o endereço que você tentou acessar. Volte para o início e continue de onde
          parou.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mt: 4, width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="contained"
            startIcon={<HomeRoundedIcon />}
            onClick={() => void navigate("/")}
            sx={{
              minHeight: 46,
              px: 2.5,
              borderRadius: "9px",
              bgcolor: "#6c5ce7",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "#5949d0" },
            }}
          >
            Ir para o início
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => void navigate(-1)}
            sx={{
              minHeight: 46,
              px: 2.5,
              borderColor: "#e2e5ef",
              borderRadius: "9px",
              color: "#656b80",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { borderColor: "#bdb5f4", bgcolor: "#f8f7ff" },
            }}
          >
            Voltar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
