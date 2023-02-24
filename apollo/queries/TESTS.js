const {gql} = require('@apollo/client');

export const TESTS = gql`
  query Tests {
    tests {
      code
      filter {
        enable
      }
      limit
      message
      offset
      payload {
        _id
        createdAt
        duration
        enable
        instructions
        negativeMark
        questions {
          _id
          answerIndex
          image
          enable
          mark
          question
          passage
          options
        }
        title
        thumbnail
        totalMarks
        updatedAt
      }
    }
  }
`;
