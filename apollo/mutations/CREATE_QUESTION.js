import {gql} from '@apollo/client';
import {CORE_QUESTION_FIELDS} from '@fragments';

export const CREATE_QUESTION = gql`
  ${CORE_QUESTION_FIELDS}
  mutation createQuestion($questionInput: QuestionInput) {
    createQuestion(questionInput: $questionInput) {
      code
      success
      message
      token
      payload {
        ...CoreQuestionFields
      }
    }
  }
`;
