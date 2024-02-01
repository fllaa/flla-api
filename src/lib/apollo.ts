import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  HttpOptions,
} from "@apollo/client/core";

import { GITHUB_API_URL, GITHUB_TOKEN } from "@app/constants/github";

export enum GQLService {
  Github = "github",
}

export const createApolloClient = (service: GQLService) => {
  const httpOptions: HttpOptions = {};

  switch (service) {
    case GQLService.Github:
      httpOptions.uri = GITHUB_API_URL;
      httpOptions.headers = {
        Authorization: `bearer ${GITHUB_TOKEN}`,
      };
      break;
    default:
      throw new Error(`Unknown service ${service}`);
  }

  return new ApolloClient({
    link: new HttpLink(httpOptions),
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });
};
