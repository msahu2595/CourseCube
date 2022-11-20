import React from 'react';
import tw from '@lib/tailwind';
import {SafeAreaContainer} from '@components';
import {View, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const FAQScreen = props => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color(
        `${props.route.params?.themeColor || 'green'}-200`,
      )}
      statusBarStyle="dark-content">
      <LinearGradient
        locations={[0, 0.2, 0.5]}
        colors={[
          tw.color(`${props.route.params?.themeColor || 'green'}-200`),
          tw.color(`${props.route.params?.themeColor || 'green'}-50`),
          tw.color('white'),
        ]}
        style={tw`flex-1`}>
        <View>
          <Text>FAQScreen</Text>
        </View>
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default FAQScreen;
