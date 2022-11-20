import React from 'react';
import tw from '@lib/tailwind';
import {ScrollView, View, Text, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  FullSyllabusCourseBar,
  SubjectWiseCourseBar,
  VideoBar,
  TestBar,
  DocumentBar,
  UserInfo,
} from '@components';
import AntDesign from 'react-native-vector-icons/AntDesign';

const UserProfileScreen = () => {
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar
        backgroundColor={tw.color('blue-600')}
        barStyle="light-content"
      />
      <ScrollView>
        {/* User Info */}
        <View style={tw`pt-1`}>
          <UserInfo />
        </View>
        {/* Stats */}
        <View style={tw`pt-1`}>
          <UserStatistics />
        </View>
        <View style={tw`pt-1`}>
          <FullSyllabusCourseBar title="Full Syllabus Course's" />
        </View>
        <View style={tw`pt-1`}>
          <VideoBar title="Video's" />
        </View>
        <View style={tw`pt-1`}>
          <TestBar title="Test's" />
        </View>
        <View style={tw`pt-1`}>
          <DocumentBar title="PDF's" />
        </View>
        <View style={tw`pt-1`}>
          <SubjectWiseCourseBar title="Subject Wise Course's" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;

const UserStatistics = () => {
  return (
    <View style={tw`py-4 bg-white`}>
      <View style={tw`flex-row justify-between items-center px-4 bg-white`}>
        <Text style={tw`font-avSemi text-base text-gray-600`}>
          User Statistics
        </Text>
      </View>
      <View
        style={tw`py-2 bg-white flex-row flex-wrap items-center justify-evenly `}>
        <View
          style={tw`w-2/5 items-center justify-between bg-gray-100 px-3 py-2 mb-2 rounded-lg shadow-sm flex-row`}>
          <View style={tw`flex-row items-center`}>
            <AntDesign name="playcircleo" color="black" size={16} />
            <Text style={tw`font-avSemi pl-1 text-sm`}>Video's</Text>
          </View>
          <View
            style={tw`justify-center items-center pl-2 border-l border-gray-400`}>
            <Text style={tw`font-avSemi text-base `}>124</Text>
            <Text style={tw.style('font-avSemi', {fontSize: 10})}>Watched</Text>
          </View>
        </View>
        <View
          style={tw`w-2/5 items-center justify-between bg-gray-100 px-3 py-2 mb-2 rounded-lg shadow-sm flex-row`}>
          <View style={tw`flex-row items-center`}>
            <AntDesign name="pdffile1" color="black" size={16} />
            <Text style={tw`font-avSemi pl-1 text-sm`}>PDF's</Text>
          </View>
          <View
            style={tw`justify-center items-center pl-2 border-l border-gray-400`}>
            <Text style={tw`font-avSemi text-base `}>69</Text>
            <Text style={tw.style('font-avSemi', {fontSize: 10})}>Read</Text>
          </View>
        </View>
        <View
          style={tw`w-2/5 items-center justify-between bg-gray-100 px-3 py-2 mb-2 rounded-lg shadow-sm flex-row`}>
          <View style={tw`flex-row items-center`}>
            <AntDesign name="profile" color="black" size={16} />
            <Text style={tw`font-avSemi pl-1 text-sm`}>Test's</Text>
          </View>
          <View
            style={tw`justify-center items-center pl-2 border-l border-gray-400`}>
            <Text style={tw`font-avSemi text-base `}>4</Text>
            <Text style={tw.style('font-avSemi', {fontSize: 10})}>
              Attempted
            </Text>
          </View>
        </View>
        <View
          style={tw`w-2/5 items-center justify-between bg-gray-100 px-3 py-2 mb-2 rounded-lg shadow-sm flex-row`}>
          <View style={tw`flex-row items-center`}>
            <AntDesign name="questioncircleo" color="black" size={16} />
            <Text style={tw`font-avSemi pl-1 text-sm`}>Q&A's</Text>
          </View>
          <View
            style={tw`justify-center items-center pl-2 border-l border-gray-400`}>
            <Text style={tw`font-avSemi text-base `}>11</Text>
            <Text style={tw.style('font-avSemi', {fontSize: 10})}>Posted</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
