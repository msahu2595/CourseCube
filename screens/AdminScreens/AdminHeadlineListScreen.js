import tw from '@lib/tailwind';
import {HEADLINES} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback, useRef} from 'react';
import {NotificationItem, SafeAreaContainer} from '@components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Separator = () => <View style={tw`h-2`} />;

const AdminHeadlineListScreen = () => {
  const searchInputRef = useRef(null);
  const {loading, error, data, refetch, fetchMore} = useQuery(HEADLINES);

  const renderItem = useCallback(
    ({item, index}) => <NotificationItem index={index} {...item} />,
    [],
  );

  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <SafeAreaContainer>
      <View style={tw`flex-row`}>
        <View style={tw`flex-1 flex-row border rounded-lg items-center m-2`}>
          <TextInput
            ref={searchInputRef}
            placeholder="Enter name to search"
            style={tw`flex-1`}
            onChangeText={text => {
              if (text.length > 2) {
                refetch({search: text});
              } else {
                refetch({search: ''});
              }
            }}
          />
          <TouchableOpacity
            onPress={() => {
              searchInputRef.current?.clear();
              refetch({search: ''});
            }}>
            <MaterialIcons
              name="clear"
              size={25}
              style={tw`p-1 items-center`}
            />
          </TouchableOpacity>
        </View>
        <MaterialCommunityIcons
          name="plus"
          size={25}
          style={tw`pt-5 pr-2 justify-center items-center`}
        />
      </View>
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
