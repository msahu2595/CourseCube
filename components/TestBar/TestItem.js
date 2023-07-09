import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useMemo} from 'react';
import {View, Text, Image, Pressable, ImageBackground} from 'react-native';

const TestItem = memo(({width = 184, ...rest}) => {
  const navigation = useNavigation();

  const handleNavigation = useCallback(() => {
    navigation.navigate('TestViewScreen', {
      contentId: rest?._id,
      title: rest?.title,
    });
  }, [navigation, rest?._id, rest?.title]);

  const duration = useMemo(() => {
    const hour = dayjs.duration(rest?.media?.duration).hours();
    const minute = dayjs.duration(rest?.media?.duration).minutes();
    if (hour && minute) {
      return `${hour}H ${minute}M`;
    }
    if (hour) {
      return `${hour} Hours`;
    }
    if (minute) {
      return `${minute} Minutes`;
    }
    return '';
  }, [rest?.media?.duration]);

  const info = useMemo(() => {
    const infoArr = [];
    if (rest?.media?.questions) {
      infoArr.push(`${rest?.media?.questions} Ques`);
    }
    if (duration) {
      infoArr.push(`${duration}`);
    }
    if (rest?.views) {
      infoArr.push(`${rest?.views} Attempts`);
    }
    return infoArr.join(' | ');
  }, [rest, duration]);

  return (
    <Pressable onPress={handleNavigation}>
      <View
        style={tw`bg-gray-50 rounded-lg shadow-sm w-[${width}px] opacity-${
          rest?.visible ? 100 : 50
        }`}>
        <ImageBackground
          resizeMode="cover"
          source={{uri: rest?.image}}
          imageStyle={tw`rounded-lg opacity-50`}
          style={tw`rounded-lg items-center shadow-sm bg-white w-[${width}px]`}>
          <Image
            source={{uri: rest?.image}}
            resizeMode="cover"
            style={tw.style({
              width,
              borderRadius: 8,
              aspectRatio: 1 / 1,
            })}
          />
        </ImageBackground>
        <View style={tw`h-[130px] px-2 py-3 justify-between`}>
          <View style={tw`flex-row justify-between`}>
            <Text
              style={tw`flex-1 font-avSemi text-amber-700 capitalize text-[10px]`}
              numberOfLines={1}>
              {rest?.subject}
            </Text>
            {!!rest?.offer && (
              <Text style={tw`font-avSemi text-red-500 text-[10px]`}>
                {`${rest?.offer}${
                  rest?.offerType === 'PERCENT' ? '%' : '₹'
                } Off`}
              </Text>
            )}
          </View>
          <Text
            style={tw`font-avSemi text-xs text-gray-600 capitalize`}
            numberOfLines={2}>
            {rest?.title}
          </Text>
          <Text
            style={tw.style('font-avReg text-gray-500 text-[10px]')}
            numberOfLines={1}>
            {info}
          </Text>
          {rest?.paid && !rest?.purchased ? (
            <View style={tw`flex-row items-center justify-between`}>
              <Text
                style={tw`font-avSemi rounded text-xs px-2 bg-amber-100 text-amber-600 shadow-sm`}>
                {rest?.offer
                  ? `₹ ${
                      rest?.price -
                      (rest?.offerType === 'PERCENT'
                        ? (rest?.price * rest?.offer) / 100
                        : rest?.offer)
                    }`
                  : `₹ ${rest?.price}`}
              </Text>
              {!!rest?.offer && (
                <Text
                  style={tw.style('px-1 font-avReg text-gray-500 text-[10px]', {
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                  })}>
                  {`₹ ${rest?.price}`}
                </Text>
              )}
            </View>
          ) : (
            <View style={tw`self-start`}>
              <Text
                style={tw`font-avSemi rounded px-2 py-1 bg-amber-50 text-amber-600 shadow-sm text-[10px]`}>
                {`Attempt ${rest?.purchased ? '' : 'Free '}➔`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

export default TestItem;
