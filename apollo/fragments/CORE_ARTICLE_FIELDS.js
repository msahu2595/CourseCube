import {gql} from '@apollo/client';

export const CORE_ARTICLE_FIELDS = gql`
  fragment CoreArticleFields on Article {
    __typename
    _id
    image
    title
    description
    author
    tags
    sources
    visible
    enable
    likes
    createdAt
    updatedAt
  }
`;
