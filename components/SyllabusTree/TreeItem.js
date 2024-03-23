import {tw} from '@lib';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const TreeItem = props => {
  const {
    label,
    onPress,
    onPressAdd,
    onPressEdit,
    onPressDelete,
    isAdmin = false,
    isSection = false,
    iconColor = 'blue-600',
    subjectCount,
  } = props;
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={tw.style({flex: 1}, 'py-2 flex-row')}>
        {isSection ? (
          <MaterialCommunityIcons
            name="book-open-page-variant-outline"
            size={20}
            color={tw.color(iconColor)}
          />
        ) : (
          <MaterialCommunityIcons
            name="play-box-multiple-outline"
            size={18}
            color={tw.color(iconColor)}
          />
        )}
        <Text
          style={tw`flex-1 pl-1 ${
            isSection ? 'font-avSemi text-base' : 'font-avReg text-sm'
          } text-gray-900`}>
          {label}
        </Text>
        {isSection && (
          <View style={tw`px-1`}>
            <MaterialCommunityIcons
              name="arrow-down-drop-circle-outline"
              size={20}
              color={tw.color(iconColor)}
            />
          </View>
        )}
      </TouchableOpacity>
      {isAdmin && (
        <View style={tw`flex-1 flex-row flex-wrap pl-5`}>
          <TouchableOpacity
            onPress={onPressEdit}
            style={tw`mx-1 w-[28px] h-[28px] rounded-full bg-${iconColor} items-center justify-center`}>
            <MaterialCommunityIcons name="pencil" size={18} color={'white'} />
          </TouchableOpacity>
          {isSection ? (
            <>
              {subjectCount < 1 && (
                <TouchableOpacity
                  onPress={onPressDelete}
                  style={tw`mx-1 w-[28px] h-[28px] rounded-full bg-${iconColor} items-center justify-center`}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={18}
                    color={'white'}
                  />
                </TouchableOpacity>
              )}
              <View style={tw`mx-1 w-[1px] h-[28px] bg-black`} />
              <TouchableOpacity
                onPress={onPressAdd}
                style={tw`mx-1 px-1 h-[28px] rounded-full bg-${iconColor} items-center justify-center flex-row`}>
                <MaterialCommunityIcons
                  name="plus-thick"
                  size={18}
                  color={'white'}
                />
                <Text style={tw`px-1 font-avReg text-sm text-white`}>
                  Subject
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={onPressDelete}
              style={tw`mx-1 w-[28px] h-[28px] rounded-full bg-${iconColor} items-center justify-center`}>
              <MaterialCommunityIcons name="delete" size={18} color={'white'} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};
