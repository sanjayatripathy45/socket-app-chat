import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const Home = () => {
    // Lottie animation settings (if needed)

    const letters = "Website Under Construction".split(""); // Split the text into individual characters

    return (
        <div>
            <Header />
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bgcolor="#1a1a1a" // Dark background for the black theme
                color="#f0f0f0"   // Light text color for contrast
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <Typography
                        variant="h3" // Increased text size
                        color="primary"
                        mt={2}
                        sx={{ fontWeight: 'bold', fontSize: '3rem' }} // Custom font size
                    >
                        {/* Wrap each letter in motion.span for individual animation */}
                        {letters.map((letter, index) => (
                            <motion.span
                                key={index}
                                initial={{ x: Math.random() * 100, y: Math.random() * 100, opacity: 0 }}
                                animate={{ x: 0, y: 0, opacity: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 20,
                                }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </Typography>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                >
                    <Typography
                        variant="h5" // Adjusted text size for the subtitle
                        color="gray"
                        sx={{ fontSize: '1.5rem' }}
                    >
                        We are working hard to bring you something amazing!
                    </Typography>
                </motion.div>
            </Box>
            <Footer />
        </div>
    );
};

export default Home;
