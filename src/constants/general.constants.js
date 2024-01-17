export const environmentVariables = {
  github_username: process.env.GH_USERNAME,
  github_token: process.env.GH_TOKEN,
  github_graphql_endpoint: process.env.GH_GRAPHQL_ENDPOINT,
};

export const defaultLimitPerPage = 10;

export const svgAnimationDelay = 200;

export const templateVariables = {
  progress: '{{ progress }}',
  lang_list: '{{ lang_list }}',
}

export const defaultLanguageColor = '#000000';
