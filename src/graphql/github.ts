import { gql } from "@apollo/client/core";

export const GET_GH_STATS = gql`
  query Stats($login: String!) {
    user(login: $login) {
      contributionsCollection {
        totalCommitContributions
      }
      repositoriesContributedTo(
        first: 1
        contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
      ) {
        totalCount
      }
      pullRequests(first: 1) {
        totalCount
      }
      openIssues: issues(states: OPEN) {
        totalCount
      }
      closedIssues: issues(states: CLOSED) {
        totalCount
      }
      repositories(
        first: 100
        orderBy: { direction: DESC, field: STARGAZERS }
        ownerAffiliations: OWNER
      ) {
        totalCount
        nodes {
          stargazers {
            totalCount
          }
          name
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const GET_GH_LANGUAGES = gql`
  query Languages($login: String!, $after: String) {
    user(login: $login) {
      repositories(
        ownerAffiliations: OWNER
        isFork: false
        first: 100
        after: $after
      ) {
        nodes {
          name
          languages(
            first: 100
            orderBy: { direction: DESC, field: SIZE }
            after: $after
          ) {
            edges {
              size
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;
