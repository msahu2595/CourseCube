import tw from '@lib/tailwind';
import {CONTENT} from '@queries';
import Pdf from 'react-native-pdf';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import openWebURL from 'utils/openWebURL';
import {Fab, SafeAreaContainer} from '@components';
import {View, Alert, ActivityIndicator, Text} from 'react-native';

const DocumentViewScreen = ({route}) => {
  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(CONTENT, {
    variables: {contentId: route.params.contentId},
  });

  const handledLoadComplete = useCallback((numberOfPages, filePath) => {
    console.log(`Number of pages: ${numberOfPages}, File path: ${filePath}`);
  }, []);

  const handlePageChanged = useCallback((page, numberOfPages) => {
    console.log(`Current page: ${page}, Total page: ${numberOfPages}`);
  }, []);

  const handlePressLink = useCallback(uri => {
    openWebURL(uri);
  }, []);

  const handleError = useCallback(error => {
    console.log('Cannot render PDF', error);
    Alert.alert('Error', 'The source URL is wrong.');
  }, []);

  if (queryError) {
    return (
      <SafeAreaContainer style={tw`justify-center items-center`}>
        <Text style={tw`text-black align-center`}>
          Unexpected error happened, Please try again!
        </Text>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('teal-200')}
      statusBarStyle="dark-content">
      {queryLoading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      ) : (
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
      )}
      <Fab bgColor={tw.color('teal-600')} iconName="download" onPress={null} />
    </SafeAreaContainer>
  );
};

export default DocumentViewScreen;
