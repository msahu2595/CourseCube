import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {FlatList, Text, View} from 'react-native';
import tw from '@lib/tailwind';
import {TESTS} from 'apollo/queries/TESTS';

const AdminTestListScreen = () => {
  const {loading, error, data} = useQuery(TESTS);
  console.log(data?.tests.payload);

  const Item = useCallback(
    ({item}) => (
      <View style={tw`flex-row bg-white mb-3 mx-3 rounded-lg`}>
        <Text style={tw`text-sm font-bold`}>{item.title}</Text>
      </View>
    ),
    [],
  );

  if (loading) return <Text>'Loading...'</Text>;
  if (error) return <Text>`Error! ${error.message}`</Text>;

  return (
    <View>
      <FlatList
        data={data?.tests?.payload}
        renderItem={({item}) => <Item item={item} />}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

export default AdminTestListScreen;
