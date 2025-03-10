import {
  Text,
  View,
  Pressable,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import React, {memo, useCallback} from 'react';
import config from 'react-native-ultimate-config';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CurrentAffairItem = memo(
  ({_id, likes, subject, image, title, createdAt}) => {
    const navigation = useNavigation();

    const width = useWindowDimensions().width;

    const handlePress = useCallback(() => {
      navigation.navigate('CurrentAffairViewScreen', {
        title,
        articleId: _id,
      });
    }, [navigation, title, _id]);

    return (
      <View style={tw.style('items-center', {width})}>
        <Pressable onPress={handlePress}>
          <ImageBackground
            source={{
              uri: `${
                __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
              }/${image}`,
            }}
            resizeMode="cover"
            imageStyle={tw`rounded-lg`}
            style={tw.style(
              'shadow',
              'rounded-lg',
              'bg-black',
              'justify-between',
              {
                width: width - 16,
                height: undefined,
                aspectRatio: 16 / 9,
              },
            )}>
            <View style={tw`flex-row justify-between`}>
              <View
                style={tw`items-center px-2 py-1 bg-black bg-opacity-50 rounded-br-lg rounded-tl-lg`}>
                <Text style={tw`font-avReg text-gray-100 text-xs`}>
                  {dayjs(parseInt(createdAt, 10)).format('DD MMM')}
                </Text>
              </View>
              {!!likes && (
                <View
                  style={tw`items-center flex-row px-2 py-1 bg-black bg-opacity-50 rounded-bl-lg rounded-tr-lg`}>
                  <Text style={tw`font-avReg text-gray-100 text-xs`}>
                    {likes}
                  </Text>
                  <FontAwesome
                    name="heart"
                    style={tw`ml-1`}
                    color={tw.color('gray-100')}
                  />
                </View>
              )}
            </View>
            <View style={tw`py-2 bg-black bg-opacity-75 rounded-b-lg`}>
              <Text
                style={tw`px-3 font-avSemi text-gray-100 text-[12px]`}
                numberOfLines={1}>
                {`• ${subject}`}
              </Text>
              <Text
                style={tw`m-1 px-3 font-avReg text-gray-100 text-sm`}
                numberOfLines={2}>
                {title}
              </Text>
            </View>
          </ImageBackground>
        </Pressable>
      </View>
    );
  },
);

export default CurrentAffairItem;
