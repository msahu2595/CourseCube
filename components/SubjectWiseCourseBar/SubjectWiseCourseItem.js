import tw from '@lib/tailwind';
import React, {memo, useCallback} from 'react';
import config from 'react-native-ultimate-config';
import {useNavigation} from '@react-navigation/native';
import {View, Image, Text, Pressable} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SubjectWiseCourseItem = memo(({width = 272, ...rest}) => {
  const navigation = useNavigation();

  const handleNavigation = useCallback(() => {
    navigation.navigate('CourseDetailTopTabNavigator', {
      bundleId: rest._id,
      themeColor: 'orange',
    });
  }, [navigation, rest._id]);

  return (
    <Pressable onPress={handleNavigation}>
      <LinearGradient
        locations={[0, 0.5, 0.5]}
        colors={[
          tw.color('orange-200'),
          tw.color('orange-50'),
          tw.color('white'),
        ]}
        style={tw`rounded-lg shadow-sm px-3 pt-3 pb-4 w-[${width}px] opacity-${
          rest?.visible ? 100 : 50
        }`}>
        <Text style={tw`font-avSemi text-sm text-gray-600`} numberOfLines={2}>
          {rest?.title}
        </Text>
        <Text
          style={tw`font-avReg text-xs text-orange-600 py-2`}
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
        <Image
          source={{
            uri: `${
              __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
            }/${rest?.image}`,
          }}
          resizeMode="cover"
          style={tw.style('rounded-lg my-2 self-center', {
            width: width - 16,
            aspectRatio: 16 / 9,
          })}
        />
        <View style={tw`w-full flex-row justify-between pt-3`}>
          <View style={tw`flex-row items-center justify-between`}>
            {rest?.paid && !rest?.purchased ? (
              <>
                <Text
                  style={tw`font-avSemi rounded px-2 bg-orange-100 text-orange-600 shadow-sm`}>
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
                style={tw`font-avSemi rounded px-2 py-1 bg-orange-50 text-orange-600 shadow-sm text-[10px]`}>
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
            color={tw.color('orange-600')}
            size={16}
          />
          <Text style={tw`px-2 font-avSemi text-xs text-orange-600`}>
            View Course
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
});

export default SubjectWiseCourseItem;
