import React from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {ApolloProvider} from '@apollo/client';
import {MenuProvider} from 'react-native-popup-menu';
import FlashMessage from 'react-native-flash-message';
import {NavigationContainer} from '@react-navigation/native';
import MainNativeStackNavigator from '@navigators';
import {NetworkStatusProvider} from '@components';
import navigatorRef from 'navigatorRef';
import client from './apollo/client';
import {linking} from '@lib';

const App = () => {
  return (
    <MenuProvider>
      <SafeAreaProvider>
        <NavigationContainer ref={navigatorRef} linking={linking}>
          <ApolloProvider client={client}>
            <MainNativeStackNavigator />
            <NetworkStatusProvider />
          </ApolloProvider>
        </NavigationContainer>
        <SafeAreaFlashMessage position="top" />
      </SafeAreaProvider>
    </MenuProvider>
  );
};

export default App;

const SafeAreaFlashMessage = props => {
  const insets = useSafeAreaInsets();

  let statusBarHeight = 0;

  if (props.position === 'top') {
    statusBarHeight = insets.top;
  } else if (props.position === 'bottom') {
    statusBarHeight = insets.bottom;
  }

  return <FlashMessage {...props} statusBarHeight={statusBarHeight} />;
};
