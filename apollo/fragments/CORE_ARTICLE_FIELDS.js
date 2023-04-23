import {gql} from '@apollo/client';

export const CORE_ARTICLE_FIELDS = gql`
  fragment CoreArticleFields on Article {
    __typename
    _id
    subject
    tags
    image
    title
    description
    author
    sources
    visible
    enable
    createdAt
    updatedAt
    likes
    liked
    bookmarked
  }
`;
