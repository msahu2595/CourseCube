import {
  CCLikeButton,
  CCBookmarkButton,
  CCDownloadButton,
} from 'components/Common';
import tw from '@lib/tailwind';
import Pdf from 'react-native-pdf';
import {BUNDLE_CONTENT} from '@queries';
import openWebURL from 'utils/openWebURL';
import {SafeAreaContainer} from '@components';
import config from 'react-native-ultimate-config';
import React, {useCallback, useEffect} from 'react';
import {showMessage} from 'react-native-flash-message';
import {gql, useMutation, useQuery} from '@apollo/client';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Text, View, Alert, ActivityIndicator} from 'react-native';

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

const CourseDocumentViewScreen = ({navigation, route}) => {
  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(BUNDLE_CONTENT, {
    variables: {bundleContentId: route?.params?.bundleContentId},
  });

  useEffect(() => {
    const payload = queryData?.bundleContent?.payload;
    if (payload) {
      navigation.setOptions({
        headerRight: () => (
          <>
            <CCLikeButton
              refId={payload?._id}
              initial={payload?.liked === 1 ? true : false}
              refetchQueries={[
                {
                  query: BUNDLE_CONTENT,
                  variables: {bundleContentId: payload?._id},
                },
              ]}>
              {liked => (
                <AntDesign
                  size={20}
                  color={tw.color('black')}
                  name={liked ? 'like1' : 'like2'}
                  style={tw`py-2 px-3`}
                />
              )}
            </CCLikeButton>
            <CCBookmarkButton
              refId={payload?._id}
              type={payload?.__typename}
              subType={payload?.media?.__typename}
              initial={payload?.bookmarked === 1 ? true : false}
              refetchQueries={[
                {
                  query: BUNDLE_CONTENT,
                  variables: {bundleContentId: payload?._id},
                },
              ]}>
              {bookmarked => (
                <FontAwesome
                  size={20}
                  color={tw.color('black')}
                  name={bookmarked ? 'bookmark' : 'bookmark-o'}
                  style={tw`py-2 px-3`}
                />
              )}
            </CCBookmarkButton>
            <CCDownloadButton content={payload}>
              {downloaded => (
                <AntDesign
                  size={20}
                  color={tw.color('black')}
                  name={downloaded ? 'check' : 'download'}
                  style={tw`py-2 px-3`}
                />
              )}
            </CCDownloadButton>
          </>
        ),
      });
    }
  }, [navigation, queryData]);

  const data = queryData?.bundleContent?.payload || {};

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
            uri: `${
              __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
            }/${data?.media?.url}`,
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

export default CourseDocumentViewScreen;
