import { RHFEditor } from './rhf-editor';
import { RHFTextField } from './rhf-text-field';
import { RHFRadioGroup } from './rhf-radio-group';
import { RHFAutocomplete } from './rhf-autocomplete';
import { RHFSwitch, RHFMultiSwitch } from './rhf-switch';
import { RHFSelect, RHFMultiSelect } from './rhf-select';
import { RHFDatePicker, RHFMobileDateTimePicker } from './rhf-date-picker';
import { RHFUpload, RHFUploadBox, RHFUploadAvatar, RHFUploadButton } from './rhf-upload';

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  UploadAvatar: RHFUploadAvatar,
  UploadButton: RHFUploadButton,
  Upload: RHFUpload,
  UploadBox: RHFUploadBox,
  Switch: RHFSwitch,
  MultiSwitch: RHFMultiSwitch,
  DatePicker: RHFDatePicker,
  MobileDateTimePicker: RHFMobileDateTimePicker,
  Select: RHFSelect,
  MultiSelect: RHFMultiSelect,
  Editor: RHFEditor,
  RadioGroup: RHFRadioGroup,
  Autocomplete: RHFAutocomplete,
};
