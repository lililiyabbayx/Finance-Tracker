import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import FlexBetween from "./FlexBetween";

type Props = {
  title: string;
  sideText: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

const BoxHeader = ({ icon, title, subtitle, sideText }: Props) => {
  const { palette } = useTheme();
  return (
    <FlexBetween color="#000" margin="1.5rem 1rem 0 1rem">
      <FlexBetween>
        {icon}
        <Box width="100%">
          <Typography variant="h5" mb="-0.1rem" fontWeight="700" color="#000">
            {title}
          </Typography>
          <Typography variant="h5">{subtitle}</Typography>
        </Box>
      </FlexBetween>
      <Typography variant="h5" fontWeight="700" color="#000">
        {sideText}
      </Typography>
    </FlexBetween>
  );
};

export default BoxHeader;
