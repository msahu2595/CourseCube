import {gql} from '@apollo/client';

export const EDIT_ARTICLE = gql`
  mutation editArticle($articleId: ID!, $articleInput: ArticleInput!) {
    editArticle(articleId: $articleId, articleInput: $articleInput) {
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
