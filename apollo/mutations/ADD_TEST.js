import {gql} from '@apollo/client';

export const ADD_TEST = gql`
  mutation AddTest($testInput: TestInput!) {
    addTest(testInput: $testInput) {
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
