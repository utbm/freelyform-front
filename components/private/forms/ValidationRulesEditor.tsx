// components/private/forms/ValidationRulesEditor.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Input, Select, Popover, PopoverTrigger, Button, PopoverContent, SelectItem } from "@nextui-org/react";
import { ValidationRule } from "@/types/FormTypes";
import { ValidationRuleType, InputType } from "@/types/FormEnums";
import { getAvailableValidationRules } from "@/lib/utils";
import { Switch } from "@nextui-org/switch";

interface ValidationRulesEditorProps {
  validationRules: ValidationRule[];
  onUpdateValidationRules: (rules: ValidationRule[]) => void;
  inputType: InputType; // Accept inputType as a prop to dynamically filter rules
}

const ValidationRulesEditor: React.FC<ValidationRulesEditorProps> = ({
                                                                       validationRules,
                                                                       onUpdateValidationRules,
                                                                       inputType,
                                                                     }) => {
  const [localRules, setLocalRules] = useState<ValidationRule[]>(validationRules); // Local state for validation rules
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [multipleChoiceType, setMultipleChoiceType] = useState<string | null>(null); // State for dropdown selection

  useEffect(() => {
    // Reset local validation rules if inputType changes
    const radioRule = localRules.find(rule => rule.type === ValidationRuleType.IS_RADIO);
    const multipleChoiceRule = localRules.find(rule => rule.type === ValidationRuleType.IS_MULTIPLE_CHOICE);

    if (radioRule) {
      setMultipleChoiceType('is_radio');
    } else if (multipleChoiceRule) {
      setMultipleChoiceType('is_multiple_choice');
    } else {
      setMultipleChoiceType(null); // Reset the dropdown selection
    }
    setIsPopoverOpen(false); // Close the popover when the input type changes
  }, [inputType, localRules]);

  const handleMultipleChoiceTypeChange = (type: string) => {
    let updatedRules = [...localRules];
    if (type === 'is_radio') {
      // Remove 'is_multiple_choice' if it exists and add 'is_radio'
      updatedRules = updatedRules.filter(rule => rule.type !== ValidationRuleType.IS_MULTIPLE_CHOICE);
      updatedRules.push({ type: ValidationRuleType.IS_RADIO });
      setMultipleChoiceType('is_radio');
    } else if (type === 'is_multiple_choice') {
      // Remove 'is_radio' if it exists and add 'is_multiple_choice'
      updatedRules = updatedRules.filter(rule => rule.type !== ValidationRuleType.IS_RADIO);
      updatedRules.push({ type: ValidationRuleType.IS_MULTIPLE_CHOICE });
      setMultipleChoiceType('is_multiple_choice');
    }
    setLocalRules(updatedRules);
    onUpdateValidationRules(updatedRules);
  };

  // Toggle validation rule (used for non-MULTIPLE_CHOICE types)
  const toggleValidationRule = (type: ValidationRuleType) => {
    let updatedRules = [...localRules];
    const ruleIndex = updatedRules.findIndex((rule) => rule.type === type);

    if (ruleIndex !== -1) {
      // Remove the rule if it exists
      updatedRules.splice(ruleIndex, 1);
    } else {
      // Add the rule
      updatedRules.push({ type });
    }

    setLocalRules(updatedRules); // Update the local state
    onUpdateValidationRules(updatedRules); // Sync the state with the parent component
  };

  // Get the current value of a rule
  const getRuleValue = (type: ValidationRuleType) => {
    const rule = localRules.find((rule) => rule.type === type);
    return rule?.value || '';
  };

  // Update the value of a validation rule (e.g., for regex or length)
  const updateValidationRuleValue = (type: ValidationRuleType, value: any) => {
    const updatedRules = localRules.map((rule) => {
      if (rule.type === type) {
        return { ...rule, value };
      }
      return rule;
    });
    setLocalRules(updatedRules); // Update the local state
    onUpdateValidationRules(updatedRules); // Sync the state with the parent component
  };

  // Get available validation rules based on input type
  const availableRules = getAvailableValidationRules(inputType);

  // Hide the "Rules" button for DATE and GEOLOCATION input types
  if (inputType === InputType.DATE || inputType === InputType.GEOLOCATION) {
    return null;
  }

  return (
    <div>
      <Popover
        isOpen={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
      >
        <PopoverTrigger>
          <Button
            size="sm"
            color="success"
            onPress={() => setIsPopoverOpen(true)}
          >
            Rules
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4 min-w-52">
            {inputType === InputType.MULTIPLE_CHOICE ? (
              // Render dropdown for MULTIPLE_CHOICE input type
              <div className="mb-4">
                <Select
                  fullWidth
                  className="min-w-14"
                  size="md"
                  placeholder="Select multiple choice type"
                  selectedKeys={multipleChoiceType ? new Set([multipleChoiceType]) : undefined}
                  onSelectionChange={(keys) => handleMultipleChoiceTypeChange(Array.from(keys)[0] as string)}
                >
                  <SelectItem key="is_radio">Radio Choice</SelectItem>
                  <SelectItem key="is_multiple_choice">Multiple Choice</SelectItem>
                </Select>
              </div>
            ) : (
              // Render regular validation rules for other input types
              availableRules.map((type) => (
                <div key={type} className="mb-4">
                  <div className="flex items-center justify-between gap-x-4">
                    <span>{type === ValidationRuleType.IS_EMAIL
                      ? 'Is Email' : type === ValidationRuleType.MAX_LENGTH
                        ? 'Max Length' : type === ValidationRuleType.MIN_LENGTH
                          ? 'Min Length' : 'Regex Match'}</span>
                    <Switch
                      size="sm"
                      checked={localRules.some((rule) => rule.type === type)}
                      onChange={() => toggleValidationRule(type)}
                    />
                  </div>
                  {/* Display input fields for applicable rules */}
                  {type === ValidationRuleType.MAX_LENGTH && localRules.some((rule) => rule.type === type) && (
                    <div className="mt-2">
                      <Input
                        type="number" // Number type for max length
                        fullWidth
                        size="sm"
                        placeholder="Enter max length"
                        value={getRuleValue(ValidationRuleType.MAX_LENGTH)}
                        onChange={(e) => updateValidationRuleValue(ValidationRuleType.MAX_LENGTH, e.target.value)}
                      />
                    </div>
                  )}
                  {type === ValidationRuleType.MIN_LENGTH && localRules.some((rule) => rule.type === type) && (
                    <div className="mt-2">
                      <Input
                        type="number" // Number type for min length
                        fullWidth
                        size="sm"
                        placeholder="Enter min length"
                        value={getRuleValue(ValidationRuleType.MIN_LENGTH)}
                        onChange={(e) => updateValidationRuleValue(ValidationRuleType.MIN_LENGTH, e.target.value)}
                      />
                    </div>
                  )}
                  {type === ValidationRuleType.REGEX_MATCH && localRules.some((rule) => rule.type === type) && (
                    <div className="mt-2">
                      <Input
                        fullWidth
                        size="sm"
                        placeholder="Enter regex"
                        value={getRuleValue(ValidationRuleType.REGEX_MATCH)}
                        onChange={(e) => updateValidationRuleValue(ValidationRuleType.REGEX_MATCH, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ValidationRulesEditor;
