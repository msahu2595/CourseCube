import React, {useCallback} from 'react';
import tw from '@lib/tailwind';
import {useQuery} from '@apollo/client';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {STATISTICS} from '@queries';
import {useNavigation} from '@react-navigation/native';

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
    screen: 'AdminHeadlineListScreen',
  },
  {name: "Test's", icon: 'form', value: 'tests', type: 'Attempted', screen: ''},
  {
    name: "Q&A's",
    icon: 'questioncircleo',
    value: 'questions',
    type: 'Viewed',
    screen: '',
  },
];

const UserStatistics = () => {
  const {loading, error, data} = useQuery(STATISTICS);
  console.log(error?.message);

  const navigation = useNavigation();

  const handleMenuPress = useCallback(
    screen => {
      navigation.navigate(screen);
    },
    [navigation],
  );
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
              onPress={() => handleMenuPress(screen)}
              key={icon}
              style={tw.style(
                'mb-2',
                'p-2',
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
              <View
                style={tw`justify-center items-center pl-2 border-l border-gray-300`}>
                {data && (
                  <Text style={tw`font-avSemi text-base text-blue-600`}>
                    {data?.statistics?.payload[value]}
                  </Text>
                )}
                {loading && (
                  <ActivityIndicator
                    size="small"
                    color={tw.color('blue-600')}
                    style={tw`py-1`}
                  />
                )}
                <Text
                  style={tw.style('font-avSemi', 'text-black', {
                    fontSize: 10,
                  })}>
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
