/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
import {useQuery} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '@lib/tailwind';
import {DOCUMENTS} from '@queries';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdminDocumentListScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [search, setSearch] = useState('');

  const {loading, error, data, refetch, fetchMore} = useQuery(DOCUMENTS, {
    variables: {offset: 0},
  });
  console.log(data?.documents?.payload, error, loading);

  const width = Dimensions.get('window').width;
  // console.log(width);
  const Item = useCallback(
    ({item}) => (
      <View style={tw.style(` rounded-lg bg-gray-200`, {width: width / 2 - 8})}>
        <ImageBackground
          source={{
            uri: item?.thumbnail,
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
    <View style={tw`flex-1`}>
      <View style={tw`flex-row`}>
        <View
          style={tw`flex-1 flex-row m-2 justify-between rounded-lg px-2 items-center border`}>
          <TextInput
            placeholder="Search"
            onChangeText={text => {
              console.log('text', text);
              setSearch(text);
              if (text.length > 2) {
                refetch({search: text});
              } else {
                refetch({search: ''});
              }
            }}
            value={search}
          />

          <TouchableOpacity
            onPress={() => {
              setSearch('');
              refetch({search: ''});
            }}>
            <MaterialIcons name="clear" size={20} color={tw.color('black')} />
          </TouchableOpacity>
        </View>

        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={value => {
            setIsEnabled(value);
            refetch({filter: {enable: !value}});
          }}
          value={isEnabled}
        />
      </View>

      <FlatList
        bounces={true}
        data={data?.documents?.payload}
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
              offset: data?.documents?.payload.length,
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

export default AdminDocumentListScreen;
