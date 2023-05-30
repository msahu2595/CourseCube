import tw from '@lib/tailwind';
import {ContentItem} from '@components';
import React, {useCallback} from 'react';
import {gql, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {View, FlatList, RefreshControl, Text} from 'react-native';

const BOOKMARKS = gql`
  query bookmarks($limit: Int, $offset: Int, $filter: BookmarksFilterInput) {
    bookmarks(limit: $limit, offset: $offset, filter: $filter) {
      code
      success
      message
      token
      limit
      offset
      filter {
        type
        subType
      }
      payload {
        __typename
        _id
        ref {
          ... on Content {
            __typename
            _id
            subject
            image
            title
            type
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

const BookmarkContentScreen = ({navigation}) => {
  const {loading, data, refetch, fetchMore} = useQuery(BOOKMARKS, {
    variables: {filter: {type: 'Content'}},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const handlePress = useCallback(
    ({contentId, contentTitle, contentType, contentSubType}) => {
      switch (contentType) {
        case 'Content':
          switch (contentSubType) {
            case 'Video':
              navigation.navigate('VideoViewScreen', {contentId});
              break;
            case 'Test':
              navigation.navigate('TestViewScreen', {
                contentId,
                title: contentTitle,
              });
              break;
            case 'Document':
              navigation.navigate('DocumentViewScreen', {
                contentId,
                title: contentTitle,
              });
              break;
            default:
              break;
          }
          break;
        case 'BundleContent':
          switch (contentSubType) {
            case 'Video':
              navigation.navigate('CourseVideoViewScreen', {
                bundleContentId: contentId,
              });
              break;
            case 'Test':
              navigation.navigate('CourseTestViewScreen', {
                bundleContentId: contentId,
                title: contentTitle,
              });
              break;
            case 'Document':
              navigation.navigate('CourseDocumentViewScreen', {
                bundleContentId: contentId,
                title: contentTitle,
              });
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    },
    [navigation],
  );

  const _renderItem = useCallback(
    ({item}) => (
      <ContentItem
        {...item?.ref}
        createdAt={item?.createdAt}
        onPress={handlePress}
      />
    ),
    [handlePress],
  );

  return (
    <>
      <FlatList
        bounces={true}
        //
        data={data?.bookmarks?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`p-2 pb-4`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        ListEmptyComponent={
          loading
            ? null
            : () => (
                <Text style={tw`font-avReg text-[14px] text-black text-center`}>
                  Nothing bookmarked yet.
                </Text>
              )
        }
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.bookmarks?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </>
  );
};

export default BookmarkContentScreen;
