import React from 'react';
import tw from '@lib/tailwind';
import Pdf from 'react-native-pdf';
import {useQuery} from '@apollo/client';
import {BUNDLE_CONTENT} from '@queries';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, TouchableOpacity, StatusBar} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CourseDocumentViewScreen = ({route}) => {
  const {loading: queryLoading, data: queryData} = useQuery(BUNDLE_CONTENT, {
    variables: {bundleContentId: route.params.bundleContentId},
  });

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar
        backgroundColor={tw.color('teal-200')}
        barStyle="dark-content"
      />
      <View style={tw`flex-1 bg-black`}>
        <Pdf
          source={{
            uri: queryData?.bundleContent?.payload?.media?.url,
            cache: true,
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onError={error => console.log('Cannot render PDF', error)}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={tw`flex-1 bg-black`}
        />
      </View>
      <TouchableOpacity
        onPressOut={null}
        style={tw.style(
          'absolute',
          'bottom-2',
          'right-2',
          'bg-teal-600',
          'justify-center',
          'items-center',
          'rounded-full',
          'shadow',
          {width: 56, height: 56},
        )}>
        <MaterialCommunityIcons
          name="file-download-outline"
          size={28}
          color={tw.color('white')}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CourseDocumentViewScreen;
