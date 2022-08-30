/* eslint-disable import/no-cycle */
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import authReducer from '../features/reducers/authSlice';

const store = configureStore({
   reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;
