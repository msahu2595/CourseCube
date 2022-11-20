import {Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import deepLinksConf from '@utils/deepLinksConf';

(async function onAppBootstrap() {
  // Checking Auth Status
  // const authStatus = await messaging().requestPermission();
  // const enabled =
  //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  // if (enabled) {
  //   console.log('Authorization status:', authStatus);
  // }

  // Register the device with FCM
  // await messaging().registerDeviceForRemoteMessages();

  // Get the token
  const token = await messaging().getToken();
  console.log('token ==> ', token);
})();

const linking = {
  prefixes: ['cq://'],
  // Custom function to get the URL which was used to open the app
  async getInitialURL() {
    // First, we want to do the default deep link handling
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Check if there is an initial firebase notification
    const message = await messaging().getInitialNotification();

    // Get deep link from data
    // if this is undefined, the app will open the default/home page
    return message?.data?.link;
  },
  // Custom function to subscribe to incoming links
  subscribe(listener) {
    // First, we want to do the default deep link handling
    const onReceiveURL = ({url}) => listener(url);

    // Listen to incoming links from deep linking
    const {remove} = Linking.addEventListener('url', onReceiveURL);

    // Listen to firebase push notifications
    const unsubscribeNotification = messaging().onNotificationOpenedApp(
      message => {
        const link = message?.data?.link;

        if (link) {
          // Any custom logic to check whether the URL needs to be handled

          // Call the listener to let React Navigation handle the URL
          listener(link);
        }
      },
    );

    return () => {
      // Clean up the event listeners
      remove();
      unsubscribeNotification();
    };
  },
  config: deepLinksConf,
};

export default linking;
