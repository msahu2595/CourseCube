import {gql} from '@apollo/client';
import {CORE_QUESTION_FIELDS} from '@fragments';

export const QUESTION = gql`
  ${CORE_QUESTION_FIELDS}
  query question($questionId: ID!) {
    question(questionId: $questionId) {
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
