import { Paper, Typography } from "@mui/material";
export default function EmptyState({ text="No data found" }) {
  return <Paper elevation={0} sx={{ p:4, textAlign:"center", backgroundColor:"#0f172a", border:"1px solid #1e293b" }}><Typography>{text}</Typography></Paper>;
}
