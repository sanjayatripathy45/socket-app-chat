import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, AppBar, Toolbar } from '@mui/material';
import { auth, googleProvider } from "@/config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc'; 
import { useDispatch } from 'react-redux';
import { login } from '@/redux-toolkit/slices/authSlice';
import { useAuthCheck } from '@/hooks/useAuthCheck';

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    useAuthCheck();
    const { register, reset, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        reset({
            email: "sanjaya@yopmail.com",
            password: "sanjaya",
        });
    }, [reset]);


 
    const onSubmit = (data: any) => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userData = {
                    email: user.email!,
                    uid: user.uid,
                    displayName: user.email?.split('@')[0] || 'Unknown user', 
                };
                dispatch(login(userData));
                localStorage.setItem("Login-data", JSON.stringify(userData));

                router.push('/'); 
            })
            .catch((error) => {
                console.error("Error signing up:", error);
            });
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userData = {
                email: user.email!,
                uid: user.uid,
                photoURL: user.photoURL || '',
                displayName: user.displayName!
            };
            dispatch(login(userData));

            localStorage.setItem("Login-data", JSON.stringify(userData));

            router.push('/');
            console.log("Welcome");
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };




    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '300px',
                        padding: '16px',
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: 'white',
                    }}
                >
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Invalid email address',
                            },
                        })}
                        error={!!errors.email}
                        sx={{ marginBottom: '16px' }}
                    />

                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        {...register('password', { required: 'Password is required' })}
                        error={!!errors.password}
                        sx={{ marginBottom: '16px' }}
                    />

                    <Button type="submit" variant="contained" color="primary" sx={{ marginBottom: '8px' }}>
                        Login with Email
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGoogleLogin}
                        sx={{ marginBottom: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <FcGoogle style={{ marginRight: '8px' }} />
                        Login with Google
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default Login;
