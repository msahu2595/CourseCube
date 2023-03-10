/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
import {useQuery} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {
  Button,
  FlatList,
  RefreshControl,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '@lib/tailwind';
import {ARTICLES} from '@queries';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CurrentAffairItem, SafeAreaContainer} from '@components';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

const AdminArticleListScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [search, setSearch] = useState('');

  const navigation = useNavigation();

  const {loading, data, refetch, fetchMore} = useQuery(ARTICLES, {
    variables: {offset: 0},
  });

  // console.log(data.articles.payload);
  // console.log(width);
  const Item = useCallback(
    ({item, index}) => <CurrentAffairItem index={index} {...item} />,
    [],
  );

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row items-center m-2`}>
        <View
          style={tw`flex-1 flex-row  justify-between rounded-lg px-2 items-center border`}>
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
          style={tw`ml-2`}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={value => {
            setIsEnabled(value);
            refetch({filter: {enable: !value}});
          }}
          value={isEnabled}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('AdminCreateArticleScreen')}>
          <MaterialIcons
            name="add-circle"
            size={40}
            color={tw.color('blue-600')}
          />
        </TouchableOpacity>
        {/* <View style={tw` `}>
          <Button
            title="+"
            onPress={() => navigation.navigate('AdminCreateArticleScreen')}
          />
        </View> */}
      </View>
      <SafeAreaContainer
        statusBgColor={tw.color('gray-300')}
        statusBarStyle="dark-content">
        <LinearGradient
          locations={[0, 0.5, 1]}
          colors={[
            tw.color('gray-300'),
            tw.color('gray-200'),
            tw.color('gray-100'),
          ]}
          style={tw`flex-1`}>
          <FlatList
            bounces={true}
            data={data?.articles?.payload}
            renderItem={({item}) => <Item item={item} />}
            keyExtractor={item => item._id}
            // contentContainerStyle={tw`bg-white`}
            // ItemSeparatorComponent={() => <View style={tw`h-3`} />}
            ListHeaderComponent={() => <View style={tw`h-2`} />}
            ListFooterComponent={() => <View style={tw`h-2`} />}
            onEndReached={() => {
              console.log('reached end');
              fetchMore({
                variables: {
                  offset: data?.articles?.payload.length,
                  limit: 10,
                },
              });
            }}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={refetch} />
            }
          />
        </LinearGradient>
      </SafeAreaContainer>
    </View>
  );
};

export default AdminArticleListScreen;
