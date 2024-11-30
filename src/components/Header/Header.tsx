import React, { useEffect, useState } from "react";
import { AppBar, Avatar, Box, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux-toolkit/store";
import { logout } from "@/redux-toolkit/slices/authSlice";

const Header = () => {
    useAuthCheck();
    const dispatch = useDispatch();
    const router = useRouter();
    
    const userFromRedux = useSelector((state: RootState) => state.profile);

    const [userFromLocalStorage, setUserFromLocalStorage] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("Login-data");
        if (storedUser) {
            setUserFromLocalStorage(JSON.parse(storedUser));
        }
    }, []);

    const user = userFromRedux || userFromLocalStorage;

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("User signed out!");
                localStorage.removeItem("Login-data");
                dispatch(logout());
                router.push("/auth/login");
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    };

    console.log(userFromRedux?.name, "Success");

    return (
        <AppBar position="sticky" sx={{ backgroundColor: "#000", padding: "10px" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Navigation Links */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Link href="/" passHref>
                        <Typography variant="h6" sx={{ cursor: "pointer", color: "#fff" }}>
                            Home
                        </Typography>
                    </Link>
                    <Link href="/about" passHref>
                        <Typography variant="h6" sx={{ cursor: "pointer", color: "#fff" }}>
                            About
                        </Typography>
                    </Link>
                    <Link href="/chat" passHref>
                        <Typography variant="h6" sx={{ cursor: "pointer", color: "#fff" }}>
                            Chat
                        </Typography>
                    </Link>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Link href="/profile" passHref>
                        <Avatar src={userFromRedux?.image || undefined} alt={user?.email || "User"} />
                        <Typography variant="body2" sx={{ color: "#fff", marginTop: "4px" }}>
                            {userFromRedux?.name || user?.email || "Anonymous"}
                        </Typography>
                        </Link>
                    </Box>
                    <Button variant="outlined" sx={{ color: "#fff" }} onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
