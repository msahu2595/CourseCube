import {gql} from '@apollo/client';

export const ADD_TEST = gql`
  mutation addTest($testInput: TestInput!) {
    addTest(testInput: $testInput) {
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
