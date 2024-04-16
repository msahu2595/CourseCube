import React from 'react';
import {ApolloProvider} from '@apollo/client';
import {ModalPortal} from 'react-native-modals';
import {MenuProvider} from 'react-native-popup-menu';
import FlashMessage from 'react-native-flash-message';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MainNativeStackNavigator from '@navigators';
import {NetworkStatusProvider} from '@components';
import navigatorRef from 'navigatorRef';
import client from './apollo/client';
import {linking} from '@lib';

const App = () => {
  return (
    <ApolloProvider client={client}>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <GestureHandlerRootView style={{flex: 1}}>
        <MenuProvider>
          <SafeAreaProvider>
            <NavigationContainer ref={navigatorRef} linking={linking}>
              <MainNativeStackNavigator />
              <NetworkStatusProvider />
            </NavigationContainer>
            <ModalPortal />
          </SafeAreaProvider>
        </MenuProvider>
        <FlashMessage position="top" icon="auto" />
      </GestureHandlerRootView>
    </ApolloProvider>
  );
};

export default App;
