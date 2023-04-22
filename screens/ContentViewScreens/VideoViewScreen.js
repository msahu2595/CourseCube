import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import tw from '@lib/tailwind';
import {CONTENT} from '@queries';
import {useQuery} from '@apollo/client';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {InfoItem, SafeAreaContainer, VideoPlayer} from '@components';
import {CCIcon, CCLikeButton, CCBookmarkButton} from 'components/Common';

const VideoViewScreen = ({route}) => {
  const {width, height} = useWindowDimensions();

  const {loading: queryLoading, data: queryData} = useQuery(CONTENT, {
    variables: {contentId: route?.params?.contentId},
  });

  const data = queryData?.content?.payload || {};

  return (
    <SafeAreaContainer style={tw`bg-black`}>
      {queryLoading ? (
        <View
          style={tw.style('bg-black', {
            width: width < height ? width : (height * 16) / 9,
            height: height < width ? height : (width * 9) / 16,
          })}
        />
      ) : (
        <VideoPlayer link={data?.media?.link} />
      )}
      <LinearGradient
        locations={[0, 0.2, 0.5]}
        colors={[
          tw.color('indigo-200'),
          tw.color('indigo-50'),
          tw.color('white'),
        ]}
        style={tw`flex-1`}>
        <View style={tw`px-4 py-2`}>
          <Text
            style={tw`font-avSemi text-indigo-700 capitalize text-[10px]`}
            numberOfLines={1}>
            {data?.subject}
          </Text>
          <Text
            style={tw`py-1 font-avSemi text-base text-gray-600`}
            numberOfLines={2}>
            {data?.title}
          </Text>
          <Text style={tw`font-avReg text-xs text-amber-600`} numberOfLines={1}>
            #CGPSE #ACS #SSC #Mains
          </Text>
          <Text
            style={tw.style('font-avReg', 'text-gray-600', 'text-sm', {
              fontSize: 10,
            })}
            numberOfLines={1}>
            {`${data?.media?.time} Mins | ${data?.likes} Likes | 50k Watched`}
          </Text>
        </View>
        <View
          style={tw`flex-row justify-around border-t border-b border-indigo-200 px-2`}>
          <CCLikeButton
            refId={data?._id}
            initial={data?.liked === 1 ? true : false}>
            {liked => (
              <CCIcon
                icon={liked ? 'like1' : 'like2'}
                label={liked ? 'Liked' : 'Like'}
              />
            )}
          </CCLikeButton>
          <CCBookmarkButton
            refId={data?._id}
            type={data?.__typename}
            subType={data?.media?.__typename}
            initial={data?.bookmarked === 1 ? true : false}>
            {bookmarked => (
              <CCIcon
                icon={bookmarked ? 'bookmark' : 'bookmark-o'}
                label={bookmarked ? 'Bookmarked' : 'Bookmark'}
                IconComponent={FontAwesome}
              />
            )}
          </CCBookmarkButton>
          <TouchableOpacity>
            <CCIcon icon="sharealt" label="Share" />
          </TouchableOpacity>
          <TouchableOpacity>
            <CCIcon icon="questioncircleo" label="Doubts" />
          </TouchableOpacity>
          <TouchableOpacity>
            <CCIcon icon="download" label="Download" />
          </TouchableOpacity>
        </View>
        <ScrollView style={tw`flex-1`}>
          <InfoItem label="Highlight" value={data?.highlight} />
          <InfoItem
            inline
            label="Language"
            value={data?.language === 'HI' ? 'हिन्दी' : 'English'}
          />
          <InfoItem label="Instructors" value={data?.instructors?.join(', ')} />
          <InfoItem label="Index" value={data?.index} />
          <InfoItem label="Description" value={data?.description} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default VideoViewScreen;
