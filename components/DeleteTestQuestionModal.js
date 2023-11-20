import {tw} from '@lib';
import {Text, View} from 'react-native';
import React, {memo, useState} from 'react';
import {gql, useMutation} from '@apollo/client';
import {showMessage} from 'react-native-flash-message';
import {CCModal, CCButton, CCCheckBox, CCText} from './Common';

const DELETE_TEST_QUESTION = gql`
  mutation deleteTestQuestion($questionId: ID!, $invalid: Boolean!) {
    deleteTestQuestion(questionId: $questionId, invalid: $invalid) {
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

const DeleteTestQuestionModal = memo(({questionId, onClose}) => {
  const [invalid, setInvalid] = useState(false);

  const [deleteTestQuestion, {loading: submitting}] = useMutation(
    DELETE_TEST_QUESTION,
    {
      variables: {questionId, invalid},
      onCompleted: () => {
        onClose();
        showMessage({
          message: 'Test question is successfully deleted.',
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
      title="Delete Test Question"
      visible={!!questionId}
      submitting={submitting}
      onClose={onClose}>
      <>
        <View style={tw`py-2`}>
          <CCText content="Are you sure, you want to delete this test question?" />
          <CCCheckBox
            label="Please tick, if question was invalid."
            checked={invalid}
            onPress={setInvalid}
          />
          <Text style={tw`text-[10px] text-gray-400 font-avReg p-1`}>
            For any invalid question attempted by a user on his/her previous
            test then he/she will get whole marks for this question & will
            automatically update in his/her result.
          </Text>
        </View>
        <CCButton
          label="Delete"
          color="red-600"
          loading={submitting}
          disabled={submitting}
          onPress={deleteTestQuestion}
        />
      </>
    </CCModal>
  );
});

export default DeleteTestQuestionModal;
