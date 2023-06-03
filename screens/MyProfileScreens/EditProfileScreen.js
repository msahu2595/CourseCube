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
    .max(320, 'Too long!!'),
  education: yup.string().max(80, 'Too long!!'),
  workAt: yup.string().max(80, 'Too long!!'),
  workAs: yup.string().max(80, 'Too long!!'),
  pincode: yup
    .string()
    .matches(/^[1-9]{1}[0-9]{5}$/, 'Please enter valid pincode.')
    .max(80, 'Too long!!'),
  country: yup.string().max(80, 'Too long!!'),
  state: yup.string().max(80, 'Too long!!'),
  district: yup.string().max(80, 'Too long!!'),
  cityVillage: yup.string().max(80, 'Too long!!'),
  area: yup.string().max(80, 'Too long!!'),
  street: yup.string().max(80, 'Too long!!'),
  landmark: yup.string().max(80, 'Too long!!'),
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
            education: loggedUser?.education ?? '',
            workAt: loggedUser?.workAt ?? '',
            workAs: loggedUser?.workAs ?? '',
            pincode: loggedUser?.pincode ?? '',
            country: loggedUser?.country ?? '',
            state: loggedUser?.state ?? '',
            district: loggedUser?.district ?? '',
            cityVillage: loggedUser?.cityVillage ?? '',
            area: loggedUser?.area ?? '',
            street: loggedUser?.street ?? '',
            landmark: loggedUser?.landmark ?? '',
          }}
          validationSchema={EditProfileValidationSchema}
          onSubmit={values => {
            console.log({values});
            const userInput = {about: values.about};
            if (values.picture) {
              userInput.picture = values.picture;
            }
            if (values.education) {
              userInput.education = values.education;
            }
            if (values.workAt) {
              userInput.workAt = values.workAt;
            }
            if (values.workAs) {
              userInput.workAs = values.workAs;
            }
            if (values.pincode) {
              userInput.pincode = values.pincode;
            }
            if (values.country) {
              userInput.country = values.country;
            }
            if (values.state) {
              userInput.state = values.state;
            }
            if (values.district) {
              userInput.district = values.district;
            }
            if (values.cityVillage) {
              userInput.cityVillage = values.cityVillage;
            }
            if (values.area) {
              userInput.area = values.area;
            }
            if (values.street) {
              userInput.street = values.street;
            }
            if (values.landmark) {
              userInput.landmark = values.landmark;
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
              <View style={tw`pt-2 pb-4`}>
                <View style={tw`items-center justify-center py-2`}>
                  <CCImageUploader
                    name={loggedUser._id}
                    gender={loggedUser.gender}
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
                    {label: 'Others   ', value: 'UNKNOWN'},
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
                <CCTextInput
                  label="Education"
                  error={errors.education}
                  touched={touched.education}
                  onChangeText={handleChange('education')}
                  onBlur={handleBlur('education')}
                  value={values.education}
                  editable={!submitting}
                />
                <CCTextInput
                  label="Work At"
                  error={errors.workAt}
                  touched={touched.workAt}
                  onChangeText={handleChange('workAt')}
                  onBlur={handleBlur('workAt')}
                  value={values.workAt}
                  editable={!submitting}
                />
                <CCTextInput
                  label="Work As"
                  error={errors.workAs}
                  touched={touched.workAs}
                  onChangeText={handleChange('workAs')}
                  onBlur={handleBlur('workAs')}
                  value={values.workAs}
                  editable={!submitting}
                />
                <CCTextInput
                  label="Pincode"
                  error={errors.pincode}
                  touched={touched.pincode}
                  onChangeText={value => {
                    console.log(value);
                    setFieldValue('pincode', value);
                    if (value?.length >= 6) {
                      fetch(`https://api.postalpincode.in/pincode/${value}`, {
                        method: 'get',
                      })
                        .then(response => response.json())
                        .then(response => {
                          const data = response[0]?.PostOffice[0];
                          setFieldValue('country', data?.Country);
                          setFieldValue('state', data?.State);
                          setFieldValue('district', data?.District);
                        })
                        .catch(err => {
                          console.log(err?.message);
                        });
                    }
                  }}
                  onBlur={handleBlur('pincode')}
                  value={values.pincode}
                  editable={!submitting}
                />
                <CCTextInput
                  label="Country"
                  value={values.country}
                  editable={false}
                />
                <CCTextInput
                  label="State"
                  value={values.state}
                  editable={false}
                />
                <CCTextInput
                  label="District"
                  value={values.district}
                  editable={false}
                />
                <CCTextInput
                  label="City/Village"
                  error={errors.cityVillage}
                  touched={touched.cityVillage}
                  onChangeText={handleChange('cityVillage')}
                  onBlur={handleBlur('cityVillage')}
                  value={values.cityVillage}
                  editable={!submitting}
                />
                <CCTextInput
                  label="Area"
                  error={errors.area}
                  touched={touched.area}
                  onChangeText={handleChange('area')}
                  onBlur={handleBlur('area')}
                  value={values.area}
                  editable={!submitting}
                />
                <CCTextInput
                  label="Street"
                  error={errors.street}
                  touched={touched.street}
                  onChangeText={handleChange('street')}
                  onBlur={handleBlur('street')}
                  value={values.street}
                  editable={!submitting}
                />
                <CCTextInput
                  label="Landmark"
                  error={errors.landmark}
                  touched={touched.landmark}
                  onChangeText={handleChange('landmark')}
                  onBlur={handleBlur('landmark')}
                  value={values.landmark}
                  editable={!submitting}
                />
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
