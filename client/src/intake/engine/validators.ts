export type ValidationRule = {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'phone' | 'pattern' | 'custom';
  value?: string | number;
  message: string;
  validator?: (value: unknown, allValues: Record<string, unknown>) => boolean;
};

export function validateField(
  value: unknown,
  rules: ValidationRule[],
  allValues: Record<string, unknown> = {}
): string | null {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
          return rule.message;
        }
        break;
      
      case 'minLength':
        if (typeof value === 'string' && value.length < (rule.value as number)) {
          return rule.message;
        }
        break;
      
      case 'maxLength':
        if (typeof value === 'string' && value.length > (rule.value as number)) {
          return rule.message;
        }
        break;
      
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value === 'string') {
          if (value && !emailRegex.test(value)) {
            return rule.message;
          }
        } else if (value) {
          return rule.message;
        }
        break;
      }
      
      case 'phone': {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (typeof value === 'string') {
          const digitsOnly = value.replace(/\D/g, '');
          if ((value && !phoneRegex.test(value)) || (value && digitsOnly.length < 10)) {
            return rule.message;
          }
        } else if (value) {
          return rule.message;
        }
        break;
      }
      
      case 'pattern':
        if (typeof value === 'string' && rule.value && !new RegExp(rule.value as string).test(value)) {
          return rule.message;
        }
        break;
      
      case 'custom':
        if (rule.validator && !rule.validator(value, allValues)) {
          return rule.message;
        }
        break;
    }
  }
  return null;
}

export function validateStep(
  fields: Array<{ id: string; validation?: ValidationRule[] }>,
  values: Record<string, unknown>
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  for (const field of fields) {
    if (field.validation) {
      const error = validateField(values[field.id], field.validation, values);
      if (error) {
        errors[field.id] = error;
      }
    }
  }
  
  return errors;
}


