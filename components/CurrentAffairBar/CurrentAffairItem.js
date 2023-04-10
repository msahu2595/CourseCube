import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback} from 'react';
import tw from '@lib/tailwind';
import dayjs from 'dayjs';
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';

const CurrentAffairItem = memo(({_id, image, title, createdAt}) => {
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
          source={{uri: image}}
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
          <Text
            style={tw`self-end text-right px-2 py-1 font-avReg text-gray-100 text-xs bg-black bg-opacity-10 rounded-bl-lg rounded-tr-lg`}
            numberOfLines={3}>
            {dayjs(parseInt(createdAt, 10)).format('DD MMM')}
          </Text>
          <View>
            <Text
              style={tw.style('px-3 py-1 font-avSemi text-gray-100', {
                fontSize: 12,
              })}
              numberOfLines={1}>
              {'• National Affairs'}
            </Text>
            <Text
              style={tw`px-3 py-2 font-avReg text-gray-100 text-sm bg-black bg-opacity-50 rounded-b-lg`}
              numberOfLines={2}>
              {title}
            </Text>
          </View>
        </ImageBackground>
      </Pressable>
    </View>
  );
});

export default CurrentAffairItem;
