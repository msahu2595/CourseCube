import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {gql, useQuery} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {FollowItem, SafeAreaContainer} from '@components';
import {View, FlatList, Text, RefreshControl} from 'react-native';

const USERS = gql`
  query users(
    $offset: Int
    $limit: Int
    $search: String
    $filter: UsersFilterInput
  ) {
    users(offset: $offset, limit: $limit, search: $search, filter: $filter) {
      code
      success
      message
      token
      limit
      offset
      payload {
        __typename
        _id
        fullName
        gender
        picture
        userVerified
        role
        platform
        createdAt
        updatedAt
        followers
        activities
      }
    }
  }
`;

const AdminUserListScreen = () => {
  const {loading, data, refetch, fetchMore} = useQuery(USERS, {
    variables: {},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    fetchPolicy: 'cache-and-network',
  });

  const _renderItem = useCallback(
    ({item}) => <FollowItem {...item} isAdmin={true} />,
    [],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      <FlatList
        bounces={true}
        //
        data={data?.users?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`py-2`}
        ListFooterComponent={() => (
          <View style={tw`py-4 items-center`}>
            <Text style={tw`text-xs text-black font-avSemi`}>
              {loading ? 'Loading...' : "That's all, we have got!!"}
            </Text>
          </View>
        )}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.users?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default AdminUserListScreen;
