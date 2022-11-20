import {gql} from '@apollo/client';
import {CORE_HEADLINE_FIELDS} from '../fragments';

export const HEADLINES = gql`
  ${CORE_HEADLINE_FIELDS}
  query headlines($offset: Int, $limit: Int) {
    headlines(offset: $offset, limit: $limit) {
      code
      success
      message
      token
      offset
      limit
      payload {
        ...CoreHeadlineFields
      }
    }
  }
`;
