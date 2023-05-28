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
import {gql, useMutation} from '@apollo/client';
import {loggedUserVar, storage} from 'apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CommonActions} from '@react-navigation/native';
import {ExampleListItem, SafeAreaContainer} from '@components';

const CREATE_PROFILE = gql`
  mutation createProfile($userInput: CreateProfileInput!) {
    createProfile(userInput: $userInput) {
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

const CreateProfileValidationSchema = yup.object({
  fullName: yup
    .string()
    .required('Please enter your full name.')
    .min(2, 'Too short!!')
    .max(80, 'Too big!!'),
  gender: yup
    .string()
    .oneOf(
      ['MALE', 'FEMALE', 'UNKNOWN'],
      'Please select one of the following option.',
    )
    .required('Please select your gender.'),
  picture: yup.string().url('Picture should be a link.'),
  about: yup
    .string()
    .required('Please write something about yourself.')
    .min(7, 'Too short!!')
    .max(320, 'Too big!!'),
});

const loggedUser = loggedUserVar();

export const CreateProfileScreen = ({navigation}) => {
  const [createProfile, {loading: submitting}] = useMutation(CREATE_PROFILE, {
    onCompleted: data => {
      storage.set('user', JSON.stringify(data?.createProfile?.payload));
      loggedUserVar(data?.createProfile?.payload);
      showMessage({
        message: 'Your profile is successfully created.',
        type: 'success',
        icon: 'success',
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MainBottomTabNavigator'}],
        }),
      );
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
            fullName: loggedUser?.fullName ?? '',
            gender: loggedUser?.gender ?? 'UNKNOWN',
            picture: loggedUser?.picture ?? '',
            about: loggedUser?.about ?? '',
          }}
          validationSchema={CreateProfileValidationSchema}
          onSubmit={values => {
            console.log({values});
            const userInput = {
              fullName: values.fullName,
              gender: values.gender,
              about: values.about,
            };
            if (values.picture) {
              userInput.picture = values.picture;
            }
            createProfile({variables: {userInput}});
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
                  required
                  label="Full Name"
                  error={errors.fullName}
                  touched={touched.fullName}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  value={values.fullName}
                  editable={!submitting}
                  info="Please be careful, you will be not able to change this in future."
                />
                <CCRadio
                  required
                  label="Gender"
                  radio_props={[
                    {label: 'Male   ', value: 'MALE'},
                    {label: 'Female   ', value: 'FEMALE'},
                    {label: 'Prefer not to say   ', value: 'UNKNOWN'},
                  ]}
                  value={values.gender}
                  onPress={value => {
                    setFieldValue('gender', value);
                  }}
                  info="Please be careful, you will be not able to change this in future."
                />
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
