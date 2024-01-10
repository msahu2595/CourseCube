import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {tw} from '@lib';
import {gql, useMutation} from '@apollo/client';
import config from 'react-native-ultimate-config';
import {showMessage} from 'react-native-flash-message';
import Feather from 'react-native-vector-icons/Feather';
import React, {useState, memo, useCallback} from 'react';
import {imageUploader, fileRemover} from 'lib/fileHandler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const COPY_IMAGE = gql`
  mutation copyImage($imagePath: String!) {
    copyImage(imagePath: $imagePath) {
      code
      success
      message
      token
      payload
    }
  }
`;

export const CCImageUploader = memo(
  ({
    label,
    info,
    required = false,
    error,
    touched,
    disabled = false,
    onChangeImage,
    value,
    prevImage,
    copyImage = '',
    imageProps,
  }) => {
    const [loading, setLoading] = useState(false);

    const [handleCopy, {loading: copying}] = useMutation(COPY_IMAGE, {
      variables: {imagePath: copyImage},
      onCompleted: data => {
        onChangeImage(data?.copyImage?.payload);
      },
    });

    const handleUpload = useCallback(async () => {
      try {
        setLoading(true);
        const result = await imageUploader(imageProps);
        console.log({result});
        onChangeImage(result.path);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
          icon: 'danger',
        });
      }
    }, [imageProps, onChangeImage]);

    const handleDelete = useCallback(async () => {
      try {
        setLoading(true);
        const result = await fileRemover(value);
        console.log({result});
        onChangeImage('');
        setLoading(false);
      } catch (err) {
        setLoading(false);
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
          icon: 'danger',
        });
      }
    }, [value, onChangeImage]);

    return (
      <View style={tw`mb-1`}>
        <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>
          {label}
          {required && <Text style={tw`text-red-600`}>*</Text>}
        </Text>
        {prevImage ? (
          <View style={tw`mb-1 border border-gray-300 rounded-lg`}>
            <Text style={tw`flex-1 text-gray-900 font-avReg text-[12px] pl-1`}>
              Current image:
            </Text>
            <View style={tw`flex-1 flex-row items-center`}>
              <View style={tw`h-[96px] w-[96px] bg-gray-600 m-1`}>
                <Image
                  source={{
                    uri: `${
                      __DEV__
                        ? config.REACT_APP_DEV_URI
                        : config.REACT_APP_PROD_URI
                    }/${prevImage}`,
                  }}
                  resizeMode="contain"
                  style={tw`h-[96px] w-[96px]`}
                />
              </View>
              <Text style={tw`flex-1 text-gray-900 font-avReg`}>
                {prevImage?.split('/')?.[2]}
              </Text>
            </View>
          </View>
        ) : null}
        {!loading && !value ? (
          <>
            {copyImage ? (
              <View style={tw`mb-1 border border-gray-300 rounded-lg`}>
                <Text
                  style={tw`flex-1 text-gray-900 font-avReg text-[12px] pl-1`}>
                  Available image to copy:
                </Text>
                <View style={tw`flex-row items-center justify-between`}>
                  <View style={tw`flex-1 flex-row items-center`}>
                    <View
                      style={tw`h-[96px] w-[96px] bg-gray-600 justify-center m-1`}>
                      <Image
                        source={{
                          uri: `${
                            __DEV__
                              ? config.REACT_APP_DEV_URI
                              : config.REACT_APP_PROD_URI
                          }/${copyImage}`,
                        }}
                        resizeMode="contain"
                        style={tw`h-[96px] w-[96px]`}
                      />
                    </View>
                    <Text style={tw`flex-1 text-gray-900 font-avReg`}>
                      {copyImage?.split('/')?.[2]}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleCopy}
                    disabled={copying || disabled}
                    style={tw`bg-blue-600 justify-center py-2 px-2 mx-1 rounded-lg`}>
                    <MaterialCommunityIcons
                      name="content-copy"
                      size={24}
                      color={tw.color('white')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={handleUpload}
              disabled={copying || disabled}
              style={tw`flex-row bg-blue-600 py-2 px-4 items-center justify-center rounded-lg self-start`}>
              <Feather name="upload" size={14} color={tw.color('white')} />
              <Text style={tw`pl-2 text-xs text-white font-avReg`}>Upload</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={tw`border border-gray-300 rounded-lg`}>
            <Text style={tw`flex-1 text-gray-900 font-avReg text-[12px] pl-1`}>
              Uploaded image:
            </Text>
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-1 flex-row items-center`}>
                <View
                  style={tw`h-[96px] w-[96px] bg-gray-600 justify-center m-1`}>
                  {value ? (
                    <Image
                      source={{
                        uri: `${
                          __DEV__
                            ? config.REACT_APP_DEV_URI
                            : config.REACT_APP_PROD_URI
                        }/${value}`,
                      }}
                      resizeMode="contain"
                      style={tw`h-[96px] w-[96px]`}
                    />
                  ) : loading ? (
                    <ActivityIndicator
                      size="large"
                      color={tw.color('blue-600')}
                    />
                  ) : null}
                </View>
                <Text style={tw`flex-1 text-gray-900 font-avReg`}>
                  {value?.split('/')?.[2]}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleDelete}
                disabled={loading || disabled}
                style={tw`bg-blue-600 justify-center py-2 px-2 mx-1 rounded-lg`}>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={24}
                  color={tw.color('white')}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {info ? (
          <Text style={tw`text-[10px] text-gray-400 font-avReg p-1`}>
            {info}
          </Text>
        ) : null}
        {error && touched ? (
          <Text style={tw`text-sm text-red-600 font-avReg p-1`}>{error}</Text>
        ) : null}
      </View>
    );
  },
);
