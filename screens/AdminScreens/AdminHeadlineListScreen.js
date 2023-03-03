import tw from '@lib/tailwind';
import {HEADLINES} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {FlatList, Text, View} from 'react-native';
import {NotificationItem, SafeAreaContainer} from '@components';

const Separator = () => <View style={tw`h-2`} />;

const AdminHeadlineListScreen = () => {
  const {loading, error, data, refetch, fetchMore} = useQuery(HEADLINES);

  const renderItem = useCallback(
    ({item, index}) => <NotificationItem index={index} {...item} />,
    [],
  );

  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <SafeAreaContainer>
      <Text>AdminHeadlineListScreen</Text>
      <FlatList
        data={data?.headlines?.payload}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={Separator}
        horizontal={false}
        numColumns={2}
        columnWrapperStyle={tw`justify-between`}
        contentContainerStyle={tw`p-1`}
        refreshing={loading}
        onRefresh={refetch}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.headlines?.payload.length,
              limit: 10,
            },
          })
        }
      />
    </SafeAreaContainer>
  );
};

export default AdminHeadlineListScreen;
