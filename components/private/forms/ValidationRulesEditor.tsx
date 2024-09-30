// components/private/forms/ValidationRulesEditor.tsx
"use client";

import React from 'react';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { FaTimes } from 'react-icons/fa';
import { ValidationRule } from "@/types/FormTypes";
import { ValidationRuleType } from "@/types/FormEnums";

interface ValidationRulesEditorProps {
  validationRules: ValidationRule[];
  onUpdateValidationRules: (rules: ValidationRule[]) => void;
}

const ValidationRulesEditor: React.FC<ValidationRulesEditorProps> = ({
                                                                       validationRules,
                                                                       onUpdateValidationRules,
                                                                     }) => {
  const addValidationRule = (ruleType: ValidationRuleType) => {
    const newRule: ValidationRule = { type: ruleType };
    if (ruleType === ValidationRuleType.REGEX_MATCH) {
      newRule.value = '';
    } else if (
      ruleType === ValidationRuleType.MAX_LENGTH ||
      ruleType === ValidationRuleType.MIN_LENGTH
    ) {
      newRule.value = 0;
    }
    onUpdateValidationRules([...validationRules, newRule]);
  };

  const removeValidationRule = (index: number) => {
    const updatedRules = validationRules.filter((_, i) => i !== index);
    onUpdateValidationRules(updatedRules);
  };

  const updateValidationRuleValue = (index: number, value: any) => {
    const updatedRules = [...validationRules];
    updatedRules[index].value = value;
    onUpdateValidationRules(updatedRules);
  };

  return (
    <div className="mt-4">
      <h6>Validation Rules</h6>
      {validationRules.map((rule, index) => (
        <div
          key={index}
          className="flex items-center mt-2 border p-2 rounded-lg"
        >
          <span className="w-1/4">{rule.type}</span>
          {rule.type !== ValidationRuleType.IS_EMAIL && (
            <Input
              fullWidth
              placeholder="Enter value"
              value={rule.value}
              onChange={(e) => updateValidationRuleValue(index, e.target.value)}
            />
          )}
          <Button
            color="danger"
            size="sm"
            onPress={() => removeValidationRule(index)}
            startContent={<FaTimes />}
            className="ml-2"
          />
        </div>
      ))}
      <div className="mt-4">
        <Select
          label="Add Validation Rule"
          placeholder="Select rule type"
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as ValidationRuleType;
            addValidationRule(selectedKey);
          }}
        >
          {Object.values(ValidationRuleType).map((type) => (
            <SelectItem key={type} textValue={type}>
              {type}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default ValidationRulesEditor;
