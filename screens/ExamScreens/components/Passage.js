import {tw} from '@lib';
import React, {memo, useState, useCallback} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Passage = memo(({content}) => {
  const [passageVisible, setPassageVisible] = useState(false);

  const togglePassageVisibility = useCallback(() => {
    setPassageVisible(!passageVisible);
  }, [passageVisible]);

  return content ? (
    <View style={tw`mb-1 bg-white shadow-sm rounded-lg`}>
      <TouchableOpacity
        onPress={togglePassageVisibility}
        style={tw`flex-row items-center justify-between px-4 py-2`}>
        <Text style={tw`text-base font-avSemi text-gray-600`}>Passage</Text>
        <MaterialCommunityIcons
          size={24}
          color={tw.color('gray-600')}
          name={passageVisible ? 'chevron-down-circle' : 'chevron-up-circle'}
        />
      </TouchableOpacity>
      {passageVisible && (
        <ScrollView
          contentContainerStyle={tw`px-3 pb-2`}
          style={tw`max-h-48 border-t border-amber-400`}>
          <Text style={tw`text-sm font-avReg text-gray-600 leading-5`}>
            {content}
          </Text>
        </ScrollView>
      )}
    </View>
  ) : null;
});

export default Passage;
