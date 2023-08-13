import {tw} from '@lib';
import React, {memo} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

const LoadingIndicator = memo(({loading, color = tw.color('green-600')}) =>
  loading ? (
    <View
      style={tw.style('items-center justify-center', StyleSheet.absoluteFill)}>
      <View style={tw`p-4 bg-white rounded-lg`}>
        <ActivityIndicator size="large" color={color} />
      </View>
    </View>
  ) : null,
);

export default LoadingIndicator;
