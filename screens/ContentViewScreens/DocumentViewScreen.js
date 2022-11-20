import React, {useCallback, useState} from 'react';
import tw from '@lib/tailwind';
import {CONTENT} from '@queries';
import Pdf from 'react-native-pdf';
import {useQuery} from '@apollo/client';
import {SafeAreaView} from 'react-native';
import {
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DocumentViewScreen = ({route}) => {
  const {loading: queryLoading, data: queryData} = useQuery(CONTENT, {
    variables: {contentId: route.params.contentId},
  });

  const [loading, setLoading] = useState(true);

  const handledLoadEnd = useCallback((numberOfPages, filePath) => {
    console.log(`Number of pages: ${numberOfPages}`);
    setLoading(false);
  }, []);

  const handleError = useCallback(
    error => {
      console.log('Cannot render PDF', error);
      Alert.alert(
        'Error',
        `The source URL is wrong, provided URL is - ${queryData?.content?.payload?.media?.url}`,
      );
      setLoading(false);
    },
    [queryData?.content?.payload?.media?.url],
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar
        backgroundColor={tw.color('teal-200')}
        barStyle="dark-content"
      />
      <View style={tw`flex-1 bg-black`}>
        {queryLoading ? (
          <View style={tw`flex-1 items-center justify-center`}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : (
          <>
            {loading && (
              <View
                style={tw`absolute top-0 bottom-0 left-0 right-0 items-center justify-center`}>
                <ActivityIndicator size="large" color="#FFF" />
              </View>
            )}
            <Pdf
              source={{
                uri:
                  'https://www.africau.edu/images/default/sample.pdf' ||
                  queryData?.content?.payload?.media?.url,
                cache: true,
              }}
              onLoadComplete={handledLoadEnd}
              onError={handleError}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onPressLink={uri => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={tw`flex-1 bg-black`}
            />
          </>
        )}
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

export default DocumentViewScreen;
