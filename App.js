import React from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {ApolloProvider} from '@apollo/client';
import {ModalPortal} from 'react-native-modals';
import {MenuProvider} from 'react-native-popup-menu';
import FlashMessage from 'react-native-flash-message';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MainNativeStackNavigator from '@navigators';
import {NetworkStatusProvider} from '@components';
import navigatorRef from 'navigatorRef';
import client from './apollo/client';
import {linking} from '@lib';

const App = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={{flex: 1}}>
        <MenuProvider>
          <SafeAreaProvider>
            <NavigationContainer ref={navigatorRef} linking={linking}>
              <MainNativeStackNavigator />
              <NetworkStatusProvider />
            </NavigationContainer>
            <SafeAreaFlashMessage position="top" />
            <ModalPortal />
          </SafeAreaProvider>
        </MenuProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
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
