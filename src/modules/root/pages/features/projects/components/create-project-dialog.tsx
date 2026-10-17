import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

type CreateProjectDialogProps = {
  open: boolean;
  projectName: string;
  projectDescription: string;
  error: string | null;
  isSubmitting: boolean;
  onProjectNameChange: (value: string) => void;
  onProjectDescriptionChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function CreateProjectDialog({
  open,
  projectName,
  projectDescription,
  error,
  isSubmitting,
  onProjectNameChange,
  onProjectDescriptionChange,
  onClose,
  onSubmit,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ color: "#20243a", fontWeight: 700 }}>Criar projeto</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2, color: "#777d91", fontSize: 13 }}>
          Escolha um nome para o novo espaço de trabalho.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          label="Nome do projeto"
          value={projectName}
          onChange={(event) => onProjectNameChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSubmit();
          }}
        />
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Descrição"
          value={projectDescription}
          onChange={(event) => onProjectDescriptionChange(event.target.value)}
          sx={{ mt: 2 }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!projectName.trim() || !projectDescription.trim() || isSubmitting}
          sx={{
            bgcolor: "#6c5ce7",
            textTransform: "none",
            "&:hover": { bgcolor: "#5949d0" },
          }}
        >
          {isSubmitting ? "Criando…" : "Criar projeto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
