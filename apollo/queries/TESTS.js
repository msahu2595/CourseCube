const {gql} = require('@apollo/client');

export const TESTS = gql`
  query Tests {
    tests {
      payload {
        _id
        title
        thumbnail
        instructions
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
        duration
        totalMarks
        negativeMark
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
