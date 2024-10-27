// types/FormTypes.ts

import { InputType, ValidationRuleType } from "./FormEnums";

// Interface used to represent the whole data of a form
export interface Form {
  name: string;
  description: string;
  tags?: string[];
  isActive: boolean;
  isAlreadyAnswered?: boolean;
  groups: FormGroup[];
}

// Interface used to represent a group of input in a form
export interface FormGroup {
  id: string;
  name: string;
  fields: FormField[];
}

// Interface used to represent an input in a group of input
export interface FormField {
  id: string;
  label: string;
  type: InputType;
  options?: FieldOptions;
  validationRules?: ValidationRule[];
  optional?: boolean;
  hidden?: boolean;
}

// Interface used to represent options from an input
export interface FieldOptions {
  choices?: string[];
}

// Interface used to represent a validation rule from an input
export interface ValidationRule {
  type: ValidationRuleType;
  value?: any;
}
