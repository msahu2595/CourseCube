/* eslint-disable quotes */
/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
import {useQuery} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '@lib/tailwind';
import {VIDEOS} from '@queries';

const AdminVideoListScreen = () => {
  const [filter, setFilter] = useState(false);
  const {loading, error, data, refetch, fetchMore} = useQuery(VIDEOS, {
    variables: {offset: 0},
  });
  console.log(data, error, loading);

  const width = Dimensions.get('window').width;
  // console.log(width);
  const Item = useCallback(
    ({item}) => (
      <View style={tw.style(` rounded-lg bg-gray-200`, {width: width / 2 - 8})}>
        <ImageBackground
          source={{
            uri: item.thumbnail,
          }}
          resizeMode="cover"
          style={tw`h-40  justify-between`}>
          <View style={tw` h-10 `}>
            <Text
              style={tw` self-end text-xs  text-white p-1 bg-black bg-opacity-40  rounded-bl-lg `}>
              {item.time}
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

  return (
    <View style={tw`flex justify-center  items-center`}>
      <View style={tw`flex flex-row  `}>
        <TextInput
          style={tw`h-10 border m-5 p-2  w-72 rounded-lg text-center`}
          placeholder="Search"
          onChangeText={text => {
            if (text.length > 2) {
              refetch({search: text});
            } else {
              refetch({offset: 0, limit: 10, search: ''});
            }
          }}
        />
        <TouchableOpacity>
          <Button
            title="Delete"
            style={tw`w-10 h-10 text-center pt-4 `}
            onPress={() => {
              console.log('heyyyyy');
              refetch({filter: {enable: false}});
            }}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        bounces={true}
        data={data?.videos?.payload}
        renderItem={({item}) => <Item item={item} />}
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle={tw`justify-between`}
        contentContainerStyle={tw`p-1`}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        onEndReached={() => {
          console.log('reached end');
          fetchMore({
            variables: {
              offset: data?.videos?.payload.length,
              limit: 10,
            },
          });
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
    </View>
  );
};

export default AdminVideoListScreen;
