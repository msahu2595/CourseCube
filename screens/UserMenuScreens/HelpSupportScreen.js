import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {View, StatusBar, Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FollowUs, ShareApp, GetCallFromUs, Fab} from '@components';
import {WHATSAPP_NUMBER} from '@utils/constants';

const HelpSupportScreen = () => {
  const connectWhatsApp = useCallback(() => {
    Linking.openURL(`whatsapp://send?phone=${WHATSAPP_NUMBER}&text=Hi`);
  }, []);
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar
        backgroundColor={tw.color('teal-600')}
        barStyle="dark-content"
      />
      <View style={tw`py-2`}>
        <GetCallFromUs />
      </View>
      <View style={tw`py-2`}>
        <FollowUs />
      </View>
      <View style={tw`py-2`}>
        <ShareApp />
      </View>
      <Fab
        bgColor={tw.color('green-600')}
        iconName="message1"
        onPress={connectWhatsApp}
        style={tw.style({bottom: 16, right: 16})}
      />
    </SafeAreaView>
  );
};

export default HelpSupportScreen;
