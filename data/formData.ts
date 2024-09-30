// data/fakeFormData.ts

import { PrefabForm } from "@/types/PrefabForm";
import { FormEnums } from "@/types/FormEnums";

const formData: PrefabForm = {
  id: "form_1",
  name: "Survey Form",
  description: "This is a sample form to test input types.",
  fields: [
    {
      id: "field_1",
      label: "Short Answer",
      type: FormEnums.SHORT_ANSWER,
      placeholder: "Enter a short answer"
    },
    {
      id: "field_2",
      label: "Paragraph",
      type: FormEnums.PARAGRAPH,
      placeholder: "Enter a longer response"
    },
    {
      id: "field_3",
      label: "Multiple Choice",
      type: FormEnums.MULTIPLE_CHOICE,
      options: ["Option 1", "Option 2", "Option 3"]
    },
    {
      id: "field_4",
      label: "Scrolling List",
      type: FormEnums.SCROLLING_LIST,
      options: ["Choice 1", "Choice 2", "Choice 3"]
    },
    {
      id: "field_5",
      label: "Date",
      type: FormEnums.DATE
    },
    {
      id: "field_6",
      label: "Time",
      type: FormEnums.TIME
    },
    {
      id: "field_7",
      label: "Email",
      type: FormEnums.EMAIL,
      placeholder: "Enter your email"
    },
    {
      id: "field_8",
      label: "Phone",
      type: FormEnums.PHONE,
      placeholder: "Enter your phone number"
    },
    {
      id: "field_9",
      label: "Checkboxes",
      type: FormEnums.CHECKBOXES,
      options: ["Checkbox 1", "Checkbox 2", "Checkbox 3"]
    },
    {
      id: "field_10",
      label: "Geospatial Point",
      type: FormEnums.MAP
    }
  ]
};

export default formData;
