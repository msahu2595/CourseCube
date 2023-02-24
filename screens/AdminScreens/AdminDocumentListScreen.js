/* eslint-disable curly */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import tw from '@lib/tailwind';
import {DOCUMENTS} from '@queries';

const AdminDocumentListScreen = () => {
  const {loading, error, data, refetch} = useQuery(DOCUMENTS);
  console.log(data?.documents.payload);
  const width = Dimensions.get('window').width;

  const Item = useCallback(
    ({item}) => (
      <View style={tw.style(` rounded-lg bg-gray-200`, {width: width / 2 - 8})}>
        <ImageBackground
          source={{
            uri: item.thumbnail,
          }}
          resizeMode="cover"
          style={tw`h-40 justify-between`}>
          <View style={tw` h-10 `}>
            <Text
              style={tw` self-end text-xs  text-white p-1 bg-black bg-opacity-40  rounded-bl-lg `}>
              {item.pages}
            </Text>
          </View>
          <View
            style={tw`bg-black bg-opacity-50 text-white p-1 h-10 justify-center`}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`text-xs px-1 text-white`}>
              {item.title}
            </Text>
          </View>
        </ImageBackground>
      </View>
    ),
    [],
  );

  if (loading) return <Text>'Loading...'</Text>;
  if (error) return <Text>`Error! ${error.message}`</Text>;

  return (
    <View>
      <FlatList
        data={data?.documents?.payload}
        renderItem={({item}) => <Item item={item} />}
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle={tw`justify-between`}
        contentContainerStyle={tw`p-1`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
    </View>
  );
};

export default AdminDocumentListScreen;
