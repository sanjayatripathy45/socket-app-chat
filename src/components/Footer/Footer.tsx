import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Copyright Text */}
      <Typography>&copy; {new Date().getFullYear()} Your Company</Typography>

      {/* Social Icons */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton href="https://facebook.com" target="_blank" sx={{ color: "#fff" }}>
          <Facebook />
        </IconButton>
        <IconButton href="https://twitter.com" target="_blank" sx={{ color: "#fff" }}>
          <Twitter />
        </IconButton>
        <IconButton href="https://instagram.com" target="_blank" sx={{ color: "#fff" }}>
          <Instagram />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
