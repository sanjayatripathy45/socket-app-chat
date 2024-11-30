import React, { useEffect } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone'; // Import DropzoneOptions
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller, SubmitHandler } from 'react-hook-form'; // Add SubmitHandler
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { setProfile } from '@/redux-toolkit/slices/profileSlice';
import { AppDispatch, RootState } from '@/redux-toolkit/store';

// Yup Validation Schema
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    username: yup.string().required('Username is required'),
    image: yup.mixed().required('Image is required').nullable(),
});

interface ProfileFormValues {
    name: string;
    email: string;
    username: string;
    image: string | null;
}

const Profile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userFromRedux = useSelector((state: RootState) => state.profile)

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
        reset,
    } = useForm<ProfileFormValues>({
        defaultValues: {
            name: '',
            email: '',
            username: '',
            image: null,
        },
        resolver: yupResolver(schema) as any, // Type assertion to bypass type issue
    });

    useEffect(() => {
        reset({
            name: userFromRedux?.name || "",
            email: userFromRedux?.email || "",
            username: userFromRedux?.username || "",
            image: userFromRedux?.image || "",
        });
    }, [userFromRedux, reset]);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setValue('image', reader.result as string, { shouldValidate: true });
            };
            reader.readAsDataURL(file);
        }
    };

    // Use DropzoneOptions type to ensure correct typing
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*' as any,
        maxFiles: 1,
    });

    const image = watch('image');

    const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
        dispatch(setProfile(data));
        console.log('Profile saved:', data);
    };

    return (
        <Box
            sx={{
                maxWidth: 500,
                mx: 'auto',
                mt: 4,
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            }}
        >
            <Typography
                variant="h5"
                sx={{ color: 'text.primary', fontWeight: 600, textAlign: 'center', mb: 3 }}
            >
                Edit Profile
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Name"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    )}
                />

                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Email"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    )}
                />

                <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Username"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={!!errors.username}
                            helperText={errors.username?.message}
                        />
                    )}
                />

                <Box
                    {...getRootProps()}
                    sx={{
                        mt: 3,
                        p: 2,
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                    }}
                >
                    <input {...getInputProps()} />
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                        Drag & drop an image here, or click to browse
                    </Typography>
                </Box>
                {errors.image && (
                    <Typography sx={{ color: 'error.main', mt: 1, fontSize: '0.8rem' }}>
                        {errors.image.message}
                    </Typography>
                )}

                {image && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Avatar
                            src={image as string}
                            alt="Profile Preview"
                            sx={{ width: 100, height: 100, mx: 'auto' }}
                        />
                        <Typography sx={{ mt: 1, fontSize: '0.9rem', color: 'text.secondary' }}>
                            Image Preview
                        </Typography>
                    </Box>
                )}

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        Save Profile
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default Profile;
