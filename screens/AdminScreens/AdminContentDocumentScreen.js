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
import {useQuery, gql} from '@apollo/client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';

const Separator = () => <View style={tw`h-2`} />;

const GET_TEST = gql`
  query Contents($filter: ContentsFilterInput) {
    contents(filter: $filter) {
      payload {
        title
        type
        updatedAt
        price
        offer
        image
        createdAt
        _id
      }
    }
  }
`;

const width = Dimensions.get('window').width;

const Item = props => {
  console.log(props);
  return (
    <View
      style={tw.style('flex flex-col rounded-lg bg-white', {
        width: width / 2 - 8,
      })}>
      <Image
        source={{
          uri: props.item.image,
        }}
        style={tw`h-60 rounded-lg`}
      />
      <View style={tw`h-24 flex justify-between p-2`}>
        <Text style={tw`text-xs font-bold text-red-700`}>{props.title}</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={tw`text-[14px] font-bold text-black`}>
          {props.item.title}
        </Text>
        <View>
          <Text style={tw`text-[10px]`}>100 likes | 180 attempts</Text>
        </View>
        <Text style={tw`self-start p-[2px] text-xs rounded shadow bg-teal-200`}>
          Read Free →
        </Text>
      </View>
    </View>
  );
};

function AdminContentDocumentScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [search, setSearch] = useState('');

  const {loading, error, data, refetch, fetchMore} = useQuery(GET_TEST, {
    variables: {
      filter: {
        type: 'Document',
      },
    },
  });

  console.log(data);

  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  return (
    <View>
      <View style={tw`flex flex-row`}>
        <TextInput
          placeholder="Enter name to search"
          value={search}
          onChangeText={text => {
            setSearch(text);
            if (text.length > 2) {
              refetch({search: ''});
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
        data={data?.contents?.payload}
        renderItem={({item}) => <Item item={item} />}
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
              offset: data?.contents?.payload.length,
              limit: 10,
            },
          })
        }
      />
    </View>
  );
}

export default AdminContentDocumentScreen;
