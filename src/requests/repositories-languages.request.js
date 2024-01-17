import axios from 'axios';

import { defaultLimitPerPage, environmentVariables } from '../constants/general.constants.js';

export const fetchRepositoriesLanguages = async (username, repositoryCursor = null) => {
  try {
    const { data: userInformation } = await axios({
      method: 'POST',
      url: environmentVariables.github_graphql_endpoint,
      headers: {
        Authorization: `token ${environmentVariables.github_token}`,
      },
      data: {
        query: `query userInfo (
          $username: String!,
          $repository_cursor: String,
          $default_limit_per_page: Int!
        ) {
          user(login: $username) {
            repositories(
              first: $default_limit_per_page,
              orderBy: {
                field: UPDATED_AT,
                direction: DESC
              },
              isFork: false,
              after: $repository_cursor
            ) {
              totalCount
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                nameWithOwner
                stargazers {
                  totalCount
                }
                forkCount
                languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                  edges {
                    size
                    node {
                      name
                      color
                    }
                  }
                }
              }
            }
          }
        }`,
        variables: {
          username,
          repository_cursor: repositoryCursor,
          default_limit_per_page: defaultLimitPerPage,
        },
      },
    });

    return userInformation.data.user;
  } catch (error) {
    throw new Error('Error fetching user information');
  }
}
