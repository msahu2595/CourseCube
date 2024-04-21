import {tw} from '@lib';
import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';

export const CCShareButton = memo(
  ({refId, initial = false, refetchQueries = [], children}) => {
    const onPress = () => {
      // TODO: Implement share functionality
    };

    return (
      <TouchableOpacity
        disabled={!refId}
        onPress={onPress}
        style={tw`opacity-${refId ? 100 : 50}`}>
        {children}
      </TouchableOpacity>
    );
  },
);
