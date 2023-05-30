import {Text} from 'react-native';
import React, {memo, useState} from 'react';

export const CCTextExpand = memo(({children, numberOfLines, ...rest}) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <Text
      {...rest}
      ellipsizeMode="tail"
      numberOfLines={showMore ? 0 : numberOfLines}
      onPress={() => setShowMore(prev => !prev)}>
      {children}
    </Text>
  );
});
