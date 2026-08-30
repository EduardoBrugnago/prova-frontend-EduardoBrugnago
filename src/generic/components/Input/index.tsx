import TextField from '@mui/material/TextField';
import type { TextFieldProps, TextFieldVariants } from '@mui/material/TextField';
import { useController } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

type ControlledProps =
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'error' | 'inputRef' | 'variant';

export type InputProps<TFieldValues extends FieldValues> = Omit<TextFieldProps, ControlledProps> & {
  variant?: TextFieldVariants;
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
};

function Input<TFieldValues extends FieldValues>({
  name,
  control,
  helperText,
  disabled,
  ...textFieldProps
}: InputProps<TFieldValues>) {
  const { field, fieldState } = useController<TFieldValues>({ name, control });

  return (
    <TextField
      {...textFieldProps}
      name={field.name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      inputRef={field.ref}
      disabled={disabled ?? field.disabled}
      error={Boolean(fieldState.error)}
      helperText={fieldState.error?.message ?? helperText}
    />
  );
}

export default Input;
