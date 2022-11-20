import tw from '@lib/tailwind';
import {BUNDLE} from '@queries';
import {useQuery} from '@apollo/client';
import {SafeAreaContainer} from '@components';
import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import TreeView from 'react-native-animated-tree-view';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SyllabusScreen = props => {
  const navigation = useNavigation();
  const [treeIcon, setTreeIcon] = useState();
  AntDesign.getImageSource(
    'copy1',
    32,
    tw.color(`${props.route.params?.themeColor || 'green'}-700`),
  ).then(source => setTreeIcon(source));

  const {loading: queryLoading, data: queryData} = useQuery(BUNDLE, {
    variables: {bundleId: props.route.params.bundleId},
  });

  const handleClick = useCallback(
    payload => {
      navigation.navigate('ContentListTopTabNavigator', {
        bundleId: props.route.params.bundleId,
        subjectId: payload.value,
      });
    },
    [navigation, props.route.params.bundleId],
  );

  const data = queryData?.bundle?.payload;

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
        {data?.syllabus && (
          <TreeView
            data={data?.syllabus}
            onClick={handleClick}
            containerStyle={tw`px-4 py-2`}
            listContainerStyle={tw``}
            leftImage={treeIcon}
            leftImageStyle={tw.style({width: 20, height: 20})}
            textStyle={tw`pl-2 font-avReg text-base text-gray-900`}
          />
        )}
      </LinearGradient>
    </SafeAreaContainer>
  );
};

export default SyllabusScreen;
