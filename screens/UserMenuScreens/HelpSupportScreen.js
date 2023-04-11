import {
  Fab,
  FollowUs,
  ShareApp,
  GetCallFromUs,
  SafeAreaContainer,
} from '@components';
import React from 'react';
import tw from '@lib/tailwind';
import {View} from 'react-native';
import openWebURL from 'utils/openWebURL';
import {WHATSAPP_NUMBER} from '@utils/constants';

const HelpSupportScreen = () => {
  return (
    <SafeAreaContainer
      style={tw`py-2`}
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="dark-content">
      <GetCallFromUs />
      <View style={tw`h-2`} />
      <FollowUs />
      <View style={tw`h-2`} />
      <ShareApp />
      <Fab
        bgColor={tw.color('green-600')}
        iconName="message1"
        onPress={() =>
          openWebURL(`whatsapp://send?phone=${WHATSAPP_NUMBER}&text=Hi`, false)
        }
        style={tw.style({bottom: 16, right: 16})}
      />
    </SafeAreaContainer>
  );
};

export default HelpSupportScreen;
