import {gql} from '@apollo/client';
import {CORE_HEADLINE_FIELDS} from '../fragments';

export const HEADLINES = gql`
  ${CORE_HEADLINE_FIELDS}
  query headlines(
    $offset: Int
    $limit: Int
    $search: String
    $filter: HeadlinesFilterInput
  ) {
    headlines(
      offset: $offset
      limit: $limit
      search: $search
      filter: $filter
    ) {
      code
      success
      message
      token
      offset
      limit
      search
      filter {
        enable
      }
      payload {
        ...CoreHeadlineFields
      }
    }
  }
`;
