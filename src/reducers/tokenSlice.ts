import { createSlice } from '@reduxjs/toolkit';
import parseJwt from '../services/parseJwt';

type User = {
    aud: string,
    fullName: string,
    email: string,
    exp: number,
    iat: number,
    id: string,
    iss: string,
    jti: string,
    nbf: number,
    status?: string,
    role: string,
    sub: string
}

const initialState = {
  token: localStorage.getItem('token') || null,
  user: parseJwt(localStorage.getItem('token')) as User | null,
  avatar: localStorage.getItem('avatar') || null,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken(state, action) {
      localStorage.setItem('token', action.payload);
      state.token = action.payload;
    },
    removeToken(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('avatar');
      state.token = null;
      state.user = null;
      state.avatar = null;
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem('avatar', action.payload.avatar);
      state.avatar = action.payload.avatar;
    },
    removeUser(state) {
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('avatar');
      state.avatar = null;
      state.token = null;
    },
    setAvatar(state, action) {
      localStorage.setItem('avatar', action.payload);
      state.avatar = action.payload;
    },
    removeAvatar(state) {
      localStorage.removeItem('avatar');
      state.avatar = null;
    },
  }
});

// Export actions
export const { setToken, removeToken, setUser, removeUser } = tokenSlice.actions;

// Export the reducer
export default tokenSlice.reducer;

