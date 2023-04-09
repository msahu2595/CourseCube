import {gql} from '@apollo/client';

export const TEST = gql`
  query test($testId: ID!) {
    test(testId: $testId) {
      code
      success
      message
      token
      payload {
        _id
        title
        thumbnail
        instructions
        duration
        questions {
          _id
          question
          image
          passage
          options
          answerIndex
          mark
          negativeMark
        }
        totalMarks
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
