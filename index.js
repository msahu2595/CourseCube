/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import messaging from '@react-native-firebase/messaging';

dayjs.extend(duration);
dayjs.extend(relativeTime);

// Register background handler
messaging().setBackgroundMessageHandler(message => {
  const promise = new Promise(resolve => {
    console.log('message ==> ', message?.notification);
    resolve();
  });
  return promise;
});

AppRegistry.registerComponent(appName, () => App);
