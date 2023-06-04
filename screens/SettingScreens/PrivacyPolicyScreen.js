import {tw} from '@lib';
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import HighlightText from '@sanar/react-native-highlight-text';
import {SafeAreaContainer} from '@components';
import openWebURL from 'utils/openWebURL';

const PrivacyPolicyScreen = () => {
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
              'Information We Collect:',
              'How We Use Your Information:',
              'Security:',
              'Your Choices:',
              'Children’s Privacy:',
              'Changes to Our Privacy Policy:',
            ]}
            textToHighlight={`We take your privacy very seriously. We are committed to protecting your personal information and ensuring that your online learning experience is safe and secure. This Privacy Policy explains how we collect, use, and protect your personal information when you use our online study application.

Information We Collect: We collect personal information that you provide to us when you create an account, enroll in a course, or communicate with us. This information may include your name, email address, phone number, and payment information.
          
          We may also collect information about your use of our application, including your IP address, device type, browser type, and operating system. We use cookies and similar technologies to collect this information and improve your user experience.
          
How We Use Your Information: We use your personal information to provide and improve our online study application, to communicate with you about your account and courses, and to personalize your learning experience. We may also use your information to conduct research and analytics to improve our application.
          
          We may share your personal information with third-party service providers who assist us in providing our online study application. These service providers are bound by confidentiality agreements and are not authorized to use your information for any other purpose.
          
          We may also disclose your personal information if required by law or to protect our rights or the rights of others.
          
Security: We take reasonable steps to protect your personal information from unauthorized access, use, or disclosure. We use industry-standard security measures, such as encryption and firewalls, to protect your information.
          
Your Choices: You can access and update your personal information by logging into your account. You can also opt-out of receiving promotional emails from us by clicking the unsubscribe link at the bottom of the email.
          
Children’s Privacy: Our online study application is intended for use by adults. We do not knowingly collect personal information from children under the age of 13. If you believe we have collected personal information from a child under the age of 13, please contact us immediately.
          
Changes to Our Privacy Policy: We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website. Your continued use of our online study application after the effective date of the revised Privacy Policy constitutes your acceptance of the revised Privacy Policy.          
          
          If you have any questions or comments about these Privacy Policy, please contact us at`}
            textComponent={({children}) => {
              return (
                <Text
                  style={tw`pt-2 text-xs  text-justify leading-5 font-avReg tracking-wider text-gray-900`}>
                  {children}
                  <Text
                    style={tw`text-blue-600 font-bold`}
                    onPress={() =>
                      openWebURL(
                        'mailto:lakshyapscacademylwbg@gmail.com?subject=Query regarding Privacy Policy&body=Hello,',
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

export default PrivacyPolicyScreen;
