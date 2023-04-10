import {gql} from '@apollo/client';

export const DELETE_ARTICLE = gql`
  mutation deleteArticle($articleId: ID!) {
    deleteArticle(articleId: $articleId) {
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
