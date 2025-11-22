import { useState, useEffect, useCallback } from 'react';
import { walkService } from '@/services/walk.service';

export const useWalk = () => {
  const [activeWalk, setActiveWalk] = useState<Walk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActiveWalk = useCallback(async () => {
    try {
      setLoading(true);
      const walk = await walkService.getActiveWalk();
      setActiveWalk(walk);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActiveWalk();
  }, [loadActiveWalk]);

  const createWalk = async (data: CreateWalkRequest) => {
    try {
      const walk = await walkService.createWalk(data);
      setActiveWalk(walk);
      return walk;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const startWalk = async (data: StartWalkRequest) => {
    try {
      const walk = await walkService.startWalk(data);
      setActiveWalk(walk);
      return walk;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const completeWalk = async (walkId: string) => {
    try {
      const walk = await walkService.completeWalk(walkId);
      setActiveWalk(null);
      return walk;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const cancelWalk = async (walkId: string) => {
    try {
      const walk = await walkService.cancelWalk(walkId);
      setActiveWalk(null);
      return walk;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const createAlert = async (walkId: string, alertType: AlertType, message: string) => {
    try {
      return await walkService.createAlert(walkId, alertType, message);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    activeWalk,
    loading,
    error,
    createWalk,
    startWalk,
    completeWalk,
    cancelWalk,
    createAlert,
    refresh: loadActiveWalk,
  };
};
