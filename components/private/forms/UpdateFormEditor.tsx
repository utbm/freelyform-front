// components/private/forms/UpdateFormEditor.tsx

"use client";

import React, { useState } from "react";
import { Input, Textarea, Button } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Form, FormGroup } from "@/types/FormTypes";
import GroupEditor from "@/components/private/forms/GroupEditor";
import { generateUniqueId } from "@/lib/utils";
import { PrefabRequest } from "@/types/PrefabInterfaces";
import { useAuth } from "@/contexts/AuthContext";
import { updatePrefab } from "@/services/prefabs";

interface UpdateFormEditorProps {
  initialForm: Form;
  id: string;
}

const UpdateFormEditor: React.FC<UpdateFormEditorProps> = ({
  initialForm,
  id,
}) => {
  const router = useRouter();
  const { token } = useAuth();

  const [form, setForm] = useState<Form>(initialForm);

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, name: e.target.value });
  };

  const handleDescriptionChange = (value: string) => {
    setForm({ ...form, description: value });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, tags: e.target.value.split(",") });
  };

  const addGroup = () => {
    const newGroup: FormGroup = {
      id: generateUniqueId(),
      name: "",
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
  const handleSubmit = async () => {
    try {
      if (!id) throw new Error("No prefab ID provided.");
      let tags = form.tags ?? [];

      tags = tags.map((tag) => tag.trim());
      const prefabRequest: PrefabRequest = {
        name: form.name,
        description: form.description,
        tags: tags,
        groups: form.groups,
      };

      if (form.name.trim() === "") {
        toast.error("Form name is required");

        return;
      }
      await updatePrefab(token, id, prefabRequest);
      toast.success("Prefab updated successfully!");
      router.push("/prefabs");
    } catch (error: any) {
      // @ts-ignore
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="container mx-auto p-4 !pt-2">
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
          value={form.tags?.join(",")}
          onChange={handleTagsChange}
        />
      </div>
      <h2 className="mt-8 text-xl">Groups</h2>
      {form.groups.map((group, index) => (
        <GroupEditor
          key={group.id}
          group={group}
          onRemoveGroup={() => removeGroup(group.id)}
          onUpdateGroup={(updatedGroup) => updateGroup(index, updatedGroup)}
        />
      ))}
      <div className="flex justify-center mt-4">
        <Button onPress={addGroup}>Add Group</Button>
      </div>
      {/* Add the Submit button here */}
      <div className="flex justify-center mt-4">
        <Button onPress={handleSubmit}>Update</Button>
      </div>
    </div>
  );
};

export default UpdateFormEditor;
