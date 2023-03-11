import {gql} from '@apollo/client';

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($articleId: ID!) {
    deleteArticle(articleId: $articleId) {
      payload {
        _id
        title
        description
        author
        visible
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
