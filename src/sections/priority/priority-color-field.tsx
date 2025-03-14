import { PRIORITY_COLOR_OBJ } from 'src/constants/priority';

import { Label } from 'src/components/label';
import { Field } from 'src/components/hook-form';
import BlockField from 'src/components/hook-form/block-field';

export default function PriorityColorField() {
  return (
    <BlockField label="Màu sắc" required>
      <Field.RadioGroup
        name="color"
        row
        options={
          Object.values(PRIORITY_COLOR_OBJ).map((priority) => ({
            value: priority.color,
            label: (
              <Label
                sx={{
                  color: priority.color,
                  backgroundColor: priority.bgColor,
                  ml: 0.5,
                  userSelect: 'none',
                  cursor: 'pointer',
                }}
                variant="soft"
              >
                Độ ưu tiên
              </Label>
            ),
          })) as any
        }
        slotProps={{
          radio: {
            size: 'small',
          },
        }}
        sx={{
          '& .MuiFormControlLabel-root': {
            border: '1px solid #f4f4f4',
            borderRadius: 1,
            px: 0.5,
          },
          gap: 1,
        }}
      />
    </BlockField>
  );
}
