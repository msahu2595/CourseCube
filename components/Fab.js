import React from 'react';
import tw from '@lib/tailwind';
import {TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Fab = ({onPress, disabled, bgColor, iconName, iconSize = 28, style}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={tw.style(
        `absolute bottom-2 right-2 justify-center items-center rounded-full shadow opacity-${
          disabled ? 50 : 100
        }`,
        {width: 56, height: 56, backgroundColor: bgColor, ...style},
      )}>
      <AntDesign name={iconName} size={iconSize} color={tw.color('white')} />
    </TouchableOpacity>
  );
};

export default Fab;
