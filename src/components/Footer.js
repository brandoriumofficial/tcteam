import React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Logo from "../pic/logo.png";
import { useLocation } from "react-router-dom";


function Footer() {

const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return null;   // 👉 Admin me footer hide
  }


  return (
    <Box
      sx={{
        bgcolor: "#f0e9f8",
        color: "black",
        px: { xs: 3, md: 10 },
        py: 6,
        mt: 8,
      }}
    >
      <Grid container spacing={6}>
        {/* Logo */}
        <Grid item xs={12}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}
          >
            Traditional Care
          </Typography>
          <img
            src={Logo}
            alt="Traditional Care Logo"
            style={{ height: "100px", marginTop: "8px" }}
          />
        </Grid>
        

        {/* Links */}
        <Grid item xs={12} md={3}>
          <Typography fontWeight="bold" sx={{ mb: 1 }}>
            SHOP
          </Typography>
          {[
            "Hair Care",
            "Skin Care",
            "Ingredients",
            "Combos",
            "New Launches",
            "Shop By Concern",
            "Men's Range",
          ].map((item, i) => (
            <Typography key={i} sx={{ mb: 0.7, cursor: "pointer" }}>
              {item}
            </Typography>
          ))}
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography fontWeight="bold" sx={{ mb: 1 }}>
            BRAND
          </Typography>
          {["About Us", "Blog", "Refund Policy", "Terms of Service", "Contact Us"].map(
            (item, i) => (
              <Typography key={i} sx={{ mb: 0.7, cursor: "pointer" }}>
                {item}
              </Typography>
            )
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography fontWeight="bold" sx={{ mb: 1 }}>
            LEGAL
          </Typography>
          {["Contact", "Return & Refund Policy"].map((item, i) => (
            <Typography key={i} sx={{ mb: 0.7, cursor: "pointer" }}>
              {item}
            </Typography>
          ))}
        </Grid>

        {/* Newsletter */}
        <Grid item xs={12} md={3}>
          <Typography fontWeight="bold" sx={{ mb: 2 }}>
            Elevate Your Self-Care Routine With Natural Solutions.
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              size="small"
              placeholder="Your email"
              fullWidth
              sx={{
                bgcolor: "#fff",
                borderRadius: 1,
              }}
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: "black",
                borderRadius: 1,
                px: 3,
                textTransform: "none",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Social */}
      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        {[<FacebookIcon />, <LinkedInIcon />, <InstagramIcon />, <YouTubeIcon />, <WhatsAppIcon />].map(
          (icon, i) => (
            <IconButton key={i} sx={{ color: "black" }}>
              {icon}
            </IconButton>
          )
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Logos Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mt: 2,
        }}
      >
        {/* Left side - Available On */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "gray",
              textTransform: "uppercase",
            }}
          >
            WE'RE AVAILABLE ON
          </Typography>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
            alt="amazon"
            style={{ height: "18px", objectFit: "contain" }}
          />
          <img
            src="data:image/png;base64,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"
            alt="flipkart"
            style={{ height: "18px", objectFit: "contain" }}
          />
          <img
            src="data:image/png;base64,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"
            alt="blinkit"
            style={{ height: "18px", objectFit: "contain" }}
          />
          <img
            src="data:image/jpeg;base64,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"
            alt="purple"
            style={{ height: "18px", objectFit: "contain" }}
          />
          <img
            src="data:image/png;base64,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"
            alt="nykaa"
            style={{ height: "18px", objectFit: "contain" }}
          />
        </Box>

        {/* Right side - Payment Method */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "gray",
              textTransform: "uppercase",
            }}
          >
            PAYMENT METHOD
          </Typography>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
            alt="visa"
            style={{ height: "18px", objectFit: "contain" }}
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0c/MasterCard_logo.png"
            alt="mastercard"
            style={{ height: "18px", objectFit: "contain" }}
          />
          <img
            src="data:image/jpeg;base64,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"
            alt="rupay"
            style={{ height: "18px", objectFit: "contain" }}
          />
          <img
            src="data:image/jpeg;base64,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"
            alt="upi"
            style={{ height: "18px", objectFit: "contain" }}
          />
          <img
            src="data:image/png;base64,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"
            alt="maestro"
            style={{ height: "18px", objectFit: "contain" }}
          />
        </Box>
      </Box>

      {/* Copyright */}
      <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
        © {new Date().getFullYear()} Traditional Care. All Rights Reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
