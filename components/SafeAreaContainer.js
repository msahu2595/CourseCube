import React from 'react';
import tw from '@lib/tailwind';
import {SafeAreaView} from 'react-native';
import {FocusAwareStatusBar} from '@components';

const SafeAreaContainer = ({
  statusBgColor = tw.color('white'),
  statusBarStyle = 'dark-content',
  children,
}) => {
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <FocusAwareStatusBar
        backgroundColor={statusBgColor}
        barStyle={statusBarStyle}
      />
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaContainer;
