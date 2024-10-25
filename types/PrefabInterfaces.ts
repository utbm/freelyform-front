// types/PrefabInterfaces.ts

// Interface used to cast result of a prefab to the Service
export interface PrefabRequest {
  name: string;
  description: string;
  tags: string[];
  groups: any[];
}
