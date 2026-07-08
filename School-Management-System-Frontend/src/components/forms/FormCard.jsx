import { Paper, Stack } from "@mui/material";
export default function FormCard({ children, onSubmit }) {
  return (
    <Paper 
      component="form" 
      onSubmit={onSubmit} 
      elevation={0} 
      sx={{ 
        p:3, 
        backgroundColor:"#0f172a", 
        border:"1px solid #1e293b" 
      }}
    >
      <Stack 
        spacing={2}
      >
        {children}
      </Stack>
    </Paper>
  );
}
