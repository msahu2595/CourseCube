import {tw} from '@lib';
import React from 'react';
import {
  CCRadio,
  CCButton,
  CCTextInput,
  CCImageUploader,
} from 'components/Common';
import * as yup from 'yup';
import {Formik} from 'formik';
import {View, ScrollView} from 'react-native';
import {loggedUserVar, storage} from 'apollo/client';
import {showMessage} from 'react-native-flash-message';
import {ExampleListItem, SafeAreaContainer} from '@components';
import {gql, useMutation, useReactiveVar} from '@apollo/client';

const EDIT_PROFILE = gql`
  mutation editProfile($userInput: EditProfileInput!) {
    editProfile(userInput: $userInput) {
      code
      success
      message
      token
      refresh
      payload {
        __typename
        _id
        email
        emailVerified
        mobile
        mobileVerified
        fullName
        gender
        picture
        about
        userVerified
        education
        workAt
        workAs
        facebook
        instagram
        twitter
        linkedin
        pincode
        country
        state
        district
        cityVillage
        area
        street
        landmark
        role
        FCMToken
        platform
        acceptTnC
        createdAt
        updatedAt
        followers
        followings
      }
    }
  }
`;

const EditProfileValidationSchema = yup.object({
  picture: yup.string().url('Picture should be a link.'),
  about: yup
    .string()
    .required('Please write something about yourself.')
    .min(7, 'Too short!!')
    .max(320, 'Too big!!'),
});

const EditProfileScreen = () => {
  const loggedUser = useReactiveVar(loggedUserVar);

  const [editProfile, {loading: submitting}] = useMutation(EDIT_PROFILE, {
    onCompleted: data => {
      storage.set(
        'user',
        JSON.stringify({
          ...data?.editProfile?.payload,
          followers: loggedUser?.followers,
          followings: loggedUser?.followings,
        }),
      );
      loggedUserVar({
        ...data?.editProfile?.payload,
        followers: loggedUser?.followers,
        followings: loggedUser?.followings,
      });
      showMessage({
        message: 'Your profile is successfully edited.',
        type: 'success',
        icon: 'success',
      });
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
        icon: 'danger',
      });
    },
  });

  return (
    <SafeAreaContainer
      statusBgColor={tw.color('blue-600')}
      statusBarStyle="light-content">
      <ScrollView contentContainerStyle={tw`px-3 bg-white`}>
        <Formik
          initialValues={{
            picture: loggedUser?.picture ?? '',
            about: loggedUser?.about ?? '',
          }}
          validationSchema={EditProfileValidationSchema}
          onSubmit={values => {
            console.log({values});
            const userInput = {
              about: values.about,
            };
            if (values.picture) {
              userInput.picture = values.picture;
            }
            editProfile({variables: {userInput}});
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <>
              <View style={tw`py-2`}>
                <View style={tw`items-center justify-center py-2`}>
                  <CCImageUploader
                    name={loggedUser._id}
                    gender={values?.gender}
                    value={values?.picture}
                    onUploadImage={value => {
                      setFieldValue('picture', value);
                    }}
                    editable={!submitting}
                  />
                </View>
                <CCTextInput
                  label="Full Name"
                  value={loggedUser?.fullName}
                  editable={false}
                />
                <CCRadio
                  label="Gender"
                  radio_props={[
                    {label: 'Male   ', value: 'MALE'},
                    {label: 'Female   ', value: 'FEMALE'},
                    {label: 'Prefer not to say   ', value: 'UNKNOWN'},
                  ]}
                  value={loggedUser?.gender}
                  disabled={true}
                />
                {loggedUser?.email ? (
                  <CCTextInput
                    label="Email"
                    value={loggedUser?.email}
                    editable={false}
                  />
                ) : null}
                {loggedUser?.mobile ? (
                  <CCTextInput
                    label="Mobile"
                    value={loggedUser?.mobile}
                    editable={false}
                  />
                ) : null}
                <CCTextInput
                  required
                  label="About"
                  error={errors.about}
                  touched={touched.about}
                  placeholder="Write about yourself..."
                  onChangeText={handleChange('about')}
                  onBlur={handleBlur('about')}
                  value={values.about}
                  multiline={true}
                  numberOfLines={4}
                  editable={!submitting}
                />
                {values.about.length < 10 && (
                  <ExampleListItem
                    onPress={value => {
                      setFieldValue('about', value);
                    }}
                  />
                )}
              </View>
              <CCButton
                label="Submit"
                loading={submitting}
                disabled={submitting}
                onPress={() => {
                  console.log(values);
                  handleSubmit();
                }}
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaContainer>
  );
};

export default EditProfileScreen;
