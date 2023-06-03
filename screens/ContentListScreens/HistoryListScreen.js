import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {gql, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {ContentItem, SafeAreaContainer} from '@components';
import {View, FlatList, RefreshControl, Text} from 'react-native';

const HISTORY = gql`
  query history($limit: Int, $offset: Int, $filter: HistoryFilterInput) {
    history(limit: $limit, offset: $offset, filter: $filter) {
      code
      success
      message
      token
      limit
      offset
      filter {
        userId
        type
        subType
      }
      payload {
        __typename
        _id
        ref {
          ... on BundleContent {
            __typename
            _id
            subject
            image
            title
            type
          }
          ... on Content {
            __typename
            _id
            subject
            title
            image
            type
          }
          ... on Article {
            __typename
            _id
            subject
            image
            title
          }
        }
        type
        subType
        visible
        createdAt
        updatedAt
      }
    }
  }
`;

const HistoryListScreen = ({
  navigation,
  route: {
    params: {headerTitle = 'History', ...filter},
  },
}) => {
  const {loading, data, refetch, fetchMore} = useQuery(HISTORY, {
    variables: {filter: filter},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    fetchPolicy: 'cache-and-network',
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
        case 'Article':
          navigation.navigate('CurrentAffairViewScreen', {
            articleId: contentId,
            title: contentTitle,
          });
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
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="dark-content">
      <FlatList
        bounces={true}
        //
        data={data?.history?.payload}
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
                  Nothing to show yet.
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
              offset: data?.history?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default HistoryListScreen;
