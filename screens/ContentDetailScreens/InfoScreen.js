import tw from '@lib/tailwind';
import {BUNDLE} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {SafeAreaContainer} from '@components';
import config from 'react-native-ultimate-config';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {CCLikeButton, CCShareButton, CCPurchaseButton} from 'components/Common';
import {View, Text, Image, ScrollView, useWindowDimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const InfoScreen = ({navigation, route}) => {
  const {width} = useWindowDimensions();

  const {loading: queryLoading, data: queryData} = useQuery(BUNDLE, {
    variables: {bundleId: route.params?.bundleId},
  });

  const data = queryData?.bundle?.payload || {};

  const navigateSyllabusScreen = useCallback(() => {
    navigation.navigate('CourseSyllabusScreen', {
      bundleId: route.params?.bundleId,
    });
  }, [navigation, route.params]);

  return (
    <SafeAreaContainer
      statusBgColor={tw.color(`${route.params?.themeColor || 'green'}-200`)}
      statusBarStyle="dark-content">
      <LinearGradient
        locations={[0, 0.2, 0.5]}
        colors={[
          tw.color(`${route.params?.themeColor || 'green'}-200`),
          tw.color(`${route.params?.themeColor || 'green'}-50`),
          tw.color('white'),
        ]}
        style={tw`flex-1`}>
        <ScrollView>
          <Image
            source={{
              uri: `${
                __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
              }/${data?.image}`,
            }}
            resizeMode="cover"
            style={tw.style('self-center', 'mt-4', {
              height: (width / 16) * 9 - 16,
              aspectRatio: 16 / 9,
              borderRadius: 10,
            })}
          />
          <View style={tw`p-4`}>
            <Text
              style={tw`font-avSemi text-lg text-gray-600`}
              numberOfLines={2}>
              {data?.title}
            </Text>
            <Text
              style={tw`font-avReg text-xs text-${
                route.params?.themeColor || 'green'
              }-600 py-2`}
              numberOfLines={1}>
              Videos + PDF's + Tests | 400+ Hours
            </Text>
            <View style={tw`py-2`}>
              <View style={tw`flex-row pb-2`}>
                <MaterialCommunityIcons
                  name="lightbulb-on-outline"
                  color="#58585B"
                  size={16}
                />
                <Text style={tw`font-avReg text-xs text-gray-500 px-2`}>
                  {data?.highlight || 'New Batch'}
                </Text>
              </View>
              <View style={tw`flex-row pb-2`}>
                <MaterialCommunityIcons
                  name="clipboard-check-outline"
                  color="#58585B"
                  size={16}
                />
                <Text style={tw`font-avReg text-xs text-gray-500 px-2`}>
                  {data?.subject}
                </Text>
              </View>
              <View style={tw`flex-row pb-2`}>
                <MaterialCommunityIcons
                  name="account-check-outline"
                  color="#58585B"
                  size={16}
                />
                <Text style={tw`font-avReg text-xs text-gray-500 px-2`}>
                  {data?.instructors?.reduce(
                    (prev, cur) => (prev ? `${prev}, ${cur}` : cur),
                    '',
                  )}
                </Text>
              </View>
            </View>
            <View style={tw`flex-row justify-between`}>
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
                {data?.language === 'HI' ? 'हिं' : 'EN'}
              </Text>
            </View>
          </View>
          <View style={tw`p-4 border-t border-gray-100`}>
            <Text style={tw`text-sm font-avSemi text-gray-600`}>INDEX :</Text>
            <Text
              style={tw`pt-2 text-xs leading-5 font-avSemi tracking-wider text-gray-500`}>
              {data?.index}
            </Text>
          </View>
          <View style={tw`p-4 border-t border-gray-100`}>
            <Text style={tw`text-sm font-avSemi text-gray-600`}>
              DESCRIPTION :
            </Text>
            <Text
              style={tw`pt-2 text-xs leading-5 font-avSemi tracking-wider text-gray-500`}>
              {data?.description}
            </Text>
          </View>
          <View style={tw.style({height: 72, width})} />
        </ScrollView>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={[
            tw.color(`${route.params?.themeColor || 'green'}-200`),
            tw.color('white'),
            tw.color(`${route.params?.themeColor || 'green'}-50`),
          ]}
          style={tw`absolute bottom-0 right-0 left-0 m-4 py-2 px-3 rounded-lg bg-gray-50 shadow-sm flex-row items-center justify-between`}>
          <CCLikeButton
            refId={data?._id}
            initial={data?.liked === 1 ? true : false}
            refetchQueries={[
              {query: BUNDLE, variables: {bundleId: data?._id}},
            ]}>
            {liked => (
              <AntDesign
                name={liked ? 'heart' : 'hearto'}
                size={20}
                color={tw.color(`${route.params?.themeColor || 'green'}-600`)}
                style={tw`p-2`}
              />
            )}
          </CCLikeButton>
          {data?.paid && !data?.purchased && (
            <>
              <View style={tw`items-center justify-between`}>
                <Text
                  style={tw`font-avSemi px-2 text-${
                    route.params?.themeColor || 'green'
                  }-600 text-sm`}>
                  {data?.offer
                    ? `₹ ${
                        data?.price -
                        (data?.offerType === 'PERCENT'
                          ? (data?.price * data?.offer) / 100
                          : data?.offer)
                      }`
                    : `₹ ${data?.price}`}
                </Text>
                {!!data?.offer && (
                  <Text
                    style={tw.style(
                      'font-avReg',
                      'px-2',
                      'text-gray-500',
                      'text-xs',
                      {
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                      },
                    )}>
                    {`₹ ${data?.price}`}
                  </Text>
                )}
              </View>
              {!!data?.offer && (
                <View style={tw`items-center`}>
                  <Text style={tw`font-avSemi text-xs text-red-500`}>
                    {`${data?.offer}${
                      data?.offerType === 'PERCENT' ? '%' : '₹'
                    }`}
                  </Text>
                  <Text style={tw`font-avSemi text-xs text-red-500`}>Off</Text>
                </View>
              )}
            </>
          )}
          {!queryLoading && (
            <CCPurchaseButton
              item={data}
              initial={data?.purchased === 1 ? true : false}
              onPurchased={navigateSyllabusScreen}
              refetchQueries={[
                {query: BUNDLE, variables: {bundleId: data?._id}},
              ]}>
              {purchased => (
                <View
                  style={tw`rounded mx-2 px-6 py-2 shadow-sm bg-${
                    route.params?.themeColor || 'green'
                  }-100`}>
                  <Text
                    style={tw`font-avSemi text-sm text-${
                      route.params?.themeColor || 'green'
                    }-600`}>
                    {purchased ? 'Continue  ➔' : 'Buy Now'}
                  </Text>
                </View>
              )}
            </CCPurchaseButton>
          )}
          <CCShareButton>
            <AntDesign
              name="sharealt"
              size={20}
              color={tw.color(`${route.params?.themeColor || 'green'}-600`)}
              style={tw`p-2`}
            />
          </CCShareButton>
        </LinearGradient>
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default InfoScreen;
