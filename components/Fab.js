import React from 'react';
import tw from '@lib/tailwind';
import {TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Fab = ({onPress, bgColor, iconName, iconSize = 28, style}) => {
  return (
    <TouchableOpacity
      onPressOut={onPress}
      style={tw.style(
        'absolute',
        'bottom-2',
        'right-2',
        'justify-center',
        'items-center',
        'rounded-full',
        'shadow',
        {width: 56, height: 56, backgroundColor: bgColor, ...style},
      )}>
      <AntDesign name={iconName} size={iconSize} color={tw.color('white')} />
    </TouchableOpacity>
  );
};

export default Fab;
