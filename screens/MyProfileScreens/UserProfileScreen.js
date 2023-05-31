import React from 'react';
import tw from '@lib/tailwind';
import {View, ScrollView} from 'react-native';
import {
  SafeAreaContainer,
  UserInfo,
  UserStatistics,
  VideoBar,
  TestBar,
  DocumentBar,
} from '@components';

const UserProfileScreen = ({route}) => (
  <SafeAreaContainer
    statusBgColor={tw.color('blue-600')}
    statusBarStyle="light-content">
    <ScrollView>
      <View style={tw`pt-1`}>
        <UserInfo userId={route?.params?.userId} />
      </View>
      <View style={tw`pt-1`}>
        <UserStatistics userId={route?.params?.userId} />
      </View>
      {/* <View style={tw`pt-1`}>
          <FullSyllabusCourseBar title="Full Syllabus Course's" />
        </View> */}
      <View style={tw`pt-1`}>
        <VideoBar title="Video's" />
      </View>
      <View style={tw`pt-1`}>
        <TestBar title="Test's" />
      </View>
      <View style={tw`pt-1`}>
        <DocumentBar title="PDF's" />
      </View>
      {/* <View style={tw`pt-1`}>
          <SubjectWiseCourseBar title="Subject Wise Course's" />
        </View> */}
    </ScrollView>
  </SafeAreaContainer>
);

export default UserProfileScreen;
