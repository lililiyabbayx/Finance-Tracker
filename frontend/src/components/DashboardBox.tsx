import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
const DashboardBox = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(120, 113, 160, 0.1)",
  borderRadius: "1rem",
  boxShadow: "0.15px 0.2px 0.1px 0.2px rgba(122, 118, 118, 0.8)",
  padding: "1rem",
}));

export default DashboardBox;
