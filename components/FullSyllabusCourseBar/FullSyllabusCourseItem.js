import tw from '@lib/tailwind';
import React, {memo, useCallback} from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, Image, Text, Pressable} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FullSyllabusCourseItem = memo(props => {
  const navigation = useNavigation();

  const handleNavigation = useCallback(() => {
    navigation.navigate('ContentDetailTopTabNavigator', {
      bundleId: props._id,
    });
  }, [navigation, props._id]);

  return (
    <Pressable onPress={handleNavigation}>
      <LinearGradient
        colors={['#BBF7D0', '#F0FDF4', '#FFF']}
        style={tw.style('rounded-lg', 'shadow-sm', 'pt-3', 'pb-4', {
          width: 288,
          paddingHorizontal: 12,
        })}>
        <Text style={tw`font-avSemi text-sm text-gray-600`} numberOfLines={2}>
          {props?.title}
        </Text>
        <Text
          style={tw`font-avReg text-xs text-green-600 py-2`}
          numberOfLines={1}>
          Videos + PDF's + Tests | 400+ Hours
        </Text>
        <View style={tw`py-2`}>
          <View style={tw`flex-row pb-2`}>
            <Icon name="lightbulb-on-outline" color="#58585B" size={16} />
            <Text style={tw`font-avReg text-xs text-gray-500 px-2`}>
              {props?.highlight || 'New Batch'}
            </Text>
          </View>
          <View style={tw`flex-row pb-2`}>
            <Icon name="account-check-outline" color="#58585B" size={16} />
            <Text style={tw`font-avReg text-xs text-gray-500 px-2`}>
              {props?.instructors.reduce(
                (prev, cur) => (prev ? `${prev}, ${cur}` : cur),
                '',
              )}
            </Text>
          </View>
        </View>
        <Image
          source={{uri: props?.image}}
          resizeMode="cover"
          style={tw.style('rounded-lg', 'my-2', 'self-center', {
            height: 152,
            aspectRatio: 16 / 9,
          })}
        />
        <View style={tw`w-full flex-row justify-between pt-3`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text
              style={tw`font-avSemi rounded px-2 bg-green-100 text-green-600 shadow-sm`}>
              {`₹ ${
                props?.price -
                (props?.offerType === 'PERCENT'
                  ? (props?.price * props?.offer) / 100
                  : props?.offer)
              }`}
            </Text>
            <Text
              style={tw.style(
                'px-2',
                'font-avReg',
                'text-xs',
                'text-gray-500',
                {
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                },
              )}>
              {`₹ ${props?.price}`}
            </Text>
          </View>
          <Text style={tw`font-avSemi text-xs text-red-500`}>{`${
            props?.offer
          } ${props?.offerType === 'PERCENT' ? '%' : '₹'} Off`}</Text>
        </View>
        <View style={tw`flex-row mt-2 mb-3 justify-between`}>
          <Text
            style={tw.style(
              'font-avBold',
              'text-gray-500',
              'bg-white',
              'px-2',
              'py-1',
              'rounded',
              'shadow-sm',
              {fontSize: 10},
            )}>
            8 Free Content Inside This Course
          </Text>
          <Text
            style={tw.style(
              'font-avBold',
              'font-bold',
              'text-gray-500',
              'bg-white',
              'px-2',
              'py-1',
              'rounded',
              'shadow-sm',
              {fontSize: 10, fontWeight: 'bold'},
            )}>
            {props?.language === 'HI' ? 'हिं' : 'EN'}
          </Text>
        </View>
        <View style={tw`flex-row items-center self-center`}>
          <Icon
            name="play-box-multiple-outline"
            color={tw.color('green-600')}
            size={16}
          />
          <Text style={tw`px-2 font-avSemi text-xs text-green-600`}>
            View Full Course
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
});

export default FullSyllabusCourseItem;
