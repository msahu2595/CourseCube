import {tw} from '@lib';
import React, {memo} from 'react';
import {View, Text} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

const NetworkStatusProvider = memo(() => {
  const netInfo = useNetInfo();

  if (!netInfo.isInternetReachable || !netInfo.isConnected) {
    return (
      <View style={tw`items-center justify-center bg-red-700`}>
        <Text style={tw`font-popReg text-white text-xs text-center`}>
          No connection
        </Text>
      </View>
    );
  }

  return null;
});

export default NetworkStatusProvider;
