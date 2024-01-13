import {
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {tw} from '@lib';
import {useGenderImage} from 'hooks';
import {imageUploader} from 'lib/fileHandler';
import config from 'react-native-ultimate-config';
import {loggedUserVar, storage} from 'apollo/client';
import {showMessage} from 'react-native-flash-message';
import {gql, useMutation, useReactiveVar} from '@apollo/client';
import React, {memo, useCallback, useRef, useState} from 'react';
import {BottomModal, ModalContent, ModalPortal} from 'react-native-modals';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ADD_PROFILE_IMAGE = gql`
  mutation addProfileImage($picture: String!) {
    addProfileImage(picture: $picture) {
      code
      success
      message
      token
      refresh
      payload {
        __typename
        picture
      }
    }
  }
`;

const REMOVE_PROFILE_IMAGE = gql`
  mutation removeProfileImage {
    removeProfileImage {
      code
      success
      message
      token
      refresh
      payload {
        __typename
        picture
      }
    }
  }
`;

const UserProfileImage = memo(({editable = true, size = 108}) => {
  const loggedUser = useReactiveVar(loggedUserVar);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const viewImageModalRef = useRef(null);
  const bottomModalRef = useRef(null);

  const [addProfileImage] = useMutation(ADD_PROFILE_IMAGE, {
    onCompleted: data => {
      storage.set(
        'user',
        JSON.stringify({
          ...loggedUser,
          ...data?.addProfileImage?.payload,
        }),
      );
      loggedUserVar({
        ...loggedUser,
        ...data?.addProfileImage?.payload,
      });
      setLoading(false);
      showMessage({
        message: 'Your profile picture successfully added.',
        type: 'success',
        icon: 'success',
      });
    },
    onError: err => {
      setLoading(false);
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
        icon: 'danger',
      });
    },
  });

  const [removeProfileImage] = useMutation(REMOVE_PROFILE_IMAGE, {
    onCompleted: data => {
      storage.set(
        'user',
        JSON.stringify({
          ...loggedUser,
          ...data?.removeProfileImage?.payload,
        }),
      );
      loggedUserVar({
        ...loggedUser,
        ...data?.removeProfileImage?.payload,
      });
      setLoading(false);
      showMessage({
        message: 'Your profile picture successfully removed.',
        type: 'success',
        icon: 'success',
      });
    },
    onError: err => {
      setLoading(false);
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
        icon: 'danger',
      });
    },
  });

  const handleAddImage = useCallback(async () => {
    setOpen(false);
    try {
      setLoading(true);
      const result = await imageUploader();
      addProfileImage({variables: {picture: result.path}});
    } catch (error) {
      setLoading(false);
      showMessage({
        message: error?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
        icon: 'danger',
      });
    }
  }, [addProfileImage]);

  const handleRemoveImage = useCallback(() => {
    setOpen(false);
    Alert.alert(
      'Warning',
      'Are you sure, you want to remove your profile picture?',
      [
        {
          text: 'Yes',
          style: 'default',
          onPress: () => {
            setLoading(true);
            removeProfileImage();
          },
        },
        {
          text: 'No',
          style: 'cancel',
          isPreferred: true,
        },
      ],
    );
  }, [removeProfileImage]);

  const handleViewImage = useCallback(() => {
    setOpen(false);
    viewImageModalRef.current = ModalPortal.show(
      <View>
        <Image
          source={{
            uri: `${
              __DEV__ ? config.REACT_APP_DEV_URI : config.REACT_APP_PROD_URI
            }/${loggedUser?.picture}`,
          }}
          style={tw`w-[256px] h-[256px]`}
        />
        <TouchableOpacity
          style={tw`bg-black py-2 items-center justify-center`}
          onPress={() => {
            ModalPortal.dismiss(viewImageModalRef.current);
          }}>
          <Text style={tw`font-avSemi text-xs text-gray-100`}>Close</Text>
        </TouchableOpacity>
      </View>,
    );
  }, [loggedUser?.picture]);

  const toggleMenu = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const imageByGender = useGenderImage(loggedUser?.gender);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={toggleMenu}
        disabled={loading || !editable}
        style={tw`relative w-[${size}px] h-[${size}px]`}>
        <Image
          source={
            loggedUser?.picture
              ? {
                  uri: `${
                    __DEV__
                      ? config.REACT_APP_DEV_URI
                      : config.REACT_APP_PROD_URI
                  }/${loggedUser?.picture}`,
                }
              : imageByGender
          }
          onError={error => {
            if (error?.nativeEvent?.error?.includes('code=404')) {
              setLoading(true);
              removeProfileImage();
            }
          }}
          style={tw`rounded-full border border-gray-400 w-[${size - 1}px] h-[${
            size - 1
          }px]`}
        />
        {loading ? (
          <View
            style={tw`absolute inset-0 justify-center bg-black opacity-50 rounded-full`}>
            <ActivityIndicator size="large" color={tw.color('white')} />
          </View>
        ) : editable ? (
          <View style={tw`absolute right-0 bottom-2 bg-white rounded-full`}>
            <MaterialCommunityIcons
              size={15 + size / 12}
              name="pencil-circle"
              color={tw.color('blue-600')}
            />
          </View>
        ) : null}
      </TouchableOpacity>
      <BottomModal
        ref={bottomModalRef}
        visible={open}
        onTouchOutside={() => {
          setOpen(false);
        }}>
        <ModalContent style={tw`p-0`}>
          <MenuItem
            label={'Add/Change profile picture'}
            onPress={handleAddImage}
          />
          {loggedUser?.picture ? (
            <>
              <MenuItem
                label={'Remove profile picture'}
                onPress={handleRemoveImage}
              />
              <MenuItem
                label={'View profile picture'}
                onPress={handleViewImage}
              />
            </>
          ) : null}
        </ModalContent>
      </BottomModal>
    </>
  );
});

const MenuItem = memo(({label, onPress, positive, danger}) => {
  return (
    <TouchableOpacity
      style={tw`px-6 py-4 border-b border-gray-100`}
      onPress={onPress}>
      <Text
        style={tw`font-avSemi text-xs ${
          danger ? 'text-red-600' : positive ? 'text-blue-600' : 'text-gray-600'
        }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});

export default UserProfileImage;
