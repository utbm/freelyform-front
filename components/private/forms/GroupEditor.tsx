// components/private/forms/GroupEditor.tsx
"use client";

import React from "react";
import { Input, Button } from "@nextui-org/react";
import { FaTimes } from "react-icons/fa";

import { FormField, FormGroup } from "@/types/FormTypes";
import { InputType } from "@/types/FormEnums";
import FieldEditor from "@/components/private/forms/FieldEditor";

interface GroupEditorProps {
  group: FormGroup;
  onUpdateGroup: (group: FormGroup) => void;
  onRemoveGroup: () => void;
}

const GroupEditor: React.FC<GroupEditorProps> = ({
  group,
  onUpdateGroup,
  onRemoveGroup,
}) => {
  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateGroup({ ...group, name: e.target.value });
  };

  const addField = () => {
    const newField: FormField = {
      id: generateUniqueId(),
      label: "",
      type: InputType.TEXT,
      optional: false,
      hidden: false,
      validationRules: [],
    };

    onUpdateGroup({ ...group, fields: [...group.fields, newField] });
  };

  const removeField = (fieldId: string) => {
    onUpdateGroup({
      ...group,
      fields: group.fields.filter((field) => field.id !== fieldId),
    });
  };

  const updateField = (index: number, updatedField: FormField) => {
    const updatedFields = [...group.fields];

    updatedFields[index] = updatedField;
    onUpdateGroup({ ...group, fields: updatedFields });
  };

  return (
    <div className="border rounded-lg p-4 mt-4 relative">
      <div className="flex flex-row gap-4 justify-between items-stretch">
        <Input
          className="min-h-[40px]" // Adjust the min-height to match the button's height
          label="Group Name"
          placeholder="Enter group name"
          size="sm"
          value={group.name}
          onChange={handleGroupNameChange}
        />
        <Button
          className="flex-grow h-auto min-h-[40px]" // Set a minimum height that matches the Input
          color="danger"
          size="sm"
          startContent={<FaTimes />}
          onPress={onRemoveGroup}
        />
      </div>

      {group.fields.map((field, index) => (
        <FieldEditor
          key={field.id}
          field={field}
          onRemoveField={() => removeField(field.id)}
          onUpdateField={(updatedField) => updateField(index, updatedField)}
        />
      ))}
      <div className="flex justify-center mt-4">
        <Button onPress={addField}>Add Field</Button>
      </div>
    </div>
  );
};

export default GroupEditor;

// Utility function to generate unique IDs
const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};
