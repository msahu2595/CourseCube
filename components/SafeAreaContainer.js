import React from 'react';
import tw from '@lib/tailwind';
import {SafeAreaView, View} from 'react-native';
import {FocusAwareStatusBar} from '@components';

const SafeAreaContainer = ({
  statusBgColor = tw.color('white'),
  statusBarStyle = 'dark-content',
  containerStyle = {},
  style = {},
  children,
}) => {
  return (
    <SafeAreaView style={tw.style('flex-1 bg-gray-100', containerStyle)}>
      <FocusAwareStatusBar
        backgroundColor={statusBgColor}
        barStyle={statusBarStyle}
      />
      <View style={tw.style('flex-1', style)}>{children}</View>
    </SafeAreaView>
  );
};

export default SafeAreaContainer;
