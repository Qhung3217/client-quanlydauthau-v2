import { PRIORITY_COLOR_OBJ } from 'src/constants/priority';

export default function getPriorityColorConfig(color: string) {
  switch (color) {
    case '#71717a':
      return PRIORITY_COLOR_OBJ['#71717a'];
    case '#ef4444':
      return PRIORITY_COLOR_OBJ['#ef4444'];
    case '#f59e0b':
      return PRIORITY_COLOR_OBJ['#f59e0b'];
    case '#84cc16':
      return PRIORITY_COLOR_OBJ['#84cc16'];
    case '#10b981':
      return PRIORITY_COLOR_OBJ['#10b981'];
    case '#0ea5e9':
      return PRIORITY_COLOR_OBJ['#0ea5e9'];
    case '#3b82f6':
      return PRIORITY_COLOR_OBJ['#3b82f6'];
    case '#8b5cf6':
      return PRIORITY_COLOR_OBJ['#8b5cf6'];

    default:
      return PRIORITY_COLOR_OBJ['#71717a'];
  }
}
