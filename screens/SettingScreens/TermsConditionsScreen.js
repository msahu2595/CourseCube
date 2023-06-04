import {tw} from '@lib';
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import HighlightText from '@sanar/react-native-highlight-text';
import {SafeAreaContainer} from '@components';
import openWebURL from 'utils/openWebURL';

const TermsConditionsScreen = () => {
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
              'Acceptance of Terms:',
              'Use of the Service:',
              'User Accounts:',
              'User Content:',
              'Prohibited Activities:',
              'Intellectual Property:',
              'Disclaimers:',
              'Limitation of Liability:',
              'Modification of Terms:',
              'Governing Law:',
              'Contact Us:',
            ]}
            textToHighlight={`Welcome to our online study application. Before you start using our service, please read these terms and conditions carefully.

Acceptance of Terms: By accessing or using our online study application, you agree to be bound by these Terms and Conditions and our Privacy Policy.
          
Use of the Service: Our online study application is provided for your personal use only. You may not use the service for any commercial purpose or for the benefit of any third party.
          
User Accounts: To use the service, you must create a user account. You are responsible for maintaining the confidentiality of your account login information and for all activities that occur under your account.
          
User Content: You retain all rights to any content that you submit to our online study application, such as study materials or notes. By submitting content, you grant us a non-exclusive, royalty-free, worldwide license to use, modify, and distribute the content solely for the purpose of providing the service.
          
Prohibited Activities: You may not use our online study application to:
          
  * Post, transmit or distribute any content that is unlawful, obscene, defamatory, threatening, harassing, abusive, or invasive of another’s privacy.
            
  * Engage in any activity that interferes with or disrupts the service or servers and networks connected to the service.
          
  * Use any automated system or software to extract data from the service.
            
  * Attempt to access any portion of the service that you are not authorized to access.
            
  * Use the service for any illegal or unauthorized purpose.
          
Intellectual Property: Our online study application and all content and materials on the service, including but not limited to text, graphics, logos, images, and software, are the property of the company or its licensors and are protected by copyright, trademark, and other intellectual property laws.
          
Disclaimers: The service is provided on an “as is” and “as available” basis without warranty of any kind, either express or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose.
          
Limitation of Liability: To the extent permitted by law, we shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to damages for loss of profits, goodwill, use, data or other intangible losses, arising out of or in connection with the use or inability to use the service.
          
Modification of Terms: We reserve the right to modify these Terms and Conditions at any time without prior notice. Your continued use of the service after any changes are made constitutes your acceptance of the new Terms and Conditions.
          
Governing Law: These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which the company is located.
          
          If you have any questions or comments about these Terms and Conditions, please contact us at`}
            textComponent={({children}) => {
              return (
                <Text
                  style={tw`pt-2 text-xs  text-justify leading-5 font-avReg tracking-wider text-gray-900`}>
                  {children}
                  <Text
                    style={tw`text-blue-600 font-bold`}
                    onPress={() =>
                      openWebURL(
                        'mailto:lakshyapscacademylwbg@gmail.com?subject=Query regarding Terms and Conditions&body=Hello,',
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

export default TermsConditionsScreen;
