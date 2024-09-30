// components/private/forms/FieldEditor.tsx
"use client";

import React, { useState } from 'react';
import MultipleChoiceOptionsEditor from './MultipleChoiceOptionsEditor';
import ValidationRulesEditor from './ValidationRulesEditor';
import { Input, Select, Checkbox, Button, SelectItem } from "@nextui-org/react";
import { FaTimes } from 'react-icons/fa';
import { FormField } from "@/types/FormTypes";
import { InputType } from "@/types/FormEnums";

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
  const [showValidationRules, setShowValidationRules] = useState(false);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateField({ ...field, label: e.target.value });
  };

  const handleTypeChange = (value: string | undefined) => {
    if (value) {
      onUpdateField({ ...field, type: value as InputType });
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
        color="danger"
        size="sm"
        className="absolute top-2 right-2"
        onPress={onRemoveField}
        startContent={<FaTimes />}
      />
      <div className="flex flex-wrap items-center space-y-2 md:space-y-0">
        <div className="w-full md:w-1/4 md:pr-2">
          <Input
            fullWidth
            label="Name"
            placeholder="Enter field name"
            value={field.label}
            onChange={handleLabelChange}
          />
        </div>
        <div className="w-full md:w-1/4 md:px-2">
          <Select
            label="Type"
            placeholder="Select field type"
            selectedKeys={new Set([field.type])}
            onSelectionChange={(keys) =>
              handleTypeChange(Array.from(keys)[0] as string)
            }
          >
            {Object.values(InputType).map((type) => (
              <SelectItem key={type}>{type}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-full md:w-1/6 md:px-2 flex items-center">
          <Button
            size="sm"
            onPress={() => setShowValidationRules(!showValidationRules)}
          >
            Rules
          </Button>
        </div>
        <div className="w-1/6 md:px-2 flex items-center">
          <Checkbox isSelected={field.optional} onChange={toggleOptional}>
            Optional
          </Checkbox>
        </div>
        <div className="w-1/6 md:pl-2 flex items-center">
          <Checkbox isSelected={field.hidden} onChange={toggleHidden}>
            Hidden
          </Checkbox>
        </div>
      </div>
      {field.type === InputType.MULTIPLE_CHOICE && (
        <MultipleChoiceOptionsEditor
          choices={field.options?.choices || []}
          onUpdateChoices={(choices) => {
            onUpdateField({ ...field, options: { ...field.options, choices } });
          }}
        />
      )}
      {showValidationRules && (
        <ValidationRulesEditor
          validationRules={field.validationRules || []}
          onUpdateValidationRules={(validationRules) => {
            onUpdateField({ ...field, validationRules });
          }}
        />
      )}
    </div>
  );
};

export default FieldEditor;
