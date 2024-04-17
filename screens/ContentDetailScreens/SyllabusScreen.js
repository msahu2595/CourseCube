import tw from '@lib/tailwind';
import React, {useCallback} from 'react';
import {gql, useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaContainer, SyllabusTree} from '@components';

const BUNDLE_SYLLABUS = gql`
  query bundleSyllabus($bundleId: ID!) {
    bundleSyllabus(bundleId: $bundleId) {
      code
      success
      message
      token
      payload
    }
  }
`;

const SyllabusScreen = props => {
  const navigation = useNavigation();

  const {loading: queryLoading, data: queryData} = useQuery(BUNDLE_SYLLABUS, {
    variables: {bundleId: props.route.params.bundleId},
  });

  const handleClick = useCallback(
    payload => {
      navigation.navigate('CourseContentListTopTabNavigator', {
        bundleId: props.route.params?.bundleId,
        subjectId: payload?.subjectId,
      });
    },
    [navigation, props.route.params.bundleId],
  );

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
        <SyllabusTree
          data={queryData?.bundleSyllabus?.payload?.syllabus}
          iconColor="green-700"
          onPress={handleClick}
          onLongPress={option => {
            console.log('onLongPress', option);
          }}
        />
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default SyllabusScreen;
