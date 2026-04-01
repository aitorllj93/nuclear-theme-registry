import { readdir } from 'node:fs/promises';

const THEMES_DIR = 'themes';
const INDEX_FILE = 'themes.json';
const INDEX_VERSION = 1;

type ThemeIndexEntry = {
  id: string;
  name: string;
  description: string;
  author: string;
  tags: string[];
  palette: string[];
  path: string;
};

type ThemeIndex = {
  version: number;
  themes: ThemeIndexEntry[];
};

const REQUIRED_FIELDS = ['name', 'description', 'author', 'tags', 'palette'] as const;

const parseThemeFile = async (file: string): Promise<ThemeIndexEntry> => {
  const filePath = `${THEMES_DIR}/${file}`;
  const theme = await Bun.file(filePath).json();
  const id = file.replace(/\.json$/, '');

  const missingFields = REQUIRED_FIELDS.filter((field) => theme[field] === undefined);
  if (missingFields.length > 0) {
    throw new Error(`${filePath}: missing required fields: ${missingFields.join(', ')}`);
  }

  return {
    id,
    name: theme.name,
    description: theme.description,
    author: theme.author,
    tags: theme.tags,
    palette: theme.palette,
    path: filePath,
  };
};

const checkForDuplicates = (entries: ThemeIndexEntry[]): void => {
  const ids = entries.map((entry) => entry.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate theme ids: ${duplicates.join(', ')}`);
  }
};

const files = (await readdir(THEMES_DIR))
  .filter((file) => file.endsWith('.json'))
  .sort();

const entries = await Promise.all(files.map(parseThemeFile));
checkForDuplicates(entries);

const index: ThemeIndex = {
  version: INDEX_VERSION,
  themes: entries,
};

await Bun.write(INDEX_FILE, JSON.stringify(index, null, 2) + '\n');
console.log(`Wrote ${INDEX_FILE} with ${entries.length} themes`);
