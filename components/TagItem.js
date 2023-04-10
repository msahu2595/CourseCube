import React from 'react';
import tw from '@lib/tailwind';
import {TouchableOpacity, Text} from 'react-native';

const TagItem = ({name, selected = null, onPress}) => (
  <TouchableOpacity
    onPress={() => {
      onPress(name);
    }}
    style={tw`self-start py-1 px-4 items-center justify-center bg-gray-200 rounded-full ${
      selected === name ? 'bg-blue-700' : 'bg-gray-200'
    }`}>
    <Text
      style={tw`font-avSemi text-xs text-center ${
        selected === name ? 'text-white' : 'text-gray-600'
      }`}>
      {name}
    </Text>
  </TouchableOpacity>
);

export default TagItem;
