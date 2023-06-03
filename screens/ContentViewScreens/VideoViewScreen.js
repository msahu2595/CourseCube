import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import tw from '@lib/tailwind';
import {CONTENT} from '@queries';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import {gql, useMutation, useQuery} from '@apollo/client';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {InfoItem, SafeAreaContainer, VideoPlayer} from '@components';
import {CCIcon, CCLikeButton, CCBookmarkButton} from 'components/Common';

const ADD_VIEW = gql`
  mutation addView($refId: ID!) {
    addView(refId: $refId) {
      code
      success
      message
      token
    }
  }
`;

const VideoViewScreen = ({route}) => {
  const {width, height} = useWindowDimensions();

  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(CONTENT, {
    variables: {contentId: route?.params?.contentId},
  });

  const data = queryData?.content?.payload || {};

  const [addView] = useMutation(ADD_VIEW, {
    variables: {refId: data?._id},
    onCompleted: res => {
      console.log('addView', res);
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  if (queryError) {
    return (
      <SafeAreaContainer style={tw`justify-center items-center`}>
        <Text style={tw`text-black align-center`}>
          Unexpected error happened, Please try again!
        </Text>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer style={tw`bg-black`}>
      {queryLoading ? (
        <View
          style={tw.style('bg-black justify-center', {
            width: width < height ? width : (height * 16) / 9,
            height: height < width ? height : (width * 9) / 16,
          })}>
          <ActivityIndicator size="large" color={tw.color('white')} />
        </View>
      ) : (
        <VideoPlayer link={data?.media?.link} onVideoStart={addView} />
      )}
      <LinearGradient
        locations={[0, 0.2, 0.5]}
        colors={[
          tw.color('indigo-200'),
          tw.color('indigo-50'),
          tw.color('white'),
        ]}
        style={tw`flex-1`}>
        {queryLoading ? (
          <View style={tw`flex-1 justify-center`}>
            <ActivityIndicator size="large" color={tw.color('indigo-600')} />
          </View>
        ) : (
          <>
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
              <Text
                style={tw`font-avReg text-xs text-amber-600`}
                numberOfLines={1}>
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
                initial={data?.liked === 1 ? true : false}
                refetchQueries={[
                  {query: CONTENT, variables: {contentId: data?._id}},
                ]}>
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
                initial={data?.bookmarked === 1 ? true : false}
                refetchQueries={[
                  {query: CONTENT, variables: {contentId: data?._id}},
                ]}>
                {bookmarked => (
                  <CCIcon
                    icon={bookmarked ? 'bookmark' : 'bookmark-o'}
                    label={bookmarked ? 'Bookmarked' : 'Bookmark'}
                    IconComponent={FontAwesome}
                  />
                )}
              </CCBookmarkButton>
              <TouchableOpacity>
                <CCIcon icon="download" label="Download" />
              </TouchableOpacity>
              <TouchableOpacity>
                <CCIcon icon="questioncircleo" label="Doubts" />
              </TouchableOpacity>
              <TouchableOpacity>
                <CCIcon icon="sharealt" label="Share" />
              </TouchableOpacity>
            </View>
            <ScrollView style={tw`flex-1`}>
              <InfoItem label="Highlight" value={data?.highlight} />
              <InfoItem
                inline
                label="Language"
                value={data?.language === 'HI' ? 'हिन्दी' : 'English'}
              />
              <InfoItem
                label="Instructors"
                value={data?.instructors?.join(', ')}
              />
              <InfoItem label="Index" value={data?.index} />
              <InfoItem label="Description" value={data?.description} />
            </ScrollView>
          </>
        )}
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default VideoViewScreen;
