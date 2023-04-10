import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {tw} from '@lib';
import React, {memo} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const CCSearchInput = memo(({searching = false, onClear, ...rest}) => (
  <View
    style={tw`m-2 flex-row items-center bg-gray-50 border border-gray-300 rounded-lg`}>
    <TextInput
      style={tw.style('pl-2 flex-1 text-black')}
      placeholder="Enter search text here..."
      placeholderTextColor={tw.color('gray-400')}
      autoCapitalize="none"
      autoCorrect={false}
      {...rest}
    />
    <TouchableOpacity disabled={searching} onPress={onClear} style={tw`p-2`}>
      {searching ? (
        <ActivityIndicator size="small" color={tw.color('black')} />
      ) : (
        <MaterialIcons name="clear" size={22} color={tw.color('gray-500')} />
      )}
    </TouchableOpacity>
  </View>
));
