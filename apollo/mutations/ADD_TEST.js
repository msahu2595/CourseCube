import {gql} from '@apollo/client';

export const ADD_TEST = gql`
  mutation addTest($testInput: TestInput!) {
    addTest(testInput: $testInput) {
      payload {
        _id
        title
        thumbnail
        instructions
        duration
        totalMarks
        negativeMark
        enable
        createdAt
        updatedAt
        questions {
          _id
          question
          image
          passage
          options
          mark
          answerIndex
          enable
        }
      }
    }
  }
`;
