"use client";
import React, {useEffect} from "react";
import { Box, Typography } from "@mui/material";
import { Roboto_Slab, Lora } from "next/font/google";
import dynamic from "next/dynamic"; 
// Import FirebaseAuth dynamically to ensure it's only loaded in the browser
const FirebaseAuth = dynamic(() => import("../auth"), {
    ssr: false, // This ensures the component is only rendered on the client side
  });
  
// Load the fonts
const robotoSlab = Roboto_Slab({ subsets: ["latin"], weight: ["400", "700"] });
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

const LoginPage = () => {

    useEffect(() => {
        if (typeof window !== "undefined") {
          // Code that needs window
          console.log("Window is available");
        }
      }, []);


  return (
    <Box display="flex" minHeight="100vh"
    overflow="hidden" 
      sx={{
        overflowY: 'hidden', 
        overflowX: 'hidden',
      }}
    >
      <Box
        flex={1}
        bgcolor="#f1f6f1"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <img
          src="/signup.png"
          alt="Signup"
          style={{ maxWidth: "100%" }}
        />
      </Box>
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding={4}
      >
        <Typography
          variant="h1"
          gutterBottom
          sx={{
            fontFamily: robotoSlab.style.fontFamily,
          }}
        >
          ThePantryApp
        </Typography>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: lora.style.fontFamily,
          }}
        >
          Your Ultimate Pantry Management Tool
        </Typography>
        <Box width="100%" maxWidth={400} mt={4}>
          <FirebaseAuth />
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
