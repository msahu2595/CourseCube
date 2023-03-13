import {gql} from '@apollo/client';

export const EDIT_TEST = gql`
  mutation EditTest($testId: ID!, $testInput: TestEditInput!) {
    editTest(testId: $testId, testInput: $testInput) {
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
