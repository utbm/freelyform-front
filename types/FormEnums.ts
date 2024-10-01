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
  IS_RADIO = 'is_radio',
  IS_MULTIPLE_CHOICE = 'is_multiple_choice',
  REGEX_MATCH = 'regex_match',
  MAX_LENGTH = 'max_length',
  MIN_LENGTH = 'min_length',
}
