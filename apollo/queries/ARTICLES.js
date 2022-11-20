import {gql} from '@apollo/client';
import {CORE_ARTICLE_FIELDS} from '../fragments';

export const ARTICLES = gql`
  ${CORE_ARTICLE_FIELDS}
  query articles(
    $offset: Int
    $limit: Int
    $search: String
    $filter: ArticlesFilterInput
  ) {
    articles(offset: $offset, limit: $limit, search: $search, filter: $filter) {
      code
      success
      message
      token
      offset
      limit
      search
      filter {
        author
        tag
        visible
        enable
      }
      payload {
        ...CoreArticleFields
      }
    }
  }
`;
