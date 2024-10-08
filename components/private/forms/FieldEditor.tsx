// components/private/forms/FieldEditor.tsx
"use client";

import React from "react";
import { Input, Select, Button, SelectItem } from "@nextui-org/react";
import { FaTimes } from "react-icons/fa";
import { Switch } from "@nextui-org/switch";

import { FormField } from "@/types/FormTypes";
import { InputType } from "@/types/FormEnums";
import { getInputTypeDisplay, getInputTypeIcon } from "@/lib/utils";

import MultipleChoiceOptionsEditor from "./MultipleChoiceOptionsEditor";
import ValidationRulesEditor from "./ValidationRulesEditor";

interface FieldEditorProps {
  field: FormField;
  onUpdateField: (field: FormField) => void;
  onRemoveField: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  onUpdateField,
  onRemoveField,
}) => {
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateField({ ...field, label: e.target.value });
  };

  const handleTypeChange = (value: string | undefined) => {
    if (value) {
      onUpdateField({
        ...field,
        type: value as InputType,
        validationRules: [], // Reset validation rules
      });
    }
  };

  const toggleOptional = () => {
    onUpdateField({ ...field, optional: !field.optional });
  };

  const toggleHidden = () => {
    onUpdateField({ ...field, hidden: !field.hidden });
  };

  return (
    <div className="border rounded-lg p-4 mt-4 relative">
      <Button
        className="absolute top-2 right-2"
        color="danger"
        size="sm"
        startContent={<FaTimes />}
        onPress={onRemoveField}
      />
      <div className="flex flex-wrap items-center space-y-2 md:space-y-0">
        <div className="w-full md:w-1/4 md:pr-2">
          <Input
            fullWidth
            label="Name"
            placeholder="Enter field name"
            size="sm"
            value={field.label}
            onChange={handleLabelChange}
          />
        </div>
        <div className="w-full md:w-1/4 md:px-2">
          <Select
            label="Type"
            placeholder="Select field type"
            selectedKeys={new Set([field.type])}
            size="sm"
            onSelectionChange={(keys) =>
              handleTypeChange(Array.from(keys)[0] as string)
            }
          >
            {Object.values(InputType).map((type) => (
              <SelectItem key={type}>
                {getInputTypeIcon(type) + " " + getInputTypeDisplay(type)}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-full md:w-1/6 md:px-2 flex items-center">
          <ValidationRulesEditor
            inputType={field.type}
            validationRules={field.validationRules || []}
            onUpdateValidationRules={(validationRules) => {
              onUpdateField({ ...field, validationRules });
            }}
          />
        </div>
        <div className="w-1/6 md:px-2 flex items-center">
          <Switch
            color="success"
            isSelected={field.optional}
            size="sm"
            onChange={toggleOptional}
          >
            Optional
          </Switch>
        </div>
        <div className="w-1/6 md:pl-2 flex items-center">
          <Switch
            color="success"
            isSelected={field.hidden}
            size="sm"
            onChange={toggleHidden}
          >
            Hidden
          </Switch>
        </div>
      </div>
      {field.type === InputType.MULTIPLE_CHOICE && (
        <MultipleChoiceOptionsEditor
          choices={field.options?.choices || []}
          onUpdateChoices={(choices: string[]) => {
            onUpdateField({ ...field, options: { ...field.options, choices } });
          }}
        />
      )}
    </div>
  );
};

export default FieldEditor;
