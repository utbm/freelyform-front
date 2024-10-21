// pages/EditForm/[id].tsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

import UpdateFormEditor from "@/components/private/forms/UpdateFormEditor";
import { Form } from "@/types/FormTypes";
import { getPrefabById } from "@/services/prefabs";
import { useAuth } from "@/contexts/AuthContext";

const EditFormPage: React.FC = () => {
  const params = useParams();
  const { id } = params; // Assuming the route is /EditForm/[id]
  const { token } = useAuth();

  const [initialForm, setInitialForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrefab = async () => {
      try {
        if (!id) throw new Error("No prefab ID provided.");
        const response = await getPrefabById(id.toString());
        const data = response.data;

        // Transform PrefabRequest to Form type if necessary
        const formData: Form = {
          name: data.name,
          description: data.description,
          tags: data.tags,
          groups: data.groups, // Ensure groups are in FormGroup[] format
        };

        setInitialForm(formData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch prefab data.");
        toast.error(err.message || "Failed to fetch prefab data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrefab();
  }, [id, token]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error || !initialForm) {
    return <div className="container mx-auto p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 !pt-2">
      <h1 className="text-3xl">Edit Form</h1>
      <UpdateFormEditor id={id.toString()} initialForm={initialForm} />
    </div>
  );
};

export default EditFormPage;
