import React from 'react';
import tw from '@lib/tailwind';
import {TouchableOpacity, Text} from 'react-native';

const CommunityTagItem = ({tag, index}) => {
  return (
    <TouchableOpacity
      key={`TAG_${index}`}
      style={tw`self-start py-1 px-4 items-center justify-center bg-gray-200 rounded-full`}>
      <Text style={tw`font-avSemi text-gray-600 text-xs text-center`}>
        {tag}
      </Text>
    </TouchableOpacity>
  );
};

export default CommunityTagItem;
