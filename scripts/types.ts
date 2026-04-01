export type ThemeFile = {
  version: number;
  name: string;
  author: string;
  description: string;
  tags: string[];
  palette: [string, string, string, string];
  vars?: Record<string, string>;
  dark?: Record<string, string>;
};

export type ThemeIndexEntry = {
  id: string;
  name: string;
  description: string;
  author: string;
  tags: string[];
  palette: [string, string, string, string];
  path: string;
};

export type ThemeIndex = {
  version: number;
  themes: ThemeIndexEntry[];
};
