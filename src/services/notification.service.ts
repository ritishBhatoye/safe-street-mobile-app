import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  },

  /**
   * Get Expo push token
   */
  async getExpoPushToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', token);

      // Save token to user profile
      await this.savePushToken(token);

      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  },

  /**
   * Save push token to user profile
   */
  async savePushToken(token: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ push_token: token })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  },

  /**
   * Configure notification channels (Android)
   */
  async configureChannels(): Promise<void> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('walk-alerts', {
        name: 'Walk Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#EF4444',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('walk-updates', {
        name: 'Walk Updates',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
        sound: 'default',
      });
    }
  },

  /**
   * Send local notification (for testing)
   */
  async sendLocalNotification(
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: null, // Send immediately
    });
  },

  /**
   * Send walk started notification to watchers
   */
  async notifyWalkStarted(
    walkId: string,
    walkerName: string,
    destination: string,
    watcherTokens: string[]
  ): Promise<void> {
    const message = {
      to: watcherTokens,
      sound: 'default',
      title: '🚶 Walk Started',
      body: `${walkerName} is walking to ${destination}`,
      data: {
        type: 'walk_started',
        walkId,
        screen: 'watch',
      },
      channelId: 'walk-updates',
    };

    await this.sendPushNotification(message);
  },

  /**
   * Send alert notification to watchers
   */
  async notifyAlert(
    walkId: string,
    walkerName: string,
    alertType: string,
    alertMessage: string,
    watcherTokens: string[]
  ): Promise<void> {
    const message = {
      to: watcherTokens,
      sound: 'default',
      title: '🚨 Walk Alert!',
      body: `${walkerName}: ${alertMessage}`,
      data: {
        type: 'walk_alert',
        walkId,
        alertType,
        screen: 'watch',
      },
      priority: 'high',
      channelId: 'walk-alerts',
    };

    await this.sendPushNotification(message);
  },

  /**
   * Send walk completed notification to watchers
   */
  async notifyWalkCompleted(
    walkId: string,
    walkerName: string,
    watcherTokens: string[]
  ): Promise<void> {
    const message = {
      to: watcherTokens,
      sound: 'default',
      title: '✅ Arrived Safely',
      body: `${walkerName} has arrived safely at their destination`,
      data: {
        type: 'walk_completed',
        walkId,
        screen: 'watch',
      },
      channelId: 'walk-updates',
    };

    await this.sendPushNotification(message);
  },

  /**
   * Send push notification via Expo Push API
   */
  async sendPushNotification(message: any): Promise<void> {
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const data = await response.json();
      console.log('Push notification sent:', data);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  },

  /**
   * Get watcher push tokens
   */
  async getWatcherTokens(walkId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('walk_watchers')
        .select(`
          watcher_user_id,
          profiles:watcher_user_id (
            push_token
          )
        `)
        .eq('walk_id', walkId)
        .not('watcher_user_id', 'is', null);

      if (error) throw error;

      const tokens = data
        ?.map((w: any) => w.profiles?.push_token)
        .filter((token: string | null) => token !== null) || [];

      return tokens;
    } catch (error) {
      console.error('Error getting watcher tokens:', error);
      return [];
    }
  },

  /**
   * Handle notification tap
   */
  setupNotificationListeners(
    onNotificationTap: (data: any) => void
  ): () => void {
    // Handle notification received while app is foregrounded
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    // Handle notification tap
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log('Notification tapped:', data);
        onNotificationTap(data);
      }
    );

    // Return cleanup function
    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  },

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  },

  /**
   * Get notification badge count
   */
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  },

  /**
   * Set notification badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  },
};
