import {gql} from '@apollo/client';
import {CORE_QUESTION_FIELDS} from '@fragments';

export const QUESTIONS = gql`
  ${CORE_QUESTION_FIELDS}
  query questions(
    $offset: Int
    $limit: Int
    $search: String
    $filter: QuestionFilterInput
  ) {
    questions(
      offset: $offset
      limit: $limit
      search: $search
      filter: $filter
    ) {
      code
      success
      message
      token
      limit
      offset
      search
      filter {
        userId
        verified
        enable
      }
      payload {
        ...CoreQuestionFields
        user {
          __typename
          _id
          fullName
          picture
        }
      }
    }
  }
`;
