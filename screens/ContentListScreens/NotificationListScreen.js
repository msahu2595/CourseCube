import tw from '@lib/tailwind';
import {HEADLINES} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {View, FlatList} from 'react-native';
import {NotificationItem, SafeAreaContainer} from '@components';

const NotificationListScreen = () => {
  const {loading: queryLoading, data: queryData} = useQuery(HEADLINES);

  const renderItem = useCallback(
    ({item, index}) => <NotificationItem index={index} {...item} />,
    [],
  );

  return (
    <SafeAreaContainer>
      <FlatList
        data={queryData?.headlines?.payload || []}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={tw`py-2`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
      />
    </SafeAreaContainer>
  );
};

export default NotificationListScreen;
