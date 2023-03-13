import {gql} from '@apollo/client';

export const DELETE_TEST = gql`
  mutation DeleteTest($testId: ID!) {
    deleteTest(testId: $testId) {
      payload {
        _id
        title
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
