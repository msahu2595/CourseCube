import React from 'react';
import tw from '@lib/tailwind';
import {SafeAreaContainer} from '@components';

const UserSearchScreen = () => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      {/* <Text>Hello</Text> */}
    </SafeAreaContainer>
  );
};

export default UserSearchScreen;
