import {gql} from '@apollo/client';

export const CORE_QUESTION_FIELDS = gql`
  fragment CoreQuestionFields on Question {
    __typename
    _id
    title
    description
    image
    options
    answerIndex
    tags
    link
    route
    params
    liked
    likes
    bookmarked
    bookmarks
    answered
    answers
    views
    message
    verified
    edited
    enable
    createdAt
    updatedAt
  }
`;
