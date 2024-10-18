// types/FormTypes.ts

import { InputType, ValidationRuleType } from "./FormEnums";

export interface Form {
  name: string;
  description: string;
  tags?: string[];
  isActive: boolean;
  groups: FormGroup[];
}

export interface FormGroup {
  id: string;
  name: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: InputType;
  options?: FieldOptions;
  validationRules?: ValidationRule[];
  optional?: boolean;
  hidden?: boolean;
}

export interface FieldOptions {
  choices?: string[];
}

export interface ValidationRule {
  type: ValidationRuleType;
  value?: any;
}
