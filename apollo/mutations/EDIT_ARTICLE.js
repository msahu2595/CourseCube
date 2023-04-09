import {gql} from '@apollo/client';

export const EDIT_ARTICLE = gql`
  mutation editArticle($articleId: ID!, $articleInput: ArticleInput!) {
    editArticle(articleId: $articleId, articleInput: $articleInput) {
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
