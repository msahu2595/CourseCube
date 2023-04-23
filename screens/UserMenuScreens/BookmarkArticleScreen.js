import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {gql, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {View, FlatList, RefreshControl} from 'react-native';
import {CurrentAffairItem, SafeAreaContainer} from '@components';

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
          ... on Article {
            __typename
            _id
            subject
            tags
            image
            title
            description
            author
            sources
            visible
            enable
            createdAt
            updatedAt
            likes
          }
        }
      }
    }
  }
`;

const BookmarkArticleScreen = () => {
  const {loading, data, refetch, fetchMore} = useQuery(BOOKMARKS, {
    variables: {filter: {type: 'Article'}},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const _renderItem = useCallback(
    ({item}) => <CurrentAffairItem {...item?.ref} />,
    [],
  );

  return (
    <SafeAreaContainer>
      <FlatList
        bounces={true}
        //
        data={data?.bookmarks?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`py-2 pb-4`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
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
    </SafeAreaContainer>
  );
};

export default BookmarkArticleScreen;
