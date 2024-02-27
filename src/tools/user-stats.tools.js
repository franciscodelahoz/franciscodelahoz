import { roundNumber } from './data-type.tools.js';
import { fetchRepositoriesLanguages } from '../requests/repositories-languages.request.js';

export const fetchAllRepositoriesLanguages = async (username) => {
  let repositoriesCursor = null;

  let languages = {};

  while (true) {
    const {
      repositories: ownedRepositories,
    } = await fetchRepositoriesLanguages(username, repositoriesCursor);

    const repositories = [
      ...ownedRepositories.nodes,
    ];

    repositories.forEach((repository) => {
      repository.languages.edges.forEach((language) => {
        if (!languages[language.node.name]) {
          languages[language.node.name] = {
            color: language.node.color,
            size: 0,
            occurrences: 0,
          };
        }

        languages[language.node.name].size += language.size;
        languages[language.node.name].occurrences += 1;
      });
    });

    if (!ownedRepositories.pageInfo.hasNextPage) {
      break;
    }

    repositoriesCursor = ownedRepositories?.pageInfo?.endCursor ?? null;
  }

  return languages;
};

export const calculateLanguagePercentages = (languages) => {
  const languagesStats = {};

  const totalLanguagesSize = Object.values(languages).reduce((total, lang) => total + (lang.size || 0), 0);

  for (const [languageName, languageInformation] of Object.entries(languages)) {
    const calculatedPercentage = roundNumber((languageInformation.size ?? 0) / totalLanguagesSize * 100, 2);

    languagesStats[languageName] = {
      ...languageInformation,
      percentage: calculatedPercentage,
    };
  }

  const sortedLanguagesStats = Object.fromEntries(
    Object.entries(languagesStats).sort(([, a], [, b]) => b.percentage - a.percentage)
  );

  return sortedLanguagesStats;
};
