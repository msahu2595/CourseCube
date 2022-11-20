import {gql} from '@apollo/client';
import {CORE_ARTICLE_FIELDS} from '@fragments';

export const ARTICLE = gql`
  ${CORE_ARTICLE_FIELDS}
  query article($articleId: ID!) {
    article(articleId: $articleId) {
      code
      success
      message
      token
      payload {
        ...CoreArticleFields
      }
    }
  }
`;
