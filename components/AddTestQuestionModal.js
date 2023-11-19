import * as yup from 'yup';
import {Formik} from 'formik';
import {tw, uuid} from '@lib';
import {View} from 'react-native';
import React, {memo} from 'react';
import {gql, useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCButton, CCModal, CCTextInput, CCOptionInput} from './Common';

const ADD_TEST_QUESTION = gql`
  mutation addTestQuestion($testId: ID!, $questionInput: TestQuestionInput!) {
    addTestQuestion(testId: $testId, questionInput: $questionInput) {
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
        position
        invalid
        enable
      }
    }
  }
`;

const AddTestQuestionValidationSchema = yup.object({
  question: yup.string().trim().required('Please enter question.'),
  image: yup.string().nullable(),
  passage: yup.string().nullable(),
  options: yup
    .array()
    .of(
      yup.object({
        id: yup.string().nonNullable(),
        option: yup.string().required('Please enter an option.'),
      }),
    )
    .min(2, 'Please add minimum 2 options.')
    .max(6, 'Max 6 options can be added.'),
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

const AddTestQuestionModal = memo(({testId, visible, onClose}) => {
  const [addTestQuestion, {loading: submitting}] = useMutation(
    ADD_TEST_QUESTION,
    {
      onCompleted: () => {
        onClose();
        showMessage({
          message: 'Test question is successfully added.',
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
      title="Add Test Question"
      visible={visible}
      submitting={submitting}
      onClose={onClose}>
      <Formik
        initialValues={{
          question: '',
          image: '',
          passage: '',
          options: [
            {id: uuid(), option: ''},
            {id: uuid(), option: ''},
          ],
          answerIndex: 0,
          mark: '',
          negativeMark: '',
        }}
        validationSchema={AddTestQuestionValidationSchema}
        onSubmit={values => {
          const questionInput = {
            question: values.question,
            options: values.options.map(({option}) => option),
            answerIndex: values.answerIndex,
            mark: parseFloat(values.mark),
            position: 1,
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
          addTestQuestion({variables: {testId, questionInput}});
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
                error={errors.question}
                touched={touched.question}
                onChangeText={handleChange('question')}
                onBlur={handleBlur('question')}
                value={values.question}
                editable={!submitting}
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
                error={errors.options}
                touched={touched.options}
                options={values.options}
                setOptions={newOptions => {
                  setFieldValue('options', newOptions);
                }}
                answerIndex={values.answerIndex}
                setAnswerIndex={newAnswerIndex => {
                  setFieldValue('answerIndex', newAnswerIndex);
                }}
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

export default AddTestQuestionModal;
