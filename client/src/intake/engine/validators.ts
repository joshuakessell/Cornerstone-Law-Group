export type ValidationRule = {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'phone' | 'pattern' | 'custom';
  value?: string | number;
  message: string;
  validator?: (value: any, allValues: Record<string, any>) => boolean;
};

export function validateField(
  value: any,
  rules: ValidationRule[],
  allValues: Record<string, any> = {}
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
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return rule.message;
        }
        break;
      
      case 'phone':
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (value && !phoneRegex.test(value) || (value && value.replace(/\D/g, '').length < 10)) {
          return rule.message;
        }
        break;
      
      case 'pattern':
        if (value && rule.value && !new RegExp(rule.value as string).test(value)) {
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
  values: Record<string, any>
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

