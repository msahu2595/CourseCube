import React from 'react';
import {View, FlatList} from 'react-native';
import tw from '@lib/tailwind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FollowItem} from '@components';

const FollowingListScreen = () => {
  const renderItem = ({item, index}) => <FollowItem index={index} {...item} />;
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-white mt-1`}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={tw`bg-white py-2`}
          ItemSeparatorComponent={() => <View style={tw`h-6`} />}
          ListHeaderComponent={() => <View style={tw`h-2`} />}
          ListFooterComponent={() => <View style={tw`h-2`} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default FollowingListScreen;

const data = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    image: require('@images/Logo.png'),
    name: 'Sonu Kumar',
    activities: 50,
    followers: '1k',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bb',
    image: require('@images/Logo.png'),
    name: 'Sonu Kumar',
    activities: 50,
    followers: '3k',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bc',
    image: require('@images/Logo.png'),
    name: 'Sonu Kumar',
    activities: 50,
    followers: '5k',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bd',
    image: require('@images/Logo.png'),
    name: 'Sonu Kumar',
    activities: 50,
    followers: '7k',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28be',
    image: require('@images/Logo.png'),
    name: 'Sonu Kumar',
    activities: 50,
    followers: '9k',
  },
];
