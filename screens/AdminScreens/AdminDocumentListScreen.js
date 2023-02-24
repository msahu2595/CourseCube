import {useQuery} from '@apollo/client';
import {DOCUMENTS} from 'apollo/queries/DOCUMENTS';
import React, {useCallback} from 'react';
import {FlatList, Text, View} from 'react-native';
import tw from '@lib/tailwind';

const AdminDocumentListScreen = () => {
  const {loading, error, data} = useQuery(DOCUMENTS);
  console.log(data?.documents.payload);

  const Item = useCallback(
    ({item}) => (
      <View style={tw`flex-row bg-white mb-3 mx-3 rounded-lg`}>
        <Text style={tw`text-sm font-bold`}>{item?.title}</Text>
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
      />
    </View>
  );
};

export default AdminDocumentListScreen;
