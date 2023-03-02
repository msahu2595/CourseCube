import tw from 'twrnc';
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {CONTENTS} from '@queries';
import {useQuery} from '@apollo/client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaContainer} from '@components';

const Separator = () => <View style={tw`h-2`} />;

const width = Dimensions.get('window').width;

const Item = props => {
  console.log(props);
  return (
    <View
      style={tw.style(`flex flex-col rounded-lg bg-white`, {
        width: width / 2 - 8,
      })}>
      <Image
        source={{
          uri: props.item.image,
        }}
        style={tw`h-44 rounded-lg`}
      />
      <View style={tw`h-24 flex justify-between p-2`}>
        <Text style={tw`text-xs font-bold text-red-700`}>
          {props.item.subject}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={tw`text-[14px] font-bold text-black`}>
          {props.item.title}
        </Text>
        <View>
          <Text style={tw`text-[10px]`}>
            {props.item.likes} likes | 180 attempts
          </Text>
        </View>
        <View style={tw`flex-row px-1 pb-1 flex justify-between `}>
          <Text
            style={tw`text-[10px] shadow bg-orange-200 text-red-700 rounded-sm`}>
            ${props.item.price}
          </Text>

          <Text style={tw`text-[10px]`}>{props.item.offer}%off</Text>
        </View>
      </View>
    </View>
  );
};

function AdminContentTestListScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [search, setSearch] = useState('');

  const {loading, error, data, refetch, fetchMore} = useQuery(CONTENTS, {
    variables: {
      filter: {
        type: 'Test',
      },
    },
  });

  console.log(data);

  if (loading) return null;
  if (error) return <Text>Error: {error.message}</Text>;
  return (
    <SafeAreaContainer>
      <View style={tw`flex-row m-2`}>
        <View style={tw`flex-1 flex-row items-center border rounded-lg`}>
          <TextInput
            placeholder="Enter name to search"
            style={tw`flex-1`}
            value={search}
            onChangeText={text => {
              setSearch(text);
              if (text.length > 2) {
                refetch({search: text});
              } else {
                refetch({search: ''});
              }
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setSearch('');
              refetch({search: ''});
            }}>
            <MaterialCommunityIcons name="clear" size={25} style={tw`p-1`} />
          </TouchableOpacity>
        </View>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={value => {
            setIsEnabled(value);
            refetch({filter: {type: 'Test', enable: !value}});
          }}
          value={isEnabled}
        />
      </View>
      <FlatList
        data={data?.contents?.payload}
        renderItem={({item}) => <Item item={item} />}
        keyExtractor={item => item.id}
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
              offset: data?.contents?.payload.length,
              limit: 10,
            },
          })
        }
      />
    </SafeAreaContainer>
  );
}

export default AdminContentTestListScreen;
