import {gql} from '@apollo/client';
import {CORE_ANSWER_FIELDS} from '@fragments';

export const ANSWERS = gql`
  ${CORE_ANSWER_FIELDS}
  query answers($offset: Int, $limit: Int, $questionId: ID!) {
    answers(offset: $offset, limit: $limit, questionId: $questionId) {
      code
      success
      message
      token
      limit
      offset
      payload {
        ...CoreAnswerFields
      }
    }
  }
`;
