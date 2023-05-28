import React from 'react';
import {
  adminStackGroup,
  authStackGroup,
  verifyUserStackGroup,
  tabStackGroup,
  homeStackGroup,
  myProfileStackGroup,
  communityStackGroup,
  contentListStackGroup,
  contentViewStackGroup,
  userMenuStackGroup,
  settingStackGroup,
} from '@navigation_groups';
import {loggedUserVar} from 'apollo/client';
import {useReactiveVar} from '@apollo/client';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator(); // Create Stack Navigator

const MainNativeStackNavigator = () => {
  const loggedUser = useReactiveVar(loggedUserVar);

  console.log({loggedUser});

  return (
    <Stack.Navigator>
      {loggedUser ? (
        <>
          {loggedUser?.role === 'ADMIN' && adminStackGroup()}
          {!loggedUser?.userVerified && verifyUserStackGroup()}
          {tabStackGroup()}
          {homeStackGroup()}
          {myProfileStackGroup()}
          {communityStackGroup()}
          {contentListStackGroup()}
          {contentViewStackGroup()}
          {userMenuStackGroup()}
          {settingStackGroup()}
        </>
      ) : (
        authStackGroup()
      )}
    </Stack.Navigator>
  );
};

export default MainNativeStackNavigator;
