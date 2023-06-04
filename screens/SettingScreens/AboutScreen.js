import {tw} from '@lib';
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import HighlightText from '@sanar/react-native-highlight-text';
import openWebURL from 'utils/openWebURL';

const AboutScreen = props => {
  return (
    <ScrollView>
      <View style={tw`p-4 border-t border-gray-100`}>
        <Text
          style={tw`font-avSemi text-center text-lg text-gray-600 py-2`}
          numberOfLines={2}>
          Lakshya PSC Academy
        </Text>
        <HighlightText
          highlightStyle={tw`font-bold`}
          searchWords={['Lakshya PSC Academy']}
          textToHighlight={`Welcome to our online study application 'Lakshya PSC Academy' We're glad you're here, and we'd love to tell you more about who we are and what we stand for.

          Our mission is to provide accessible and effective online education to learners around the world. We believe that education should be available to everyone, regardless of their background, location, or financial means. We're committed to making that vision a reality by creating high-quality, engaging courses that are affordable and easy to access.
          
          Our team is made up of passionate educators, developers, and designers who are dedicated to creating the best possible learning experience for our users. We work tirelessly to ensure that our courses are up-to-date, relevant, and enjoyable, and we're always looking for ways to improve and expand our offerings.
          
          We believe that learning should be a fun and engaging experience, and we strive to make our courses as interactive and immersive as possible. We use a variety of tools and technologies to create dynamic and engaging learning environments, including videos, animations, quizzes, and interactive simulations.
          
          At our core, we're driven by a deep commitment to education and a belief in the transformative power of learning. We're passionate about helping our users achieve their goals and unlock their full potential, and we're committed to providing them with the tools and resources they need to succeed.
          
          Thank you for choosing our online study application Lakshya PSC Academy. We're honored to be a part of your learning journey, and we look forward to helping you achieve your goals.
          
          If you have any query, please contact us at`}
          textComponent={({children}) => {
            return (
              <Text
                style={tw`pt-2 text-xs  text-justify leading-5 font-avReg tracking-wider text-gray-900`}>
                {children}
                <Text
                  style={tw`text-blue-600 font-bold`}
                  onPress={() =>
                    openWebURL(
                      'mailto:lakshyapscacademylwbg@gmail.com?subject=Query&body=Hello,',
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
  );
};

export default AboutScreen;
