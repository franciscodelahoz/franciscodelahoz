import path from 'node:path';
import fs from 'node:fs/promises';

import {
  svgAnimationDelay,
  templateVariables,
  defaultLanguageColor
} from '../constants/general.constants.js';

export const languageTemplate = (index, lang, color = defaultLanguageColor, percentage = 0) => (`
  <li style="animation-delay: ${index * svgAnimationDelay}ms;">
    <svg xmlns="http://www.w3.org/2000/svg" class="octicon" style="fill:${color};" viewBox="0 0 16 16" version="1.1" width="16" height="16">
      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path>
    </svg>
    <span class="lang">${lang}</span>
    <span class="percent">${percentage}%</span>
  </li>
`);

export const progressTemplate = (color = defaultLanguageColor, percentage = 0.3) => (`
  <span style="background-color: ${color};width: ${percentage}%;" class="progress-item"></span>
`);

export const generateLanguagesSvg = async (languageStats) => {
  const templateLocation = path.join(path.resolve(), './src/templates/languages.svg');
  const outputPath = path.join(path.resolve(), './output/languages.svg');

  const svgTemplate = await fs.readFile(templateLocation, 'utf-8');

  const sortedLanguagesBySize = Object.entries(languageStats).sort((a, b) => b.size - a.size);

  let langList = '';
  let progress = '';

  sortedLanguagesBySize.forEach(([ languageName, languageInfo ], index) => {
    progress += progressTemplate(languageInfo.color, languageInfo.percentage);
    langList += languageTemplate(index, languageName, languageInfo.color, languageInfo.percentage);
  });

  let updatedOutput = svgTemplate
    .replace(templateVariables.progress, progress)
    .replace(templateVariables.lang_list, langList);

  await fs.writeFile(outputPath, updatedOutput, 'utf-8');
}
