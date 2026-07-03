import { forwardRef, type LabelHTMLAttributes } from 'react'
import { Field } from '@chakra-ui/react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, ...props }, ref) => {
    return (
      <Field.Label ref={ref} {...props}>
        {children}
        {required && <Field.RequiredIndicator />}
      </Field.Label>
    )
  },
)

Label.displayName = 'Label'
