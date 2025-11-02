import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/lib/supabase';
import type { UserProfile, ProfileUpdateData, UserStats } from '@/types';

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
            // If profile doesn't exist, try to create it
            if (error.code === 'PGRST116') {
              console.log('Profile not found, attempting to create...');
              
              // Get user email from auth
              const { data: { user } } = await supabase.auth.getUser();
              
              if (user) {
                const newProfile = {
                  id: userId,
                  email: user.email || '',
                  name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                
                const { data: createdProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert(newProfile)
                  .select()
                  .single();
                
                if (createError) {
                  console.error('Error creating profile:', createError);
                  return { error: { status: 'CUSTOM_ERROR', error: createError.message } };
                }
                
                return { data: createdProfile as UserProfile };
              }
            }
            
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
          // For React Native, read the file as ArrayBuffer
          const response = await fetch(imageUri);
          const arrayBuffer = await response.arrayBuffer();
          
          const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
          const fileName = `${userId}/avatar.${fileExt}`;
          const contentType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, arrayBuffer, {
              cacheControl: '3600',
              upsert: true,
              contentType,
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
