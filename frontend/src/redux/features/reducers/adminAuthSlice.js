/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   token: JSON.parse(localStorage.getItem('adminToken')) ?? ''
};

const adminAuthSlice = createSlice({
   name: 'admin',
   initialState,
   reducers: {
      setToken(state, action) {
         localStorage.setItem('token', JSON.stringify(action.payload));

         state.token = action.payload;
      },
      deleteToken(state) {
         state.token = '';
         localStorage.removeItem('token');
      }
   }
});

export const { setToken, deleteToken } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;

export const selectToken = (state) => state.token;
