import { createApolloClient } from "@app/lib/apollo";
import { GET_GH_LANGUAGES, GET_GH_STATS } from "@app/graphql/github";
import { GITHUB_USERNAME } from "@app/constants/github";
import { GQLService } from "@app/lib/apollo";

const client = createApolloClient(GQLService.Github);

export const getGithubStats = async (username?: string) => {
  try {
    const { data } = await client.query({
      query: GET_GH_STATS,
      variables: {
        login: username || GITHUB_USERNAME,
      },
    });
    return data;
  } catch (error) {
    console.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    throw error;
  }
};

export const getGithubLanguages = async (username?: string) => {
  try {
    const { data } = await client.query({
      query: GET_GH_LANGUAGES,
      variables: {
        login: username || GITHUB_USERNAME,
        languagesFirst2: 2,
      },
    });
    return data;
  } catch (error) {
    console.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    throw error;
  }
};
