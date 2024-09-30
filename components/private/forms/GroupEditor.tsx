// components/private/forms/GroupEditor.tsx
"use client";

import React from "react";
import { Input, Button, Spacer } from "@nextui-org/react";
import { FormField, FormGroup } from "@/types/FormTypes";
import { InputType } from "@/types/FormEnums";
import FieldEditor from "@/components/private/forms/FieldEditor";
import { Card } from "@nextui-org/card";
import { FaTimes } from "react-icons/fa";

interface GroupEditorProps {
  group: FormGroup;
  onUpdateGroup: (group: FormGroup) => void;
  onRemoveGroup: () => void;
}

const GroupEditor: React.FC<GroupEditorProps> = ({
                                                   group,
                                                   onUpdateGroup,
                                                   onRemoveGroup
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
      validationRules: []
    };
    onUpdateGroup({ ...group, fields: [...group.fields, newField] });
  };

  const removeField = (fieldId: string) => {
    onUpdateGroup({
      ...group,
      fields: group.fields.filter((field) => field.id !== fieldId)
    });
  };

  const updateField = (index: number, updatedField: FormField) => {
    const updatedFields = [...group.fields];
    updatedFields[index] = updatedField;
    onUpdateGroup({ ...group, fields: updatedFields });
  };

  return (
    <div className="border rounded-lg p-4 mt-4 relative">
      <Button
        color="danger"
        size="sm"
        className="absolute top-2 right-2"
        onPress={onRemoveGroup}
        startContent={<FaTimes />}
      />
      <Input
        fullWidth
        label="Group Name"
        placeholder="Enter group name"
        value={group.name}
        onChange={handleGroupNameChange}
      />
      {group.fields.map((field, index) => (
        <FieldEditor
          key={field.id}
          field={field}
          onUpdateField={(updatedField) => updateField(index, updatedField)}
          onRemoveField={() => removeField(field.id)}
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
