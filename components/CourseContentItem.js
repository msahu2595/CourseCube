import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import config from 'react-native-ultimate-config';
import {useNavigation} from '@react-navigation/core';
import React, {memo, useCallback, useMemo} from 'react';
import {View, Image, Text, Pressable, ImageBackground} from 'react-native';

const CourseContentItem = memo(props => {
  const navigation = useNavigation();

  const info = useMemo(() => {
    const infoArr = [];
    switch (props?.type) {
      case 'Video':
        if (props?.media?.time) {
          infoArr.push(`${props?.media?.time} Mins`);
        }
        if (props?.likes) {
          infoArr.push(`${props?.likes} Likes`);
        }
        if (props?.views) {
          infoArr.push(`${props?.views} Watches`);
        }
        break;
      case 'Test':
        if (props?.media?.questions) {
          infoArr.push(`${props?.media?.questions} Ques`);
        }
        if (props?.media?.duration) {
          const hour = dayjs.duration(props?.media?.duration).hours();
          const minute = dayjs.duration(props?.media?.duration).minutes();
          if (hour && minute) {
            infoArr.push(`${hour}H ${minute}M`);
          }
          if (hour) {
            infoArr.push(`${hour} Hours`);
          }
          if (minute) {
            infoArr.push(`${minute} Minutes`);
          }
        }
        if (props?.views) {
          infoArr.push(`${props?.views} Attempts`);
        }
        break;
      case 'Document':
        if (props?.media?.pages) {
          infoArr.push(`${props?.media?.pages} Pages`);
        }
        if (props?.likes) {
          infoArr.push(`${props?.likes} Likes`);
        }
        if (props?.views) {
          infoArr.push(`${props?.views} Reads`);
        }
        break;
      default:
        break;
    }
    return infoArr.join(' | ');
  }, [props]);

  const handleNavigation = useCallback(() => {
    switch (props?.type) {
      case 'Video':
        navigation.navigate('CourseVideoViewScreen', {
          bundleContentId: props?._id,
          title: props?.title,
        });
        break;
      case 'Test':
        navigation.navigate('CourseTestViewScreen', {
          bundleContentId: props?._id,
          title: props?.title,
        });
        break;
      case 'Document':
        navigation.navigate('CourseDocumentViewScreen', {
          bundleContentId: props?._id,
          title: props?.title,
        });
        break;
      default:
        break;
    }
  }, [navigation, props?._id, props?.title, props?.type]);

  return (
    <Pressable onPress={handleNavigation}>
      <View
        style={tw`flex-row bg-gray-50 rounded-lg shadow-sm opacity-${
          props?.visible ? 100 : 50
        }`}>
        <ImageBackground
          resizeMode="cover"
          source={{
            uri: `${
              __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
            }/${props?.image}`,
          }}
          imageStyle={tw`rounded-lg opacity-50`}
          style={tw`rounded-lg items-center shadow-sm bg-black h-[96px]`}>
          <Image
            source={{
              uri: `${
                __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
              }/${props?.image}`,
            }}
            resizeMode="contain"
            style={tw.style({
              height: 96,
              borderRadius: 8,
              aspectRatio: 16 / 9,
            })}
          />
        </ImageBackground>
        <View style={tw`flex-1 px-2 py-3 justify-between`}>
          <Text
            style={tw`font-avSemi text-indigo-700 text-[10px]`}
            numberOfLines={1}>
            {props?.subject}
          </Text>
          <Text style={tw`font-avSemi text-xs text-gray-600`} numberOfLines={2}>
            {props?.title}
          </Text>
          <Text
            style={tw`font-avReg text-gray-500 text-[10px]`}
            numberOfLines={1}>
            {info}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});

export default CourseContentItem;
