// types/FormEnums.ts

export enum InputType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  MULTIPLE_CHOICE = 'multiple_choice',
  GEOLOCATION = 'geolocation',
}

export enum ValidationRuleType {
  IS_EMAIL = 'is_email',
  REGEX_MATCH = 'regex_match',
  MAX_LENGTH = 'max_length',
  MIN_LENGTH = 'min_length',
}
