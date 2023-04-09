import {gql} from '@apollo/client';

export const CREATE_ARTICLE = gql`
  mutation createArticle($articleInput: ArticleInput!) {
    createArticle(articleInput: $articleInput) {
      code
      success
      message
      token
      payload {
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
    }
  }
`;
