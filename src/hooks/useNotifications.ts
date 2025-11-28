import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { notificationService } from '@/services/notification.service';

export const useNotifications = () => {
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize notifications
    const initialize = async () => {
      try {
        // Configure channels (Android)
        await notificationService.configureChannels();

        // Get push token
        const token = await notificationService.getExpoPushToken();
        setExpoPushToken(token);

        setIsReady(true);
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initialize();

    // Setup notification listeners
    const cleanup = notificationService.setupNotificationListeners((data) => {
      handleNotificationTap(data);
    });

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNotificationTap = (data: any) => {
    console.log('Handling notification tap:', data);

    switch (data.type) {
      case 'walk_started':
      case 'walk_alert':
      case 'walk_completed':
        if (data.walkId) {
          router.push(`/(tabs)/home/walk-with-me/watch/${data.walkId}`);
        }
        break;
      default:
        console.log('Unknown notification type:', data.type);
    }
  };

  return {
    expoPushToken,
    isReady,
  };
};
