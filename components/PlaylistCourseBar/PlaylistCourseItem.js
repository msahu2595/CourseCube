import tw from '@lib/tailwind';
import React, {memo, useCallback} from 'react';
import config from 'react-native-ultimate-config';
import {useNavigation} from '@react-navigation/native';
import {View, Image, Text, Pressable} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PlaylistCourseItem = memo(({width = 256, ...rest}) => {
  const navigation = useNavigation();

  const handleNavigation = useCallback(() => {
    navigation.navigate('CourseDetailTopTabNavigator', {
      bundleId: rest._id,
      themeColor: 'rose',
    });
  }, [navigation, rest._id]);

  return (
    <Pressable onPress={handleNavigation}>
      <LinearGradient
        colors={['#fecdd3', '#fff1f2', '#FFF']}
        style={tw`rounded-lg shadow-sm px-3 pt-3 pb-4 w-[${width}px] opacity-${
          rest?.visible ? 100 : 50
        }`}>
        <Text style={tw`font-avSemi text-sm text-gray-600`} numberOfLines={2}>
          {rest?.title}
        </Text>
        <Text
          style={tw`font-avReg text-xs text-rose-600 py-2`}
          numberOfLines={1}>
          Videos + PDF's + Tests | 400+ Hours
        </Text>
        <View style={tw`py-2`}>
          <View style={tw`flex-row pb-2`}>
            <Icon name="lightbulb-on-outline" color="#58585B" size={16} />
            <Text style={tw`font-avReg text-xs text-gray-500 px-2`}>
              {rest?.highlight || 'New Batch'}
            </Text>
          </View>
          <View style={tw`flex-row pb-2`}>
            <Icon name="account-check-outline" color="#58585B" size={16} />
            <Text style={tw`font-avReg text-xs text-gray-500 px-2`}>
              {rest?.instructors.reduce(
                (prev, cur) => (prev ? `${prev}, ${cur}` : cur),
                '',
              )}
            </Text>
          </View>
        </View>
        <View
          style={tw.style('relative my-2 self-center', {
            width: width - 16,
            height: (width * 9) / 16,
          })}>
          <View
            style={tw.style(
              'absolute bg-white rounded-lg shadow-md bottom-0 right-0',
              {
                width: width - 32,
                aspectRatio: 16 / 9,
              },
            )}
          />
          <View
            style={tw.style(
              'absolute bg-white rounded-lg shadow-md bottom-2 right-2',
              {
                width: width - 32,
                aspectRatio: 16 / 9,
              },
            )}
          />
          <Image
            source={{
              uri: `${
                __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
              }/${rest?.image}`,
            }}
            resizeMode="cover"
            style={tw.style('absolute bg-white rounded-lg', {
              width: width - 32,
              aspectRatio: 16 / 9,
            })}
          />
        </View>
        <View style={tw`w-full flex-row justify-between pt-3`}>
          <View style={tw`flex-row items-center justify-between`}>
            {rest?.paid && !rest?.purchased ? (
              <>
                <Text
                  style={tw`font-avSemi rounded px-2 bg-rose-100 text-rose-600 shadow-sm`}>
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
                    {`₹ ${rest?.price}`}
                  </Text>
                )}
              </>
            ) : (
              <Text
                style={tw`font-avSemi rounded px-2 py-1 bg-rose-50 text-rose-600 shadow-sm text-[10px]`}>
                {`${
                  rest?.purchased ? 'Continue learning ' : 'Available for free '
                }➔`}
              </Text>
            )}
          </View>
          <Text style={tw`font-avSemi text-xs text-red-500`}>
            {!!rest?.offer
              ? `${rest?.offer}${rest?.offerType === 'PERCENT' ? '%' : '₹'} Off`
              : ''}
          </Text>
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
            {rest?.language === 'HI' ? 'हिं' : 'EN'}
          </Text>
        </View>
        <View style={tw`flex-row items-center self-center`}>
          <Icon
            name="play-box-multiple-outline"
            color={tw.color('rose-600')}
            size={16}
          />
          <Text style={tw`px-2 font-avSemi text-xs text-rose-600`}>
            View Course
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
});

export default PlaylistCourseItem;
