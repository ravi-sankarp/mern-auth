/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   data: JSON.parse(localStorage.getItem('token')) ?? {}
};

const authSlice = createSlice({
   name: 'users',
   initialState,
   reducers: {
      setToken(state, action) {
         localStorage.setItem(
            'token',
            JSON.stringify({ token: action.payload.token, admin: action.payload.admin })
         );

         state.data = { token: action.payload.token, admin: action.payload.admin };
      },
      deleteToken(state) {
         state.data = {};
         localStorage.removeItem('token');
      }
   }
});

export const { setToken, deleteToken } = authSlice.actions;

export default authSlice.reducer;
