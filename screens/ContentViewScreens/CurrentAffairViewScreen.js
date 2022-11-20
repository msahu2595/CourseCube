import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import {ARTICLE} from '@queries';
import {useQuery} from '@apollo/client';
import {SafeAreaContainer} from '@components';
import React, {useCallback, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  Image,
  Share,
  Linking,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';

const CurrentAffairViewScreen = ({route}) => {
  const {width} = useWindowDimensions();

  const [size, setSize] = useState(1);
  const [bookmark, setBookmark] = useState(false);

  const {loading: queryLoading, data: queryData} = useQuery(ARTICLE, {
    variables: {articleId: route?.params?.articleId},
  });

  const data = queryData?.article?.payload;

  const handleSize = useCallback(() => {
    switch (size) {
      case 0:
        setSize(1);
        break;
      case 1:
        setSize(2);
        break;
      case 2:
        setSize(0);
        break;
      default:
        break;
    }
  }, [size]);

  const handleShare = useCallback(() => {
    Share.share(
      Platform.select({
        ios: {
          title: data?.title,
          message: `Via - Lakshya PSC Academy\n\nhttps://appdistribution.firebase.google.com/testerapps/1:712761607011:android:571029fa68837ace4a4956`,
        },
        android: {
          dialogTitle: data?.title,
          message: `${data?.title}\n\nVia - Lakshya PSC Academy\n\nhttps://appdistribution.firebase.google.com/testerapps/1:712761607011:android:571029fa68837ace4a4956`,
        },
      }),
    );
  }, [data?.title]);

  const handleBookmark = useCallback(() => {
    setBookmark(!bookmark);
  }, [bookmark]);

  const handleSource = useCallback(async source => {
    const supported = await Linking.canOpenURL(source);
    if (supported) {
      await Linking.openURL(source);
    }
  }, []);

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('white')}
      statusBarStyle="dark-content">
      <LinearGradient
        locations={[0, 0.5, 1]}
        colors={[tw.color('white'), tw.color('white'), tw.color('white')]}
        style={tw`flex-1`}>
        <ScrollView contentContainerStyle={tw`px-4 pt-4 pb-8`}>
          {!!data && (
            <>
              <Image
                source={{uri: data?.image}}
                resizeMode="cover"
                style={tw.style(
                  'shadow',
                  'rounded-lg',
                  'bg-black',
                  'justify-between',
                  {
                    width: width - 32,
                    height: undefined,
                    aspectRatio: 16 / 9,
                  },
                )}
              />
              <View style={tw`py-2 border-b border-gray-400`}>
                <Text
                  style={tw`py-1 font-avBold text-gray-600 text-${
                    size ? (size < 2 ? 'lg' : 'xl') : 'base'
                  }`}
                  numberOfLines={3}>
                  {data?.title}
                </Text>
                <View style={tw`py-2 flex-row items-center justify-between`}>
                  <View>
                    <Text
                      style={tw`font-avSemi text-gray-600 text-${
                        size ? (size < 2 ? 'xs' : 'sm') : 'xs'
                      }`}>
                      {dayjs(parseInt(data?.createdAt, 10)).format(
                        'DD MMM, YYYY',
                      )}
                    </Text>
                    <Text
                      style={tw`font-avSemi text-gray-600 text-${
                        size ? (size < 2 ? 'xs' : 'sm') : 'xs'
                      } capitalize`}>
                      {`By ${data?.author}`}
                    </Text>
                  </View>
                  <View style={tw`flex-row`}>
                    <TouchableOpacity onPress={handleBookmark}>
                      <FontAwesome
                        name={bookmark ? 'bookmark' : 'bookmark-o'}
                        color={tw.color('gray-600')}
                        size={24}
                        style={tw`ml-2`}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare}>
                      <Feather
                        name="share-2"
                        color={tw.color('gray-600')}
                        size={24}
                        style={tw`ml-2`}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSize}>
                      <Feather
                        name="type"
                        color={tw.color('gray-600')}
                        size={24}
                        style={tw`ml-2`}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={tw`py-4`}>
                <Text
                  style={tw`font-avReg text-gray-600 text-${
                    size ? (size < 2 ? 'base' : 'lg') : 'sm'
                  } leading-7 tracking-wider`}>
                  {`${data?.description}`}
                </Text>
              </View>
              {!!data?.sources?.length && (
                <View>
                  <Text
                    style={tw`font-avSemi text-gray-600 text-${
                      size ? (size < 2 ? 'lg' : 'xl') : 'base'
                    } capitalize`}>
                    {`${data?.sources?.length > 1 ? 'Sources' : 'Source'} :`}
                  </Text>
                  {data?.sources?.map((s, i) => (
                    <TouchableOpacity
                      key={`SOURCE_${i}`}
                      style={tw`flex-row items-center`}
                      onPress={() => handleSource(s)}>
                      <Feather
                        size={14}
                        name="link"
                        style={tw`mr-2`}
                        color={tw.color('blue-600')}
                      />
                      <Text
                        style={tw`pt-2 font-avSemi text-blue-600 text-${
                          size ? (size < 2 ? 'xs' : 'sm') : 'xs'
                        } tracking-wider`}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default CurrentAffairViewScreen;
