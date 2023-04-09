import {gql} from '@apollo/client';

export const DELETE_TEST = gql`
  mutation deleteTest($testId: ID!) {
    deleteTest(testId: $testId) {
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
        totalMarks
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
