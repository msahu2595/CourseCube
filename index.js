/**
 * @format
 */

import React from 'react';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import App from './App';
import dayjs from 'dayjs';
import downloaderRef from 'downloaderRef';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import messaging from '@react-native-firebase/messaging';
import RNBackgroundDownloader from 'react-native-background-downloader';

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

// Check for existing background download running tasks
RNBackgroundDownloader.checkForExistingDownloads().then(tasks => {
  console.log('checkForExistingDownloads', tasks);
  downloaderRef.current = tasks;
});

// Check if app was launched in the background and conditionally render null if so
function HeadlessCheck({isHeadless}) {
  console.log('isHeadless:', isHeadless);
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  // Render the app component on foreground launch
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
