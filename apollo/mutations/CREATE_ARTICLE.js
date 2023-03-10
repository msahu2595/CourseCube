import {gql} from '@apollo/client';

export const CREATE_ARTICLE = gql`
  mutation CreateArticle($articleInput: ArticleInput!) {
    createArticle(articleInput: $articleInput) {
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
