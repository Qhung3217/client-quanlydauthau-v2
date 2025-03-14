import type { PriorityColor } from 'src/types/priority';

const opacity = '1A';

export const PRIORITY_COLOR_OBJ: {
  [k in PriorityColor]: {
    color: k;
    bgColor: string;
  };
} = {
  '#71717a': {
    color: '#71717a',
    bgColor: `#71717a${opacity}`,
  },
  '#0ea5e9': {
    color: '#0ea5e9',
    bgColor: `#0ea5e9${opacity}`,
  },
  '#10b981': {
    color: '#10b981',
    bgColor: `#10b981${opacity}`,
  },
  '#3b82f6': {
    color: '#3b82f6',
    bgColor: `#3b82f6${opacity}`,
  },

  '#84cc16': {
    color: '#84cc16',
    bgColor: `#84cc16${opacity}`,
  },
  '#8b5cf6': {
    color: '#8b5cf6',
    bgColor: `#8b5cf6${opacity}`,
  },
  '#ef4444': {
    color: '#ef4444',
    bgColor: `#ef4444${opacity}`,
  },
  '#f59e0b': {
    color: '#f59e0b',
    bgColor: `#f59e0b${opacity}`,
  },
};
