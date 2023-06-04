import {tw} from '@lib';
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import HighlightText from '@sanar/react-native-highlight-text';
import {SafeAreaContainer} from '@components';
import openWebURL from 'utils/openWebURL';

const RefundReturnPolicyScreen = () => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      <ScrollView>
        <View style={tw`p-4 border-t border-gray-100`}>
          <Text
            style={tw`font-avSemi text-center text-lg text-gray-600 py-2`}
            numberOfLines={2}>
            Lakshya PSC Academy
          </Text>
          <HighlightText
            highlightStyle={tw`font-bold`}
            searchWords={[
              'Lakshya PSC Academy',
              'no refund policy',
              'We will not issue any refunds for any reason.',
            ]}
            textToHighlight={`We understand that our online study application may not be suitable for everyone. However, due to the nature of our digital product, we cannot offer any refunds once the purchase has been made.

          We provide a free trial period for you to test our application before making any purchase. Please take advantage of this period to evaluate whether our product meets your needs before deciding to make a payment.
          
          Once the payment has been made, you agree that you have read and understood our no refund policy. We will not issue any refunds for any reason.
          
          In the event that we are unable to provide access to the product due to technical issues or other unforeseeable circumstances, we will make every effort to resolve the issue as soon as possible. However, we do not guarantee any specific outcome or result.
          
          By using our online study application and making a payment, you agree to these terms and conditions. If you have any questions or concerns, please contact us before making a purchase.
          
          Please note that this is just a sample policy, and you should always consult with a legal professional to ensure that your policy complies with all applicable laws and regulations.
          
          If you have any questions or comments about these Refund & Return Policy, please contact us at`}
            textComponent={({children}) => {
              return (
                <Text
                  style={tw`pt-2 text-xs  text-justify leading-5 font-avReg tracking-wider text-gray-900`}>
                  {children}
                  <Text
                    style={tw`text-blue-600 font-bold`}
                    onPress={() =>
                      openWebURL(
                        'mailto:lakshyapscacademylwbg@gmail.com?subject=Query regarding Refund and Return Policy&body=Hello,',
                        false,
                      )
                    }>
                    {` lakshyapscacademylwbg@gmail.com`}
                  </Text>
                </Text>
              );
            }}
          />
        </View>
        <View style={tw.style({height: 72})} />
      </ScrollView>
    </SafeAreaContainer>
  );
};

export default RefundReturnPolicyScreen;
