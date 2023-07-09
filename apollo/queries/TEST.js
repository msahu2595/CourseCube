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
        questions
        totalMarks
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
