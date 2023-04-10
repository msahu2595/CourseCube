import {gql} from '@apollo/client';

export const EDIT_TEST = gql`
  mutation editTest($testId: ID!, $testInput: TestInput!) {
    editTest(testId: $testId, testInput: $testInput) {
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
