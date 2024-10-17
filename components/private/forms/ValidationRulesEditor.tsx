// components/private/forms/ValidationRulesEditor.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  SelectItem,
} from "@nextui-org/react";
import { Switch } from "@nextui-org/switch";

import { ValidationRule } from "@/types/FormTypes";
import { ValidationRuleType, InputType } from "@/types/FormEnums";
import { getAvailableValidationRules } from "@/lib/utils";

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
  const [localRules, setLocalRules] =
    useState<ValidationRule[]>(validationRules); // Local state for validation rules
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [multipleChoiceType, setMultipleChoiceType] = useState<string | null>(
    null,
  ); // State for dropdown selection
  const [errors, setErrors] = useState<{
    [key in ValidationRuleType]?: string;
  }>({}); // State for validation errors

  // Synchronize localRules with validationRules prop
  useEffect(() => {
    setLocalRules(validationRules);
  }, [validationRules]);

  useEffect(() => {
    setIsPopoverOpen(false); // Close the popover when the input type changes

    setLocalRules((prevLocalRules) => {
      let updatedRules = [...prevLocalRules];

      if (inputType === InputType.MULTIPLE_CHOICE) {
        // Check if IS_RADIO or IS_MULTIPLE_CHOICE rules exist
        const radioRule = updatedRules.find(
          (rule) => rule.type === ValidationRuleType.IS_RADIO,
        );
        const multipleChoiceRule = updatedRules.find(
          (rule) => rule.type === ValidationRuleType.IS_MULTIPLE_CHOICE,
        );

        if (radioRule) {
          setMultipleChoiceType("is_radio");
        } else if (multipleChoiceRule) {
          setMultipleChoiceType("is_multiple_choice");
        } else {
          // Neither rule exists, default to IS_RADIO
          setMultipleChoiceType("is_radio");

          // Add IS_RADIO to updatedRules
          updatedRules = [
            ...updatedRules,
            { type: ValidationRuleType.IS_RADIO },
          ];
          onUpdateValidationRules(updatedRules);
        }
      } else {
        setMultipleChoiceType(null);

        // Remove IS_RADIO and IS_MULTIPLE_CHOICE from updatedRules
        const newRules = updatedRules.filter(
          (rule) =>
            rule.type !== ValidationRuleType.IS_RADIO &&
            rule.type !== ValidationRuleType.IS_MULTIPLE_CHOICE,
        );

        if (newRules.length !== updatedRules.length) {
          updatedRules = newRules;
          onUpdateValidationRules(updatedRules);
        }
      }

      return updatedRules;
    });
  }, [inputType]);

  const handleMultipleChoiceTypeChange = (type: string) => {
    let updatedRules = [...localRules];

    if (type === "is_radio") {
      // Remove 'is_multiple_choice' if it exists and add 'is_radio'
      updatedRules = updatedRules.filter(
        (rule) => rule.type !== ValidationRuleType.IS_MULTIPLE_CHOICE,
      );
      updatedRules.push({ type: ValidationRuleType.IS_RADIO });
      setMultipleChoiceType("is_radio");
    } else if (type === "is_multiple_choice") {
      // Remove 'is_radio' if it exists and add 'is_multiple_choice'
      updatedRules = updatedRules.filter(
        (rule) => rule.type !== ValidationRuleType.IS_RADIO,
      );
      updatedRules.push({ type: ValidationRuleType.IS_MULTIPLE_CHOICE });
      setMultipleChoiceType("is_multiple_choice");
    }
    setLocalRules(updatedRules);
    onUpdateValidationRules(updatedRules);

    // Validate coherence if necessary
    validateMinMaxValues(updatedRules);
  };

  // Toggle validation rule (used for non-MULTIPLE_CHOICE types)
  const toggleValidationRule = (type: ValidationRuleType) => {
    let updatedRules = [...localRules];
    const ruleIndex = updatedRules.findIndex((rule) => rule.type === type);

    if (ruleIndex !== -1) {
      // Remove the rule if it exists
      updatedRules.splice(ruleIndex, 1);
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };

        delete newErrors[type];

        return newErrors;
      });
    } else {
      // Add the rule
      updatedRules.push({ type });
    }

    setLocalRules(updatedRules); // Update the local state
    onUpdateValidationRules(updatedRules); // Sync the state with the parent component

    // Validate coherence if necessary
    if (
      type === ValidationRuleType.MIN_VALUE ||
      type === ValidationRuleType.MAX_VALUE
    ) {
      validateMinMaxValues(updatedRules);
    }
  };

  // Get the current value of a rule
  const getRuleValue = (type: ValidationRuleType) => {
    const rule = localRules.find((rule) => rule.type === type);

    return rule?.value || "";
  };

  // Update the value of a validation rule (e.g., for regex or length)
  const updateValidationRuleValue = (type: ValidationRuleType, value: any) => {
    let updatedRules = localRules.map((rule) => {
      if (rule.type === type) {
        return { ...rule, value };
      }

      return rule;
    });

    setLocalRules(updatedRules); // Update the local state
    onUpdateValidationRules(updatedRules); // Sync the state with the parent component

    // Validate coherence between MIN_VALUE and MAX_VALUE
    if (
      type === ValidationRuleType.MIN_VALUE ||
      type === ValidationRuleType.MAX_VALUE
    ) {
      validateMinMaxValues(updatedRules);
    }
  };

  // Validate that MIN_VALUE <= MAX_VALUE
  const validateMinMaxValues = (rules: ValidationRule[]) => {
    const minRule = rules.find(
      (rule) => rule.type === ValidationRuleType.MIN_VALUE,
    );
    const maxRule = rules.find(
      (rule) => rule.type === ValidationRuleType.MAX_VALUE,
    );

    const minValue = minRule ? Number(minRule.value) : undefined;
    const maxValue = maxRule ? Number(maxRule.value) : undefined;

    let newErrors: { [key in ValidationRuleType]?: string } = {};

    if (
      minValue !== undefined &&
      maxValue !== undefined &&
      !isNaN(minValue) &&
      !isNaN(maxValue)
    ) {
      if (minValue > maxValue) {
        newErrors[ValidationRuleType.MIN_VALUE] =
          "Min value cannot be greater than Max value";
        newErrors[ValidationRuleType.MAX_VALUE] =
          "Max value cannot be less than Min value";
      }
    }

    setErrors(newErrors);
  };

  // Get available validation rules based on input type
  const availableRules = getAvailableValidationRules(inputType);

  // Hide the "Rules" button for DATE and GEOLOCATION input types
  if (inputType === InputType.DATE || inputType === InputType.GEOLOCATION) {
    return null;
  }

  return (
    <div>
      <Popover isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger>
          <Button
            color="success"
            size="sm"
            // Removed onPress to prevent popover from closing when toggling switches
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
                  placeholder="Select multiple choice type"
                  selectedKeys={
                    multipleChoiceType
                      ? new Set([multipleChoiceType])
                      : undefined
                  }
                  size="md"
                  onSelectionChange={(keys) =>
                    handleMultipleChoiceTypeChange(
                      Array.from(keys)[0] as string,
                    )
                  }
                >
                  <SelectItem key="is_radio">Radio Choice</SelectItem>
                  <SelectItem key="is_multiple_choice">
                    Multiple Choice
                  </SelectItem>
                </Select>
              </div>
            ) : (
              // Render regular validation rules for other input types
              availableRules.map((type) => (
                <div key={type} className="mb-4">
                  <div className="flex items-center justify-between gap-x-4">
                    <span>
                      {type === ValidationRuleType.IS_EMAIL
                        ? "Is Email"
                        : type === ValidationRuleType.MAX_LENGTH
                          ? "Max Length"
                          : type === ValidationRuleType.MIN_LENGTH
                            ? "Min Length"
                            : type === ValidationRuleType.REGEX_MATCH
                              ? "Regex Match"
                              : type === ValidationRuleType.MAX_VALUE
                                ? "Max Value"
                                : type === ValidationRuleType.MIN_VALUE
                                  ? "Min Value"
                                  : ""}
                    </span>
                    <Switch
                      classNames={{
                        wrapper: "mr-0",
                      }}
                      color="success"
                      isSelected={localRules.some((rule) => rule.type === type)}
                      size="sm"
                      onChange={() => toggleValidationRule(type)}
                    />
                  </div>
                  {/* Display input fields for applicable rules */}
                  {(type === ValidationRuleType.MAX_LENGTH ||
                    type === ValidationRuleType.MIN_LENGTH ||
                    type === ValidationRuleType.MAX_VALUE ||
                    type === ValidationRuleType.MIN_VALUE ||
                    type === ValidationRuleType.REGEX_MATCH) &&
                    localRules.some((rule) => rule.type === type) && (
                      <div className="mt-2">
                        <Input
                          fullWidth
                          errorMessage={errors[type]}
                          isInvalid={!!errors[type]}
                          placeholder={
                            type === ValidationRuleType.MAX_LENGTH
                              ? "Enter max length"
                              : type === ValidationRuleType.MIN_LENGTH
                                ? "Enter min length"
                                : type === ValidationRuleType.MAX_VALUE
                                  ? "Enter max value"
                                  : type === ValidationRuleType.MIN_VALUE
                                    ? "Enter min value"
                                    : "Enter regex"
                          }
                          size="sm"
                          type={
                            type === ValidationRuleType.REGEX_MATCH
                              ? "text"
                              : "number"
                          } // Use text for regex
                          value={getRuleValue(type)}
                          onChange={(e) =>
                            updateValidationRuleValue(
                              type,
                              type === ValidationRuleType.REGEX_MATCH
                                ? e.target.value
                                : e.target.value,
                            )
                          }
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
