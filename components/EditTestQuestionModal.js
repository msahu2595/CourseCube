import * as yup from 'yup';
import {Formik} from 'formik';
import {tw, uuid} from '@lib';
import {View} from 'react-native';
import React, {memo} from 'react';
import {gql, useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCModal, CCTextInput, CCOptionInput} from './Common';

const EDIT_TEST_QUESTION = gql`
  mutation editTestQuestion(
    $questionId: ID!
    $questionInput: TestQuestionEditInput!
  ) {
    editTestQuestion(questionId: $questionId, questionInput: $questionInput) {
      code
      success
      message
      token
      payload {
        _id
        question
        image
        passage
        options
        answerIndex
        mark
        negativeMark
        invalid
        enable
      }
    }
  }
`;

const EditTestQuestionValidationSchema = yup.object({
  image: yup.string().nullable(),
  passage: yup.string().nullable(),
  answerIndex: yup
    .number()
    .min(0)
    .max(5)
    .required('Please select any option as an answer.'),
  mark: yup
    .number()
    .positive('Mark should be a positive value.')
    .required("Please enter question's marks."),
  negativeMark: yup.number().min(0).nullable(),
});

const EditTestQuestionModal = memo(({question, onClose}) => {
  const [editTestQuestion, {loading: submitting}] = useMutation(
    EDIT_TEST_QUESTION,
    {
      onCompleted: () => {
        onClose();
        showMessage({
          message: 'Test question is successfully edited.',
          type: 'success',
        });
      },
      onError: err => {
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
        });
      },
      refetchQueries: ['testQuestions'],
    },
  );

  return (
    <CCModal
      title="Edit Test Question"
      visible={!!question}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          question: question?.question,
          image: question?.image,
          passage: question?.passage,
          options: question?.options?.map(option => ({id: uuid(), option})),
          answerIndex: question?.answerIndex,
          mark: question?.mark ? `${question?.mark}` : '',
          negativeMark: question?.negativeMark
            ? `${question?.negativeMark}`
            : '',
        }}
        validationSchema={EditTestQuestionValidationSchema}
        onSubmit={values => {
          const questionInput = {
            answerIndex: values.answerIndex,
            mark: parseFloat(values.mark),
          };
          if (values.image) {
            questionInput.image = values.image;
          }
          if (values.passage) {
            questionInput.passage = values.passage;
          }
          if (values.negativeMark) {
            questionInput.negativeMark = parseFloat(values.negativeMark);
          }
          editTestQuestion({
            variables: {questionId: question._id, questionInput},
          });
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
                label="Question"
                value={values.question}
                info="You cannot change question."
                editable={false}
              />
              <CCTextInput
                label="Image"
                error={errors.image}
                touched={touched.image}
                info="Example: https://picsum.photos/195/110"
                onChangeText={handleChange('image')}
                onBlur={handleBlur('image')}
                value={values.image}
                editable={!submitting}
                autoCapitalize="none"
                inputMode="url"
              />
              <CCTextInput
                label="Passage"
                error={errors.passage}
                touched={touched.passage}
                onChangeText={handleChange('passage')}
                onBlur={handleBlur('passage')}
                value={values.passage}
                editable={!submitting}
                multiline={true}
                numberOfLines={4}
              />
              <CCOptionInput
                required
                label="Options"
                options={values.options}
                answerIndex={values.answerIndex}
                setAnswerIndex={newAnswerIndex => {
                  setFieldValue('answerIndex', newAnswerIndex);
                }}
                info="You cannot change the options but you can change answer of this question."
                editable={false}
                disabled={submitting}
              />
              <CCTextInput
                required
                label="Mark"
                error={errors.mark}
                touched={touched.mark}
                onChangeText={handleChange('mark')}
                onBlur={handleBlur('mark')}
                value={values.mark}
                editable={!submitting}
              />
              <CCTextInput
                label="Negative mark"
                error={errors.negativeMark}
                touched={touched.negativeMark}
                onChangeText={handleChange('negativeMark')}
                onBlur={handleBlur('negativeMark')}
                value={values.negativeMark}
                editable={!submitting}
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
});

export default EditTestQuestionModal;
