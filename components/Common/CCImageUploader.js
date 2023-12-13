import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {tw} from '@lib';
import config from 'react-native-ultimate-config';
import {showMessage} from 'react-native-flash-message';
import Feather from 'react-native-vector-icons/Feather';
import React, {useState, memo, useCallback} from 'react';
import {imageUploader, fileRemover} from 'lib/fileHandler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
    imageProps,
  }) => {
    const [loading, setLoading] = useState(false);

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
        {!loading && !value ? (
          <TouchableOpacity
            onPress={handleUpload}
            disabled={loading || disabled}
            style={tw`flex-row bg-blue-600 py-2 px-4 items-center justify-center rounded-lg self-start`}>
            <Feather name="upload" size={14} color={tw.color('white')} />
            <Text style={tw`pl-2 text-xs text-white font-avReg`}>Upload</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={tw`flex-row items-center justify-between border border-gray-300 rounded-lg`}>
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
              <Text style={tw`flex-1 text-gray-900 font-avReg`}>Hello.png</Text>
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
