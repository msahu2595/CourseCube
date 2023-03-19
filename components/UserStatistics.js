import React from 'react';
import tw from '@lib/tailwind';
import {useQuery} from '@apollo/client';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {STATISTICS} from '@queries';

const statistics = [
  {name: "Video's", icon: 'playcircleo', value: 'videos', type: 'Watched'},
  {name: "PDF's", icon: 'pdffile1', value: 'documents', type: 'Read'},
  {name: "Test's", icon: 'form', value: 'tests', type: 'Attempted'},
  {name: "Q&A's", icon: 'questioncircleo', value: 'questions', type: 'Viewed'},
];

const UserStatistics = () => {
  const {loading, data} = useQuery(STATISTICS);

  const payload = data?.statistics?.payload || {
    videos: 0,
    tests: 0,
    documents: 0,
    questions: 0,
  };

  return (
    <View style={tw`py-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>Statistics</Text>
      </View>
      <View
        style={tw`pt-2 flex-row flex-wrap items-center justify-evenly bg-white`}>
        {statistics.map(({name, icon, value, type}) => {
          return (
            <TouchableOpacity
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
                style={tw`h-8 justify-between items-center pl-2 border-l border-gray-300`}>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={tw.color('blue-600')}
                    style={tw`py-1`}
                  />
                ) : (
                  <Text style={tw`flex-1 font-avSemi text-base text-blue-600`}>
                    {payload[value]}
                  </Text>
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
