import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/lib/supabase';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Profile', 'Stats'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, string>({
      queryFn: async (userId) => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }

          return { data: data as UserProfile };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<UserProfile, { userId: string; data: ProfileUpdateData }>({
      queryFn: async ({ userId, data }) => {
        try {
          const updateData = {
            ...data,
            updated_at: new Date().toISOString(),
          };

          const { data: updatedData, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId)
            .select()
            .single();

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }

          return { data: updatedData as UserProfile };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Profile'],
    }),

    uploadAvatar: builder.mutation<string, { userId: string; imageUri: string }>({
      queryFn: async ({ userId, imageUri }) => {
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();

          const fileExt = imageUri.split('.').pop() || 'jpg';
          const fileName = `${userId}/avatar.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob, {
              cacheControl: '3600',
              upsert: true,
            });

          if (uploadError) {
            return { error: { status: 'CUSTOM_ERROR', error: uploadError.message } };
          }

          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          return { data: urlData.publicUrl };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Profile'],
    }),

    getUserStats: builder.query<UserStats, string>({
      queryFn: async (userId) => {
        try {
          const { count, error: countError } = await supabase
            .from('incidents')
            .select('*', { count: 'exact', head: true })
            .eq('reported_by', userId);

          if (countError) {
            return { error: { status: 'CUSTOM_ERROR', error: countError.message } };
          }

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('created_at')
            .eq('id', userId)
            .single();

          if (profileError) {
            return { error: { status: 'CUSTOM_ERROR', error: profileError.message } };
          }

          const createdDate = new Date(profile.created_at);
          const memberSince = createdDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          });

          return {
            data: {
              incidentsReported: count || 0,
              memberSince,
            },
          };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Stats'],
    }),

    deleteAvatar: builder.mutation<void, string>({
      queryFn: async (userId) => {
        try {
          const { error } = await supabase.storage
            .from('avatars')
            .remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.webp`]);

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }

          return { data: undefined };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useGetUserStatsQuery,
  useDeleteAvatarMutation,
} = profileApi;
