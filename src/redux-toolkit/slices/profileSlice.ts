import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  name: string;
  email: string;
  username: string;
  image: string | null;
}

const initialState: ProfileState = {
  name: '',
  email: '',
  username: '',
  image: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<ProfileState>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
