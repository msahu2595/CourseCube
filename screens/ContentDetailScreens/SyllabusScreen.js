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

const SyllabusScreen = ({route}) => {
  const navigation = useNavigation();

  const {loading: queryLoading, data: queryData} = useQuery(BUNDLE_SYLLABUS, {
    variables: {bundleId: route.params?.bundleId},
  });

  const handleClick = useCallback(
    payload => {
      navigation.navigate('CourseContentListTopTabNavigator', {
        subjectId: payload?.subjectId,
        bundleId: route.params?.bundleId,
        themeColor: route.params?.themeColor,
      });
    },
    [navigation, route.params],
  );

  const data = queryData?.bundleSyllabus?.payload?.syllabus || [];

  return (
    <SafeAreaContainer
      statusBgColor={tw.color(`${route.params?.themeColor || 'green'}-200`)}
      statusBarStyle="dark-content">
      <LinearGradient
        locations={[0, 0.2, 0.5]}
        colors={[
          tw.color(`${route.params?.themeColor || 'green'}-200`),
          tw.color(`${route.params?.themeColor || 'green'}-50`),
          tw.color('white'),
        ]}
        style={tw`flex-1`}>
        <SyllabusTree
          data={data}
          onPress={handleClick}
          iconColor={`${route.params?.themeColor || 'green'}-700`}
        />
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default SyllabusScreen;
