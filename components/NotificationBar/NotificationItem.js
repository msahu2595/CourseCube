import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback} from 'react';
import tw from '@lib/tailwind';
import {
  View,
  Text,
  Linking,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
  Pressable,
} from 'react-native';

const NotificationItem = memo(({image, description, link}) => {
  const navigation = useNavigation();
  const width = useWindowDimensions().width;

  const handleSeeAll = useCallback(() => {
    navigation.navigate('NotificationListScreen');
  }, [navigation]);

  const handleLink = useCallback(async () => {
    const supported = await Linking.canOpenURL(link);
    if (supported) {
      await Linking.openURL(link);
    }
  }, [link]);

  return (
    <Pressable onPress={handleSeeAll}>
      <View style={tw.style({width})}>
        <View
          style={tw`mx-4 my-2 flex-row items-center bg-gray-50 shadow-sm rounded-lg`}>
          <ImageBackground
            resizeMode="cover"
            source={{uri: image}}
            style={tw.style('rounded-lg', 'shadow-sm', 'bg-white', {
              width: 92,
              height: 92,
            })}
            imageStyle={tw.style('rounded-lg')}
          />
          <Text
            style={tw`flex-1 mx-2 font-avReg text-gray-600 text-sm`}
            numberOfLines={4}>
            {description}
          </Text>
          {!!link && (
            <TouchableOpacity
              onPress={handleLink}
              style={tw.style('justify-center border-l border-gray-200', {
                height: 92,
              })}>
              <Text
                style={tw.style('font-avSemi text-gray-600 text-sm', {
                  transform: [{rotate: '270deg'}],
                })}>
                Link
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Pressable>
  );
});

export default NotificationItem;
