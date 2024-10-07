"use client";

import React, { useState } from "react";
import { Input, Button, Spacer } from "@nextui-org/react";
import { RadioGroup } from "@nextui-org/radio";
import { CheckboxGroup } from "@nextui-org/checkbox";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { InputType, ValidationRuleType } from "@/types/FormEnums";
import { prefabs } from "@/data/prefabs";
import { AnswerCheckbox } from "@/components/public/questionnaire/answer-checkbox";
import { AnswerRadio } from "@/components/public/questionnaire/answer-radio";

export default function Questionnaire() {
  const form = prefabs[1]; // Assume we're using the first form; you can adjust as needed
  const fields = React.useMemo(
    () => form.groups.flatMap((group) => group.fields),
    [form.groups],
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [radioSelected, setRadioSelected] = useState<string | null>(null); // For Radio buttons
  const [checkboxSelected, setCheckboxSelected] = useState<string[]>([]); // For Checkboxes
  const [buttonState, setButtonState] = useState({
    label: "Done",
    isError: false,
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const currentField = fields[currentQuestionIndex];
  const currentGroup = form.groups.find((group) =>
    group.fields.includes(currentField),
  );

  const handleInputChange = (value: string | string[] | null) => {
    setAnswers({
      ...answers,
      [currentField.id]: value,
    });
    setErrors({
      ...errors,
      [currentField.id]: null,
    });
    setButtonState({ label: "Done", isError: false }); // Reset button state when input is modified
  };

  const validateInput = () => {
    const value = answers[currentField.id];
    const validationRules = currentField.validationRules || [];
    let error: string | null = null;

    for (let rule of validationRules) {
      switch (rule.type) {
        case ValidationRuleType.MIN_LENGTH: {
          if ((value as string).length < rule.value) {
            error = `Minimum length is ${rule.value}`;
            setButtonState({ label: "Too short", isError: true });
          }
          break;
        }
        case ValidationRuleType.MAX_LENGTH: {
          if ((value as string).length > rule.value) {
            error = `Maximum length is ${rule.value}`;
            setButtonState({ label: "Too long", isError: true });
          }
          break;
        }
        case ValidationRuleType.IS_EMAIL: {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Moved inside block

          if (!emailRegex.test(value as string)) {
            error = "Invalid email address";
            setButtonState({ label: "Invalid email", isError: true });
          }
          break;
        }
        case ValidationRuleType.REGEX_MATCH: {
          const regex = new RegExp(rule.value); // Moved inside block

          if (!regex.test(value as string)) {
            error = "Invalid format";
            setButtonState({ label: "Invalid format", isError: true });
          }
          break;
        }
        default:
          break;
      }
      if (error) break;
    }

    if (!value && !currentField.optional) {
      error = "This field is required";
      setButtonState({ label: "Required", isError: true });
    }

    if (error) {
      setErrors({
        ...errors,
        [currentField.id]: error,
      });
      toast.error(error, { duration: 4000 }); // Show the error message in a toast

      return false;
    }

    return true;
  };

  const validateMultipleChoice = () => {
    const value = answers[currentField.id] || [];

    if (!currentField.optional && value.length === 0) {
      setErrors({
        ...errors,
        [currentField.id]: "At least one option must be selected",
      });
      toast.error("At least one option must be selected", { duration: 4000 });
      setButtonState({ label: "Required", isError: true });

      return false;
    }

    return true;
  };

  const handleNext = () => {
    const isMultipleChoice = currentField.type === InputType.MULTIPLE_CHOICE;

    if ((isMultipleChoice && validateMultipleChoice()) || validateInput()) {
      if (currentQuestionIndex < fields.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setButtonState({ label: "Done", isError: false }); // Reset button state for the next question
      } else {
        // Log the results and complete the questionnaire
        logResults();
        setIsCompleted(true);
      }
    }
  };

  // Function to log results in the format of the prefab
  const logResults = () => {
    const result = form.groups.map((group) => {
      return {
        group: group.name,
        questions: group.fields.map((field) => ({
          question: field.label,
          answer: answers[field.id] || "No answer",
        })),
      };
    });

    // console.log(result);
    return result;
    // TODO : Implement a way to send the results to the server
  };

  const renderInputField = () => {
    const error = errors[currentField.id];
    const commonProps = {
      placeholder: currentField.label,
      value: answers[currentField.id] || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange(e.target.value),
      isInvalid: !!error,
      errorMessage: error,
      fullWidth: true,
    };

    switch (currentField.type) {
      case InputType.TEXT: {
        return <Input variant="bordered" {...commonProps} />;
      }
      case InputType.MULTIPLE_CHOICE: {
        const isRadio = currentField.validationRules?.some(
          (rule) => rule.type === ValidationRuleType.IS_RADIO,
        );
        const isMultipleChoice = currentField.validationRules?.some(
          (rule) => rule.type === ValidationRuleType.IS_MULTIPLE_CHOICE,
        );

        if (isRadio && currentField.options && currentField.options.choices) {
          return (
            <RadioGroup
              className="flex flex-col w-full py-3"
              value={radioSelected}
              onValueChange={(val: string) => {
                setRadioSelected(val);
                handleInputChange(val);
              }}
            >
              {currentField.options.choices.map((choice, index) => (
                <AnswerRadio
                  key={choice}
                  letter={String.fromCharCode(65 + index)}
                  value={choice}
                >
                  {choice}
                </AnswerRadio>
              ))}
            </RadioGroup>
          );
        } else if (
          isMultipleChoice &&
          currentField.options &&
          currentField.options.choices
        ) {
          return (
            <CheckboxGroup
              className="flex flex-col w-full py-3"
              value={checkboxSelected}
              onChange={(vals: string[]) => {
                setCheckboxSelected(vals);
                handleInputChange(vals);
              }}
            >
              {currentField.options.choices.map((choice, index) => (
                <AnswerCheckbox
                  key={choice}
                  letter={String.fromCharCode(65 + index)}
                  value={choice}
                >
                  {choice}
                </AnswerCheckbox>
              ))}
            </CheckboxGroup>
          );
        }
        break;
      }
      case InputType.DATE: {
        return <Input type="date" variant="bordered" {...commonProps} />;
      }
      case InputType.NUMBER: {
        return <Input type="number" variant="bordered" {...commonProps} />;
      }
      case InputType.GEOLOCATION: {
        // TODO - Implement geolocation input
        return <div>Geolocation input not implemented yet.</div>;
      }
      default: {
        return <Input variant="bordered" {...commonProps} />;
      }
    }
  };

  if (isCompleted) {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-8"
        exit={{ opacity: 0, y: -50 }}
        initial={{ opacity: 0, y: 50 }}
      >
        <h3 className="mt-48 text-3xl font-bold">Merci pour vos réponses !</h3>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mt-18 mx-auto p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex} // Key helps AnimatePresence recognize changes
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
          exit={{ opacity: 0, y: -50 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-sm text-gray-500">
            {currentGroup?.name ?? "Unknown Group"}{" "}
            {/* Add safeguard for undefined group */}
          </span>
          <span className="text-xl font-semibold">{currentField.label}</span>
          <Spacer y={1} />
          {renderInputField()}
          <Spacer y={2} />
          <div className="w-full flex flex-row justify-end">
            <Button
              className="gap-4"
              color={buttonState.isError ? "danger" : "primary"}
              endContent={
                buttonState.isError ? <FaExclamationTriangle /> : <FaCheck />
              }
              onClick={handleNext}
            >
              {buttonState.label}{" "}
              {/* Button displays error message or 'Done' */}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
