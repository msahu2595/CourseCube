import {gql} from '@apollo/client';

export const CORE_ANSWER_FIELDS = gql`
  fragment CoreAnswerFields on Answer {
    __typename
    _id
    user {
      __typename
      _id
      fullName
      picture
    }
    question {
      __typename
      _id
    }
    answer
    image
    link
    route
    params
    likes
    message
    verified
    edited
    enable
    createdAt
    updatedAt
  }
`;
