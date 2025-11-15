import { configureStore } from '@reduxjs/toolkit';
import { incidentsApi } from './api/incidentsApi';
import { profileApi } from '@/services/profile.service';
export const store = configureStore({
  reducer: {
    [incidentsApi.reducerPath]: incidentsApi.reducer,
    [profileApi.reducerPath]:profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // RTK Query actions
          'incidentsApi/executeQuery/pending',
          'incidentsApi/executeQuery/fulfilled',
          'incidentsApi/executeQuery/rejected',
          'incidentsApi/executeMutation/pending',
          'incidentsApi/executeMutation/fulfilled',
          'incidentsApi/executeMutation/rejected',
          
        ],
      },
    }).concat(incidentsApi.middleware,profileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppStore = typeof store;