import { forwardRef } from 'react'
import { NativeSelect, Field } from '@chakra-ui/react'

interface SelectProps {
  label?: string
  error?: string
  options: { value: string | number; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder }, ref) => {
    return (
      <Field.Root invalid={!!error}>
        {label ? <Field.Label>{label}</Field.Label> : null}
        <NativeSelect.Root>
          <NativeSelect.Field ref={ref}>
            {placeholder ? <option value="">{placeholder}</option> : null}
            {options.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        {error ? <Field.ErrorText>{error}</Field.ErrorText> : null}
      </Field.Root>
    )
  },
)

Select.displayName = 'Select'
