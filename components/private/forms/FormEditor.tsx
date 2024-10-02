// components/private/forms/FormEditor.tsx
"use client";

import React, { useState } from 'react';
import { Input, Textarea, Button } from '@nextui-org/react';
import { Form, FormGroup } from "@/types/FormTypes";
import GroupEditor from "@/components/private/forms/GroupEditor";

const FormEditor: React.FC = () => {
  const [form, setForm] = useState<Form>({
    name: '',
    description: '',
    tags: [],
    groups: [],
  });

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, name: e.target.value });
  };

  const handleDescriptionChange = (value: string) => {
    setForm({ ...form, description: value });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, tags: e.target.value.split(',') });
  };

  const addGroup = () => {
    const newGroup: FormGroup = {
      id: generateUniqueId(),
      name: '',
      fields: [],
    };
    setForm({ ...form, groups: [...form.groups, newGroup] });
  };

  const removeGroup = (groupId: string) => {
    setForm({
      ...form,
      groups: form.groups.filter((group) => group.id !== groupId),
    });
  };

  const updateGroup = (index: number, updatedGroup: FormGroup) => {
    const updatedGroups = [...form.groups];
    updatedGroups[index] = updatedGroup;
    setForm({ ...form, groups: updatedGroups });
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Form data:', form);
  };

  return (
    <div className="container mx-auto p-4 !pt-2">
      <h1 className="text-3xl">Create Form</h1>
      <div className="mt-4">
        <Input
          fullWidth
          label="Form Name"
          placeholder="Enter form name"
          value={form.name}
          onChange={handleFormNameChange}
        />
      </div>
      <div className="mt-4">
        <Textarea
          fullWidth
          label="Description"
          placeholder="Enter description"
          value={form.description}
          onValueChange={handleDescriptionChange}
        />
      </div>
      <div className="mt-4">
        <Input
          fullWidth
          label="Tags (comma separated)"
          placeholder="tag1, tag2, tag3"
          value={form.tags?.join(',')}
          onChange={handleTagsChange}
        />
      </div>
      <h2 className="mt-8 text-xl">
        Groups
      </h2>
      {form.groups.map((group, index) => (
        <GroupEditor
          key={group.id}
          group={group}
          onUpdateGroup={(updatedGroup) => updateGroup(index, updatedGroup)}
          onRemoveGroup={() => removeGroup(group.id)}
        />
      ))}
      <div className="flex justify-center mt-4">
        <Button onPress={addGroup}>Add Group</Button>
      </div>
      {/* Add the Submit button here */}
      <div className="flex justify-center mt-4">
        <Button onPress={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default FormEditor;

// Utility function to generate unique IDs
const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};
