import {tw} from '@lib';
import React from 'react';
import {View, Text} from 'react-native';
import {SafeAreaContainer} from '@components';

const PaymentsScreen = () => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <Text style={tw`font-avReg text-base text-black`}>
          Nothing purchased yet.
        </Text>
      </View>
    </SafeAreaContainer>
  );
};

export default PaymentsScreen;
