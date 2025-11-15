import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/lib/supabase';
import { 
  Incident, 
  CreateIncidentRequest, 
  UpdateIncidentRequest,
  NearbyIncidentsParams,
  GetIncidentsParams 
} from '@/types/incidents';

export const incidentsApi = createApi({
  reducerPath: 'incidentsApi',
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ['Incident'],
  endpoints: (builder) => ({
    // Get nearby incidents using PostGIS function
    getNearbyIncidents: builder.query<Incident[], NearbyIncidentsParams>({
      queryFn: async ({ lat, lng, radius = 5 }) => {
        try {
          const { data, error } = await supabase.rpc('nearby_incidents', {
            lat,
            long: lng,
            radius_km: radius
          });

          if (error) {
            throw new Error(error.message);
          }

          // Transform PostGIS data to our format
          const incidents: Incident[] = data?.map((incident: any) => ({
            ...incident,
            location: {
              latitude: incident.location?.coordinates?.[1] || lat,
              longitude: incident.location?.coordinates?.[0] || lng,
            }
          })) || [];

          return { data: incidents };
        } catch (error: any) {
          return { error: error.message || 'Failed to fetch nearby incidents' };
        }
      },
      providesTags: ['Incident'],
    }),

    // Create new incident
    createIncident: builder.mutation<Incident, CreateIncidentRequest>({
      queryFn: async (incidentData) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('User not authenticated');
          }

          // Convert lat/lng to PostGIS POINT format
          const { data, error } = await supabase
            .from('incidents')
            .insert({
              type: incidentData.type,
              severity: incidentData.severity,
              title: incidentData.title,
              description: incidentData.description,
              location: `POINT(${incidentData.longitude} ${incidentData.latitude})`,
              address: incidentData.address,
              city: incidentData.city,
              state: incidentData.state,
              country: incidentData.country,
              photos: incidentData.photos || [],
              reported_by: user.id,
              status: 'active',
              confirmed_count: 0,
            })
            .select()
            .single();

          if (error) {
            throw new Error(error.message);
          }

          // Transform response to match our interface
          const incident: Incident = {
            ...data,
            location: {
              latitude: incidentData.latitude,
              longitude: incidentData.longitude,
            }
          };

          return { data: incident };
        } catch (error: any) {
          return { error: error.message || 'Failed to create incident' };
        }
      },
      invalidatesTags: ['Incident'],
    }),

    // Get all incidents with pagination and filters
    getAllIncidents: builder.query<{ incidents: Incident[]; total: number }, GetIncidentsParams>({
      queryFn: async ({ page = 1, limit = 20, type, severity, status }) => {
        try {
          let query = supabase
            .from('incidents')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

          // Apply filters
          if (type) {
            query = query.eq('type', type);
          }
          if (severity) {
            query = query.eq('severity', severity);
          }
          if (status) {
            query = query.eq('status', status);
          }

          // Apply pagination
          const from = (page - 1) * limit;
          const to = from + limit - 1;
          query = query.range(from, to);

          const { data, error, count } = await query;

          if (error) {
            throw new Error(error.message);
          }

          // Transform PostGIS data to our format
          const incidents: Incident[] = data?.map((incident: any) => ({
            ...incident,
            location: {
              latitude: incident.location?.coordinates?.[1] || 0,
              longitude: incident.location?.coordinates?.[0] || 0,
            }
          })) || [];

          return { 
            data: { 
              incidents, 
              total: count || 0 
            } 
          };
        } catch (error: any) {
          return { error: error.message || 'Failed to fetch incidents' };
        }
      },
      providesTags: ['Incident'],
    }),

    // Get incident by ID
    getIncidentById: builder.query<Incident, string>({
      queryFn: async (id) => {
        try {
          const { data, error } = await supabase
            .from('incidents')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            throw new Error(error.message);
          }

          // Transform PostGIS data to our format
          const incident: Incident = {
            ...data,
            location: {
              latitude: data.location?.coordinates?.[1] || 0,
              longitude: data.location?.coordinates?.[0] || 0,
            }
          };

          return { data: incident };
        } catch (error: any) {
          return { error: error.message || 'Failed to fetch incident' };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Incident', id }],
    }),

    // Update incident
    updateIncident: builder.mutation<Incident, UpdateIncidentRequest>({
      queryFn: async ({ id, ...updateData }) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('User not authenticated');
          }

          const { data, error } = await supabase
            .from('incidents')
            .update(updateData)
            .eq('id', id)
            .eq('reported_by', user.id) // Only allow users to update their own incidents
            .select()
            .single();

          if (error) {
            throw new Error(error.message);
          }

          // Transform response to match our interface
          const incident: Incident = {
            ...data,
            location: {
              latitude: data.location?.coordinates?.[1] || 0,
              longitude: data.location?.coordinates?.[0] || 0,
            }
          };

          return { data: incident };
        } catch (error: any) {
          return { error: error.message || 'Failed to update incident' };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Incident', id }, 'Incident'],
    }),

    // Delete incident
    deleteIncident: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('User not authenticated');
          }

          const { error } = await supabase
            .from('incidents')
            .delete()
            .eq('id', id)
            .eq('reported_by', user.id); // Only allow users to delete their own incidents

          if (error) {
            throw new Error(error.message);
          }

          return { data: undefined };
        } catch (error: any) {
          return { error: error.message || 'Failed to delete incident' };
        }
      },
      invalidatesTags: ['Incident'],
    }),

    // Confirm incident (increment confirmed_count)
    confirmIncident: builder.mutation<Incident, string>({
      queryFn: async (id) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('User not authenticated');
          }

          // First get current confirmed_count
          const { data: currentIncident, error: fetchError } = await supabase
            .from('incidents')
            .select('confirmed_count')
            .eq('id', id)
            .single();

          if (fetchError) {
            throw new Error(fetchError.message);
          }

          // Increment confirmed_count
          const { data, error } = await supabase
            .from('incidents')
            .update({ confirmed_count: (currentIncident.confirmed_count || 0) + 1 })
            .eq('id', id)
            .select()
            .single();

          if (error) {
            throw new Error(error.message);
          }

          // Transform response to match our interface
          const incident: Incident = {
            ...data,
            location: {
              latitude: data.location?.coordinates?.[1] || 0,
              longitude: data.location?.coordinates?.[0] || 0,
            }
          };

          return { data: incident };
        } catch (error: any) {
          return { error: error.message || 'Failed to confirm incident' };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Incident', id }, 'Incident'],
    }),
  }),
});

export const {
  useGetNearbyIncidentsQuery,
  useCreateIncidentMutation,
  useGetAllIncidentsQuery,
  useGetIncidentByIdQuery,
  useUpdateIncidentMutation,
  useDeleteIncidentMutation,
  useConfirmIncidentMutation,
} = incidentsApi;