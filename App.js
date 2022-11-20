import React from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {MenuProvider} from 'react-native-popup-menu';
import FlashMessage from 'react-native-flash-message';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MenuProvider>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={TabNavigator} />
          </Stack.Navigator>
        </MenuProvider>
        <SafeAreaFlashMessage position="top" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="AboutTab" component={TopTabNavigator} />
    </Tab.Navigator>
  );
};

const TopTabNavigator = () => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="HomeTopTab" component={HomeScreen} />
      <TopTab.Screen name="AboutTopTab" component={HomeScreen} />
    </TopTab.Navigator>
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
