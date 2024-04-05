import {tw} from '@lib';
import React, {useCallback} from 'react';
import {useQuery, gql} from '@apollo/client';
import {SafeAreaContainer} from '@components';
import {showMessage} from 'react-native-flash-message';
import {FlatList, RefreshControl, Text, View} from 'react-native';

const NOTIFICATIONS = gql`
  query notifications(
    $offset: Int
    $limit: Int
    $filter: NotificationsFilterInput
  ) {
    notifications(offset: $offset, limit: $limit, filter: $filter) {
      code
      success
      message
      token
      offset
      limit
      filter {
        type
        read
      }
      payload {
        _id
        userId
        title
        body
        icon
        type
        alert
        route
        params
        read
        createdAt
        updatedAt
      }
    }
  }
`;

const NotificationScreen = ({route}) => {
  const {loading, data, refetch, fetchMore} = useQuery(NOTIFICATIONS, {
    variables: {filter: {type: route.params?.type || 'USER'}},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
    fetchPolicy: 'cache-and-network',
  });

  const _renderItem = useCallback(
    ({item}) => <NotificationItem {...item} />,
    [],
  );

  return (
    <SafeAreaContainer
      statusBgColor={tw.color(route.params?.themeColor || 'blue-600')}
      statusBarStyle="light-content">
      <FlatList
        bounces={true}
        //
        data={data?.notifications?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`py-2`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.notifications?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </SafeAreaContainer>
  );
};

export default NotificationScreen;

const NotificationItem = props => <Text>{props.title}</Text>;
