import tw from '@lib/tailwind';
import {CONTENT} from '@queries';
import Pdf from 'react-native-pdf';
import React, {useCallback} from 'react';
import openWebURL from 'utils/openWebURL';
import {SafeAreaContainer} from '@components';
import {showMessage} from 'react-native-flash-message';
import {gql, useMutation, useQuery} from '@apollo/client';
import {View, Alert, ActivityIndicator, Text} from 'react-native';

const ADD_VIEW = gql`
  mutation addView($refId: ID!) {
    addView(refId: $refId) {
      code
      success
      message
      token
    }
  }
`;

const DocumentViewScreen = ({route}) => {
  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(CONTENT, {
    variables: {contentId: route.params.contentId},
  });

  const data = queryData?.content?.payload || {};

  const [addView] = useMutation(ADD_VIEW, {
    variables: {refId: data?._id},
    onCompleted: res => {
      console.log('addView', res);
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const handledLoadComplete = useCallback(
    (numberOfPages, filePath) => {
      console.log(`Number of pages: ${numberOfPages}, File path: ${filePath}`);
      addView();
    },
    [addView],
  );

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
            uri: data?.media?.url,
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

export default DocumentViewScreen;
