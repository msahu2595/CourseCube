import {gql} from '@apollo/client';
import {CORE_ANSWER_FIELDS} from '@fragments';

export const CREATE_ANSWER = gql`
  ${CORE_ANSWER_FIELDS}
  mutation createAnswer($questionId: ID!, $answerInput: AnswerInput) {
    createAnswer(questionId: $questionId, answerInput: $answerInput) {
      code
      success
      message
      token
      payload {
        ...CoreAnswerFields
      }
    }
  }
`;
