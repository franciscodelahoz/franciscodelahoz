import {
  generateLanguagesSvg,
} from './tools/svg.tools.js';

import {
  fetchAllRepositoriesLanguages,
  calculateLanguagePercentages,
} from './tools/user-stats.tools.js';

import { environmentVariables } from './constants/general.constants.js';

(async () => {
  const repositoriesLanguagesStats = await fetchAllRepositoriesLanguages(environmentVariables.github_username);
  const repositoriesLanguagesPercentage = calculateLanguagePercentages(repositoriesLanguagesStats);

  await generateLanguagesSvg(repositoriesLanguagesPercentage);
})();
