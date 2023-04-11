import tw from '@lib/tailwind';
import {CONTENT} from '@queries';
import Pdf from 'react-native-pdf';
import {useQuery} from '@apollo/client';
import openWebURL from 'utils/openWebURL';
import {SafeAreaContainer} from '@components';
import React, {useCallback, useState} from 'react';
import {View, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DocumentViewScreen = ({route}) => {
  const {loading: queryLoading, data: queryData} = useQuery(CONTENT, {
    variables: {contentId: route.params.contentId},
  });

  const [loading, setLoading] = useState(true);

  const handledLoadComplete = useCallback((numberOfPages, filePath) => {
    console.log(`Number of pages: ${numberOfPages}, File path: ${filePath}`);
    setLoading(false);
  }, []);

  const handlePageChanged = useCallback((page, numberOfPages) => {
    console.log(`Current page: ${page}, Total page: ${numberOfPages}`);
  }, []);

  const handlePressLink = useCallback(uri => {
    openWebURL(uri);
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
    <SafeAreaContainer
      statusBgColor={tw.color('teal-200')}
      statusBarStyle="dark-content">
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
              trustAllCerts={false}
              style={tw`flex-1 bg-black`}
              source={{
                uri: queryData?.content?.payload?.media?.url,
                cache: true,
              }}
              onLoadComplete={handledLoadComplete}
              onPageChanged={handlePageChanged}
              onPressLink={handlePressLink}
              onError={handleError}
            />
          </>
        )}
      </View>
      <TouchableOpacity
        onPressOut={null}
        style={tw`absolute bottom-2 right-2 bg-teal-600 justify-center items-center rounded-full shadow w-[56px] h-[56px]`}>
        <MaterialCommunityIcons
          size={28}
          color={tw.color('white')}
          name="file-download-outline"
        />
      </TouchableOpacity>
    </SafeAreaContainer>
  );
};

export default DocumentViewScreen;
