import tw from '@lib/tailwind';
import {DOCUMENT} from '@queries';
import Pdf from 'react-native-pdf';
import {useQuery} from '@apollo/client';
import React, {useCallback} from 'react';
import openWebURL from 'utils/openWebURL';
import {SafeAreaContainer} from '@components';
import config from 'react-native-ultimate-config';
import {Text, View, Alert, ActivityIndicator} from 'react-native';

const AdminDocumentViewScreen = ({route}) => {
  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(DOCUMENT, {
    variables: {documentId: route.params?.documentId},
  });

  const data = queryData?.document?.payload || {};

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
      statusBgColor={tw.color('blue-600')}
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
            uri: `${
              __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
            }/${data?.url}`,
            cache: true,
          }}
          onLoadComplete={handledLoadComplete}
          onPageChanged={handlePageChanged}
          onPressLink={handlePressLink}
          onError={handleError}
        />
      )}
    </SafeAreaContainer>
  );
};

export default AdminDocumentViewScreen;
