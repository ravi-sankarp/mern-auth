/* eslint-disable import/no-cycle */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from '../../App/store';

export const apiSlice = createApi({
   reducerPath: 'api',
   baseQuery: fetchBaseQuery({
      baseUrl: 'http://localhost:8000',
      prepareHeaders: (headers) => {
         const { token } = store.getState().auth.data;
         if (token) {
            headers.set('authorization', `Bearer ${token}`);
         }
         return headers;
      }
   }),
   tagTypes: ['user', 'admin'],
   endpoints: (builder) => ({
      userLogin: builder.mutation({
         query: (data) => ({
            url: '/login',
            method: 'POST',
            body: data
         })
      }),
      userSignup: builder.mutation({
         query: (data) => ({
            url: '/register',
            method: 'POST',
            body: data
         })
      }),
      getUserData: builder.query({
         query: () => '/getuser',
         providesTags: ['user']
      }),
      adminLogin: builder.mutation({
         query: (data) => ({
            url: '/admin/login',
            method: 'POST',
            body: data
         })
      }),

      adminGetUserData: builder.query({
         query: () => 'admin/getuserdata',
         providesTags: ['admin']
      }),
      adminAddNew: builder.mutation({
         query: (data) => ({
            url: '/admin/addnewuser',
            method: 'POST',
            body: data
         }),
         invalidatesTags: ['admin']
      }),
      adminEditUser: builder.mutation({
         query: ({ data, id }) => ({
            url: `/admin/edituserdata/${id}`,
            method: 'PUT',
            body: data
         }),
         invalidatesTags: ['admin']
      }),
      adminDeleteUser: builder.mutation({
         query: (id) => ({
            url: `/admin/deleteuser/${id}`,
            method: 'DELETE'
         }),
         invalidatesTags: ['admin']
      })
   })
});

export const {
   useUserLoginMutation,
   useUserSignupMutation,
   useGetUserDataQuery,
   useAdminLoginMutation,
   useAdminGetUserDataQuery,
   useAdminAddNewMutation,
   useAdminEditUserMutation,
   useAdminDeleteUserMutation
} = apiSlice;
