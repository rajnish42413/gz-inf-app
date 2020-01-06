import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';

export default async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }
   let token = await Notifications.getExpoPushTokenAsync();
   createChannels();
   return token;
}


const createReminders = () => {
  Notifications.createChannelAndroidAsync('reminders', {
    name: 'Reminders',
    sound: true,
    priority: 'max',
  });
};


export const createChannels = () => {
  if (Platform.OS !== "android") {
      return;
  }
  createReminders();
};