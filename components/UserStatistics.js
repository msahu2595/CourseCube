import tw from '@lib/tailwind';
import {STATISTICS} from '@queries';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';

const statistics = [
  {
    name: "Video's",
    icon: 'playcircleo',
    value: 'videos',
    type: 'Watched',
    screen: '',
  },
  {
    name: "PDF's",
    icon: 'pdffile1',
    value: 'documents',
    type: 'Read',
    screen: '',
  },
  {
    name: "Test's",
    icon: 'form',
    value: 'tests',
    type: 'Attempted',
    screen: '',
  },
  {
    name: "Article's",
    icon: 'profile',
    value: 'articles',
    type: 'Read',
    screen: '',
  },
];

const UserStatistics = ({userId}) => {
  const {loading, data} = useQuery(STATISTICS, {
    variables: userId ? {userId} : {},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const navigation = useNavigation();

  const handleMenuPress = useCallback(
    screen => {
      navigation.navigate(screen);
    },
    [navigation],
  );

  const payload = data?.statistics?.payload || {
    videos: 0,
    tests: 0,
    documents: 0,
    articles: 0,
  };

  return (
    <View style={tw`py-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>Statistics</Text>
      </View>
      <View
        style={tw`pt-2 flex-row flex-wrap items-center justify-evenly bg-white`}>
        {statistics.map(({name, icon, value, type, screen}) => {
          return (
            <TouchableOpacity
              onPress={() => (screen ? handleMenuPress(screen) : null)}
              key={icon}
              style={tw.style(
                'mb-2',
                'flex-row',
                'items-center',
                'justify-around',
                'bg-blue-50',
                'rounded-lg',
                'shadow-sm',
                {width: '44%'},
              )}>
              <View style={tw`flex-row items-center`}>
                <AntDesign name={icon} color={tw.color('blue-600')} size={16} />
                <Text style={tw`pl-2 font-avSemi text-black`}>{name}</Text>
              </View>
              <View style={tw`items-center pl-2 border-l border-gray-300`}>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={tw.color('blue-600')}
                    style={tw`py-1`}
                  />
                ) : (
                  <Text style={tw`font-avSemi text-base text-blue-600`}>
                    {payload[value]}
                  </Text>
                )}
                <Text
                  style={tw.style('font-avSemi text-black text-[10px] pb-1')}>
                  {type}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default UserStatistics;
