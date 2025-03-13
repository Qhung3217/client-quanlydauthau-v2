// core (MUI)
import { viVN as viVNCore } from '@mui/material/locale';
// date pickers (MUI)
import { viVN as viVNDate } from '@mui/x-date-pickers/locales';
// data grid (MUI)
import { viVN as viVNDataGrid } from '@mui/x-data-grid/locales';
// ----------------------------------------------------------------------

export const viLang = {
  value: 'vi',
  label: 'Vietnamese',
  countryCode: 'VN',
  adapterLocale: 'vi',
  numberFormat: { code: 'vi-VN', currency: 'VND' },
  systemValue: {
    components: { ...viVNCore.components, ...viVNDate.components, ...viVNDataGrid.components },
  },
};
