// core (MUI)
// date pickers (MUI)
// data grid (MUI)
import { viLang } from '../all-langs';
// ----------------------------------------------------------------------

export function formatNumberLocale() {
  const currentLang = viLang;

  return { code: currentLang.numberFormat.code, currency: currentLang.numberFormat.currency };
}
