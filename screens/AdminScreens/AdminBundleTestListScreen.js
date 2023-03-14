import tw from 'twrnc';
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Button,
} from 'react-native';
import {BUNDLES, BUNDLE_CONTENTS} from '@queries';
import {useMutation, useQuery} from '@apollo/client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaContainer} from '@components';
import {DELETE_BUNDLE_CONTENTS} from 'apollo/mutations/DELETE_BUNDLE_CONTENT';
import {showMessage} from 'react-native-flash-message';

const Separator = () => <View style={tw`h-2`} />;

const width = Dimensions.get('window').width;

const Item = item => {
  const [deleteBundleContent] = useMutation(DELETE_BUNDLE_CONTENTS, {
    onCompleted: () => {
      showMessage({
        message: 'Your test successfully deleted',
        type: 'success',
      });
    },
    onError: error => {
      console.log('onError', error.message);
      showMessage({
        message: 'Not able to delete',
        type: 'error',
      });
    },
    refetchQueries: ['bundleContents'],
  });

  const deleteHandler = useCallback(
    bundleContentId =>
      Alert.alert('Delete document', 'Are you sure want to delete test', [
        {
          text: 'cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            deleteBundleContent({
              variables: {bundleContentId},
            }),
        },
      ]),
    [deleteBundleContent],
  );
  return (
    <View
      style={tw.style('flex flex-col rounded-lg bg-white', {
        width: width / 2 - 8,
      })}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={tw`text-[14px] p-2 font-bold text-red-600`}>
        {item.title}
      </Text>
      <Image
        source={{
          uri: item.image,
        }}
        style={tw`h-60 rounded-lg`}
      />
      <View style={tw`h-24 flex justify-between p-2`}>
        <Text style={tw`text-xs font-bold text-blue-800`}>{item.subject}</Text>
      </View>
      {item.enable && (
        <Button
          title={'delete'}
          color="red"
          onPress={() => {
            deleteHandler(item._id);
          }}
        />
      )}
    </View>
  );
};

function AdminBundleTestListScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [search, setSearch] = useState('');

  const {loading, error, data, refetch, fetchMore} = useQuery(BUNDLE_CONTENTS, {
    variables: {
      filter: {
        type: 'Test',
      },
      bundleId: '6402198917b9fcec1454dbd6',
    },
  });

  console.log(data);

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
        data={data?.bundleContents?.payload}
        renderItem={({item}) => <Item {...item} />}
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
              offset: data?.bundleContents?.payload.length,
              limit: 10,
            },
          })
        }
      />
    </SafeAreaContainer>
  );
}

export default AdminBundleTestListScreen;
