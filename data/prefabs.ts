import { Form } from "@/types/FormTypes";
import { InputType, ValidationRuleType } from "@/types/FormEnums";

export const prefabs: Form[] = [
  {
    name: "Employee Information Form",
    description: "A form to collect employee details",
    tags: ["employee", "information"],
    groups: [
      {
        id: "group-1",
        name: "Personal Information",
        fields: [
          {
            id: "field-1",
            label: "Full Name",
            type: InputType.TEXT,
            validationRules: [
              { type: ValidationRuleType.MIN_LENGTH, value: 3 },
              { type: ValidationRuleType.MAX_LENGTH, value: 50 },
            ],
            optional: false,
          },
          {
            id: "field-2",
            label: "Email",
            type: InputType.TEXT,
            validationRules: [{ type: ValidationRuleType.IS_EMAIL }],
            optional: false,
          },
          {
            id: "field-3",
            label: "Phone Number",
            type: InputType.TEXT,
            validationRules: [
              { type: ValidationRuleType.REGEX_MATCH, value: "^[0-9]{10}$" },
            ],
            optional: true,
          },
        ],
      },
      {
        id: "group-2",
        name: "Job Details",
        fields: [
          {
            id: "field-4",
            label: "Role",
            type: InputType.TEXT,
            optional: false,
          },
          {
            id: "field-5",
            label: "Employment Status",
            type: InputType.MULTIPLE_CHOICE,
            options: { choices: ["Full-time", "Part-time", "Contractor"] },
            optional: false,
          },
        ],
      },
    ],
  },
  {
    name: "Feedback Form",
    description: "A form to gather user feedback",
    tags: ["feedback", "customer"],
    groups: [
      {
        id: "group-3",
        name: "Feedback Questions",
        fields: [
          {
            id: "field-6",
            label: "Rate your experience",
            type: InputType.MULTIPLE_CHOICE,
            options: { choices: ["Excellent", "Good", "Average", "Poor"] },
            validationRules: [
              { type: ValidationRuleType.IS_RADIO },
            ],
            optional: false,
          },
          {
            id: "field-7",
            label: "Comments",
            type: InputType.TEXT,
            validationRules: [
              { type: ValidationRuleType.MAX_LENGTH, value: 200 },
            ],
            optional: true,
          },
        ],
      },
    ],
  },
  {
    name: "Customer Satisfaction Survey",
    description: "A form to collect customer satisfaction levels",
    tags: ["survey", "customer", "satisfaction"],
    groups: [
      {
        id: "group-4",
        name: "Satisfaction Metrics",
        fields: [
          {
            id: "field-8",
            label: "How satisfied are you with our service?",
            type: InputType.MULTIPLE_CHOICE,
            options: {
              choices: [
                "Very Satisfied",
                "Satisfied",
                "Neutral",
                "Dissatisfied",
                "Very Dissatisfied",
              ],
            },
            optional: false,
          },
          {
            id: "field-9",
            label: "Would you recommend our service?",
            type: InputType.MULTIPLE_CHOICE,
            options: { choices: ["Yes", "No"] },
            optional: false,
          },
        ],
      },
    ],
  },
  {
    name: "Event Registration Form",
    description: "A form to register attendees for an event",
    tags: ["event", "registration"],
    groups: [
      {
        id: "group-5",
        name: "Attendee Information",
        fields: [
          {
            id: "field-10",
            label: "Attendee Name",
            type: InputType.TEXT,
            validationRules: [
              { type: ValidationRuleType.MIN_LENGTH, value: 3 },
            ],
            optional: false,
          },
          {
            id: "field-11",
            label: "Email Address",
            type: InputType.TEXT,
            validationRules: [{ type: ValidationRuleType.IS_EMAIL }],
            optional: false,
          },
          {
            id: "field-12",
            label: "Ticket Type",
            type: InputType.MULTIPLE_CHOICE,
            options: { choices: ["VIP", "General Admission", "Student"] },
            optional: false,
          },
        ],
      },
    ],
  },
  {
    name: "Job Application Form",
    description: "A form for candidates to apply for a job position",
    tags: ["job", "application"],
    groups: [
      {
        id: "group-6",
        name: "Applicant Details",
        fields: [
          {
            id: "field-13",
            label: "Full Name",
            type: InputType.TEXT,
            validationRules: [
              { type: ValidationRuleType.MIN_LENGTH, value: 3 },
            ],
            optional: false,
          },
          {
            id: "field-14",
            label: "Email",
            type: InputType.TEXT,
            validationRules: [{ type: ValidationRuleType.IS_EMAIL }],
            optional: false,
          },
          {
            id: "field-15",
            label: "Phone Number",
            type: InputType.TEXT,
            validationRules: [
              { type: ValidationRuleType.REGEX_MATCH, value: "^[0-9]{10}$" },
            ],
            optional: false,
          },
        ],
      },
      {
        id: "group-7",
        name: "Position Details",
        fields: [
          {
            id: "field-16",
            label: "Position Applying For",
            type: InputType.TEXT,
            optional: false,
          },
          {
            id: "field-17",
            label: "Available Start Date",
            type: InputType.DATE,
            optional: false,
          },
        ],
      },
    ],
  },
  {
    name: "Patient Intake Form",
    description: "A form for new patients to provide their medical history",
    tags: ["medical", "patient", "intake"],
    groups: [
      {
        id: "group-8",
        name: "Personal Information",
        fields: [
          {
            id: "field-18",
            label: "Full Name",
            type: InputType.TEXT,
            validationRules: [
              { type: ValidationRuleType.MIN_LENGTH, value: 3 },
            ],
            optional: false,
          },
          {
            id: "field-19",
            label: "Date of Birth",
            type: InputType.DATE,
            optional: false,
          },
          {
            id: "field-20",
            label: "Contact Number",
            type: InputType.TEXT,
            validationRules: [
              { type: ValidationRuleType.REGEX_MATCH, value: "^[0-9]{10}$" },
            ],
            optional: false,
          },
        ],
      },
      {
        id: "group-9",
        name: "Medical History",
        fields: [
          {
            id: "field-21",
            label: "Do you have any known allergies?",
            type: InputType.MULTIPLE_CHOICE,
            options: { choices: ["Yes", "No"] },
            optional: false,
          },
          {
            id: "field-22",
            label: "Please specify your allergies (if any)",
            type: InputType.TEXT,
            validationRules: [
              { type: ValidationRuleType.MAX_LENGTH, value: 200 },
            ],
            optional: true,
          },
        ],
      },
    ],
  },
  {
    name: "Product Feedback Survey",
    description: "A form to gather feedback on a product",
    tags: ["survey", "feedback", "product"],
    groups: [
      {
        id: "group-10",
        name: "Product Satisfaction",
        fields: [
          {
            id: "field-23",
            label: "How would you rate the product?",
            type: InputType.MULTIPLE_CHOICE,
            options: { choices: ["1", "2", "3", "4", "5"] },
            optional: false,
          },
          {
            id: "field-24",
            label: "What did you like about the product?",
            type: InputType.TEXT,
            validationRules: [
              { type: ValidationRuleType.MAX_LENGTH, value: 300 },
            ],
            optional: true,
          },
          {
            id: "field-25",
            label: "What improvements would you suggest?",
            type: InputType.TEXT,
            validationRules: [
              { type: ValidationRuleType.MAX_LENGTH, value: 300 },
            ],
            optional: true,
          },
        ],
      },
    ],
  },
];
