import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {ScrollView, View, Linking} from 'react-native';
import {
  SafeAreaContainer,
  AdvertBar,
  ShortcutBar,
  HistoryBar,
  FullSyllabusCourseBar,
  SubjectWiseCourseBar,
  VideoBar,
  TestBar,
  DocumentBar,
  NotificationBar,
  CurrentAffairBar,
  Fab,
  ShareApp,
  FollowUs,
  GetSubscription,
} from '@components';
import {WHATSAPP_NUMBER} from '@utils/constants';

const HomeScreen = props => {
  const connectWhatsApp = useCallback(() => {
    Linking.openURL(`whatsapp://send?phone=${WHATSAPP_NUMBER}&text=Hi`);
  }, []);
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('emerald-600')}
      statusBarStyle="light-content">
      <ScrollView>
        <View>
          <AdvertBar type="TINY" containerStyle={tw`pt-2`} />
        </View>
        <View>
          <AdvertBar type="SMALL" containerStyle={tw`pt-2`} />
        </View>
        <View style={tw`pt-1`}>
          <ShortcutBar />
        </View>
        <View>
          <AdvertBar type="MEDIUM" containerStyle={tw`pt-2`} />
        </View>
        <View>
          <AdvertBar type="LARGE" containerStyle={tw`pt-2`} />
        </View>
        <View style={tw`pt-1`}>
          <HistoryBar title="Continue Learning" />
        </View>
        <View style={tw`mt-1`}>
          <FullSyllabusCourseBar title="Prepare with Full Syllabus Course" />
        </View>
        <View style={tw`pt-1`}>
          <VideoBar title="Recent Videos" />
          <VideoBar title="Free Classes" filter={{paid: false}} />
          <VideoBar title="Paid Classes" filter={{paid: true}} />
        </View>
        <View style={tw`pt-1`}>
          <TestBar title="Recent Tests" />
          <TestBar title="Free Tests" filter={{paid: false}} />
          <TestBar title="Paid Tests" filter={{paid: true}} />
        </View>
        <View style={tw`pt-1`}>
          <DocumentBar
            title="Free PDF's (Study Materials)"
            filter={{paid: false}}
          />
          <DocumentBar
            title="Paid PDF's (Study Materials)"
            filter={{paid: true}}
          />
        </View>
        <View style={tw`pt-1`}>
          <SubjectWiseCourseBar title="Subject Wise Courses" />
        </View>
        <View style={tw`pt-1`}>
          <NotificationBar title="Latest Notifications" />
        </View>
        <View style={tw`py-2`}>
          <GetSubscription />
        </View>
        <View style={tw``}>
          <CurrentAffairBar title="Latest Current Affairs" />
        </View>
        <View style={tw`pt-2`}>
          <ShareApp />
        </View>
        <View style={tw`py-2`}>
          <FollowUs />
        </View>
      </ScrollView>
      <Fab
        bgColor={tw.color('emerald-600')}
        iconName="message1"
        onPress={connectWhatsApp}
      />
    </SafeAreaContainer>
  );
};

export default HomeScreen;
