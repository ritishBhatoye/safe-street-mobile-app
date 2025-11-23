import { supabase } from '@/lib/supabase';
import { WALK_CONFIG } from '@/constants/walk';

export const walkService = {
  // Create a new walk
  async createWalk(data: CreateWalkRequest): Promise<Walk> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: walk, error } = await supabase
      .from('walks')
      .insert({
        user_id: user.id,
        destination_address: data.destination_address,
        destination_lat: data.destination_lat,
        destination_lng: data.destination_lng,
        estimated_duration: data.estimated_duration,
        expected_arrival: data.estimated_duration 
          ? new Date(Date.now() + data.estimated_duration * 60000).toISOString()
          : null,
      })
      .select()
      .single();

    if (error) throw error;

    // Add watchers if provided
    if (data.watchers && data.watchers.length > 0) {
      await this.addWatchers(walk.id, data.watchers);
    }

    return walk;
  },

  // Start the walk (update with starting location)
  async startWalk(data: StartWalkRequest): Promise<Walk> {
    const { data: walk, error } = await supabase
      .from('walks')
      .update({
        start_lat: data.start_lat,
        start_lng: data.start_lng,
        start_address: data.start_address,
        last_lat: data.start_lat,
        last_lng: data.start_lng,
        last_location_update: new Date().toISOString(),
        started_at: new Date().toISOString(),
      })
      .eq('id', data.walk_id)
      .select()
      .single();

    if (error) throw error;

    // Create started checkpoint
    await this.createCheckpoint(data.walk_id, 'started', data.start_lat, data.start_lng);

    return walk;
  },

  // Update last known location (not stored historically)
  async updateLastLocation(walkId: string, location: LiveLocation): Promise<void> {
    const { error } = await supabase
      .from('walks')
      .update({
        last_lat: location.latitude,
        last_lng: location.longitude,
        last_location_update: new Date().toISOString(),
      })
      .eq('id', walkId);

    if (error) throw error;
  },

  // Broadcast live location via Realtime (Zomato style - no DB storage)
  broadcastLocation(walkId: string, location: LiveLocation) {
    const channel = supabase.channel(`${WALK_CONFIG.CHANNEL_PREFIX}${walkId}`);
    
    channel.send({
      type: 'broadcast',
      event: 'location_update',
      payload: location,
    });
  },

  // Subscribe to live location updates
  subscribeToLocation(walkId: string, callback: (location: LiveLocation) => void) {
    const channel = supabase
      .channel(`${WALK_CONFIG.CHANNEL_PREFIX}${walkId}`)
      .on('broadcast', { event: 'location_update' }, ({ payload }) => {
        callback(payload as LiveLocation);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },

  // Subscribe to walk updates (status changes)
  subscribeToWalkUpdates(walkId: string, callback: (walk: Walk) => void) {
    const channel = supabase
      .channel(`walk_updates_${walkId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'walks',
          filter: `id=eq.${walkId}`,
        },
        (payload) => {
          callback(payload.new as Walk);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },

  // Subscribe to new alerts
  subscribeToAlerts(walkId: string, callback: (alert: WalkAlert) => void) {
    const channel = supabase
      .channel(`walk_alerts_${walkId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'walk_alerts',
          filter: `walk_id=eq.${walkId}`,
        },
        (payload) => {
          callback(payload.new as WalkAlert);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },

  // Complete walk
  async completeWalk(walkId: string): Promise<Walk> {
    const { data: walk, error } = await supabase
      .from('walks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', walkId)
      .select()
      .single();

    if (error) throw error;

    // Create arrived checkpoint
    await this.createCheckpoint(walkId, 'arrived');

    return walk;
  },

  // Cancel walk
  async cancelWalk(walkId: string): Promise<Walk> {
    const { data: walk, error } = await supabase
      .from('walks')
      .update({
        status: 'cancelled',
        completed_at: new Date().toISOString(),
      })
      .eq('id', walkId)
      .select()
      .single();

    if (error) throw error;
    return walk;
  },

  // Get active walk for user
  async getActiveWalk(): Promise<Walk | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('walks')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Get walk by ID (for watchers)
  async getWalk(walkId: string): Promise<Walk> {
    const { data, error } = await supabase
      .from('walks')
      .select('*')
      .eq('id', walkId)
      .single();

    if (error) throw error;
    return data;
  },

  // Add watchers
  async addWatchers(walkId: string, watchers: { watcher_name: string; watcher_phone: string }[]) {
    const watchersData = watchers.map(w => ({
      walk_id: walkId,
      watcher_name: w.watcher_name,
      watcher_phone: w.watcher_phone,
      share_token: this.generateShareToken(),
    }));

    const { error } = await supabase
      .from('walk_watchers')
      .insert(watchersData);

    if (error) throw error;
  },

  // Get watchers for a walk
  async getWatchers(walkId: string): Promise<WalkWatcher[]> {
    const { data, error } = await supabase
      .from('walk_watchers')
      .select('*')
      .eq('walk_id', walkId);

    if (error) throw error;
    return data || [];
  },

  // Create alert
  async createAlert(walkId: string, alertType: AlertType, message: string): Promise<WalkAlert> {
    const { data, error } = await supabase
      .from('walk_alerts')
      .insert({
        walk_id: walkId,
        alert_type: alertType,
        message,
      })
      .select()
      .single();

    if (error) throw error;

    // Update walk status to alert
    await supabase
      .from('walks')
      .update({ status: 'alert' })
      .eq('id', walkId);

    return data;
  },

  // Get alerts for a walk
  async getAlerts(walkId: string): Promise<WalkAlert[]> {
    const { data, error } = await supabase
      .from('walk_alerts')
      .select('*')
      .eq('walk_id', walkId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create checkpoint
  async createCheckpoint(
    walkId: string, 
    type: CheckpointType, 
    lat?: number, 
    lng?: number
  ): Promise<WalkCheckpoint> {
    const { data, error } = await supabase
      .from('walk_checkpoints')
      .insert({
        walk_id: walkId,
        checkpoint_type: type,
        lat,
        lng,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Generate share token for watchers
  generateShareToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  },

  // Get share link for watchers
  getShareLink(walkId: string, token: string): string {
    // This would be your app's deep link or web URL
    return `safestreet://walk/${walkId}?token=${token}`;
  },
};
