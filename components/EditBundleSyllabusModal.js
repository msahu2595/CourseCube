import {tw} from '@lib';
import React from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import {View} from 'react-native';
import {gql, useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCCheckBox, CCModal, CCTextInput} from './Common';
import {BUNDLE_SYLLABUS} from 'screens/AdminScreens/AdminCourseSyllabusScreen';

const EDIT_BUNDLE_SYLLABUS = gql`
  mutation editBundleSyllabus(
    $bundleId: ID!
    $syllabusInput: BundleSyllabusEditInput!
  ) {
    editBundleSyllabus(bundleId: $bundleId, syllabusInput: $syllabusInput) {
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

const EditBundleSyllabusModal = ({bundleId, data, onClose}) => {
  const [editBundleSyllabus, {loading: submitting}] = useMutation(
    EDIT_BUNDLE_SYLLABUS,
    {
      onCompleted: () => {
        onClose();
        showMessage({
          message: 'Subject/chapter successfully edited.',
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
      title="Edit Subject/Chapter"
      visible={!!data}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          subjectName: data?.subjectName,
          isSection: data?.isSection,
        }}
        validationSchema={ValidationSchema}
        onSubmit={values => {
          const syllabusInput = {
            subjectId: data?.subjectId,
            subjectName: values.subjectName,
          };
          if (data?.subjectIds?.length > 0) {
            syllabusInput.subjectIds = data?.subjectIds;
          }
          if (data?.isSection !== values.isSection) {
            syllabusInput.isSection = values.isSection;
          }
          editBundleSyllabus({variables: {bundleId, syllabusInput}});
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

export default EditBundleSyllabusModal;
