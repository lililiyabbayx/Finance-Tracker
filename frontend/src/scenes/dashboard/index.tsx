import React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
type Props = {};
const Home = (props: Props) => {
  const { palette } = useTheme();
  return <Box color={palette.grey[800]}>Business Dashboard Home</Box>;
};

export default Home;
