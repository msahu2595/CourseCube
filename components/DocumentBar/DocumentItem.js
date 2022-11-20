import tw from '@lib/tailwind';
import React, {memo, useCallback} from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, Image, Text, Pressable, ImageBackground} from 'react-native';

const DocumentItem = memo(props => {
  const navigation = useNavigation();

  const handleNavigation = useCallback(() => {
    navigation.navigate('DocumentViewScreen', {
      contentId: props._id,
      title: props?.title,
    });
  }, [navigation, props._id, props.title]);

  return (
    <Pressable onPress={handleNavigation}>
      <View
        style={tw.style('bg-gray-50', 'rounded-lg', 'shadow-sm', {width: 144})}>
        <ImageBackground
          source={{uri: props?.image}}
          resizeMode="cover"
          imageStyle={tw.style('rounded-lg', {
            opacity: 0.5,
          })}
          style={tw.style(
            'rounded-lg',
            'items-center',
            'shadow-sm',
            'bg-white',
            {
              height: 192,
            },
          )}>
          <Image
            source={{uri: props?.image}}
            resizeMode="cover"
            style={tw.style({
              borderRadius: 8,
              height: 192,
              aspectRatio: 3 / 4,
            })}
          />
        </ImageBackground>
        <View style={tw`p-2`}>
          <Text
            style={tw.style(
              'font-avSemi',
              'text-teal-700',
              'py-1',
              'capitalize',
              {
                fontSize: 10,
              },
            )}
            numberOfLines={1}>
            {props?.subject}
          </Text>
          <Text
            style={tw`font-avSemi text-xs text-gray-600 capitalize`}
            numberOfLines={2}>
            {props?.title}
          </Text>
          <Text
            style={tw.style('font-avReg', 'text-gray-500', 'py-1', {
              fontSize: 10,
            })}
            numberOfLines={1}>
            {`${props?.likes} Likes | 131 Reads ${
              props?.purchases ? `| ${props?.purchases} Purchases` : ''
            }`}
            {/* 12 Pages | 131 Reads */}
          </Text>
          {props?.paid && !props?.purchased ? (
            <View style={tw`flex-row justify-between my-1`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text
                  style={tw`font-avSemi rounded text-xs px-2 bg-teal-50 text-teal-600 shadow-sm`}>
                  {props?.offer
                    ? `₹ ${
                        props?.price -
                        (props?.offerType === 'PERCENT'
                          ? (props?.price * props?.offer) / 100
                          : props?.offer)
                      }`
                    : `₹ ${props?.price}`}
                </Text>
                {!!props?.offer && (
                  <Text
                    style={tw.style('px-1', 'font-avReg', 'text-gray-500', {
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                      fontSize: 10,
                    })}>
                    {`₹ ${props?.price}`}
                  </Text>
                )}
              </View>
              <Text
                style={tw.style('font-avSemi', 'text-xs', 'text-red-500', {
                  fontSize: 9,
                })}>
                {`${props?.offer}${
                  props?.offerType === 'PERCENT' ? '%' : '₹'
                } Off`}
              </Text>
            </View>
          ) : (
            <View style={tw`self-start my-1`}>
              <Text
                style={tw.style(
                  'font-avSemi',
                  'rounded',
                  'px-2',
                  'py-1',
                  'bg-teal-50',
                  'text-teal-600',
                  'shadow-sm',
                  {fontSize: 10},
                )}>
                {`Read ${props?.purchased ? '' : 'Free '}➔`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

export default DocumentItem;
