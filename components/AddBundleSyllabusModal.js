import {tw} from '@lib';
import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import {View} from 'react-native';
import {gql, useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCCheckBox, CCModal, CCTextInput} from './Common';
import {BUNDLE_SYLLABUS} from 'screens/AdminScreens/AdminCourseSyllabusScreen';

const ADD_BUNDLE_SYLLABUS = gql`
  mutation addBundleSyllabus(
    $bundleId: ID!
    $syllabusInput: BundleSyllabusInput!
  ) {
    addBundleSyllabus(bundleId: $bundleId, syllabusInput: $syllabusInput) {
      code
      success
      message
      token
      payload
    }
  }
`;

const ValidationSchema = yup.object().shape({
  subjectName: yup.string().required('Please enter subject name.'),
  isSection: yup.boolean().required(),
});

const AddBundleSyllabusModal = ({bundleId, data, onClose}) => {
  const [addBundleSyllabus, {loading: submitting}] = useMutation(
    ADD_BUNDLE_SYLLABUS,
    {
      onCompleted: () => {
        onClose();
        showMessage({
          message: 'Subject/chapter successfully added.',
          type: 'success',
        });
      },
      onError: err => {
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
        });
      },
      refetchQueries: [{query: BUNDLE_SYLLABUS, variables: {bundleId}}],
    },
  );

  return (
    <CCModal
      title="Add Subject/Chapter"
      visible={!!data}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          subjectName: '',
          isSection: false,
        }}
        validationSchema={ValidationSchema}
        onSubmit={values => {
          const syllabusInput = {
            subjectName: values.subjectName,
          };
          if (data?.subjectIds?.length > 0) {
            syllabusInput.subjectIds = data?.subjectIds;
          }
          if (values.isSection) {
            syllabusInput.isSection = values.isSection;
          }
          addBundleSyllabus({variables: {bundleId, syllabusInput}});
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
              <CCTextInput
                required
                label="Subject Name"
                error={errors.subjectName}
                touched={touched.subjectName}
                onChangeText={handleChange('subjectName')}
                onBlur={handleBlur('subjectName')}
                value={values.subjectName}
                editable={!submitting}
              />
              <CCCheckBox
                label="If ticked, this will act as a chapter & you will able to add multiple subject or chapter into it."
                checked={values.isSection}
                onPress={value => {
                  setFieldValue('isSection', value);
                }}
              />
            </View>
            <CCButton
              label="Submit"
              loading={submitting}
              disabled={submitting}
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </CCModal>
  );
};

export default AddBundleSyllabusModal;
