"use client";

import React, { useState } from "react";
import { Input, Button, Radio, Checkbox, Spacer } from '@nextui-org/react';
import { prefabs } from '@/data/prefabs';
import { InputType, ValidationRuleType } from '@/types/FormEnums';
import { RadioGroup } from "@nextui-org/radio";
import { CheckboxGroup } from "@nextui-org/checkbox";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { AnswerCheckbox } from "@/components/public/questionnaire/answer-checkbox";
import { rule } from "postcss";
import { AnswerRadio } from "@/components/public/questionnaire/answer-radio";

export default function Questionnaire() {
  const form = prefabs[1]; // Assume we're using the first form; you can adjust as needed
  const fields = React.useMemo(
    () => form.groups.flatMap((group) => group.fields),
    [form.groups]
  );

  const [groupSelected, setGroupSelected] = useState([]);
  const choices = [
    { letter: "A", label: "Choice 1", value: "choice1" },
    { letter: "B", label: "Choice 2", value: "choice2" },
    { letter: "C", label: "Choice 3", value: "choice3" },
    { letter: "D", label: "Choice 4", value: "choice4" },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [buttonState, setButtonState] = React.useState({ label: 'Done', isError: false });
  const [isCompleted, setIsCompleted] = React.useState(false);

  const currentField = fields[currentQuestionIndex];
  const currentGroup = form.groups.find((group) => group.fields.includes(currentField));

  const handleInputChange = (value) => {
    setAnswers({
      ...answers,
      [currentField.id]: value,
    });
    setErrors({
      ...errors,
      [currentField.id]: null,
    });
    setButtonState({ label: 'Done', isError: false }); // Reset button state when input is modified
  };

  const validateInput = () => {
    const value = answers[currentField.id];
    const validationRules = currentField.validationRules || [];
    let error = null;

    for (let rule of validationRules) {
      switch (rule.type) {
        case ValidationRuleType.MIN_LENGTH:
          if (value.length < rule.value) {
            error = `Minimum length is ${rule.value}`;
            setButtonState({ label: 'Too short', isError: true });
          }
          break;
        case ValidationRuleType.MAX_LENGTH:
          if (value.length > rule.value) {
            error = `Maximum length is ${rule.value}`;
            setButtonState({ label: 'Too long', isError: true });
          }
          break;
        case ValidationRuleType.IS_EMAIL:
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Invalid email address';
            setButtonState({ label: 'Invalid email', isError: true });
          }
          break;
        case ValidationRuleType.REGEX_MATCH:
          const regex = new RegExp(rule.value);
          if (!regex.test(value)) {
            error = 'Invalid format';
            setButtonState({ label: 'Invalid format', isError: true });
          }
          break;
        default:
          break;
      }
      if (error) break;
    }

    if (!value && !currentField.optional) {
      error = 'This field is required';
      setButtonState({ label: 'Required', isError: true });
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

  const handleNext = () => {
    if (validateInput()) {
      if (currentQuestionIndex < fields.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setButtonState({ label: 'Done', isError: false }); // Reset button state for the next question
      } else {
        setIsCompleted(true);
      }
    }
  };

  const renderInputField = () => {
    const error = errors[currentField.id];
    const commonProps = {
      placeholder: currentField.label,
      value: answers[currentField.id] || '',
      onChange: (e) => handleInputChange(e.target.value),
      isInvalid: !!error,
      errorMessage: error,
      fullWidth: true,
    };

    switch (currentField.type) {
      case InputType.TEXT:
        return <Input variant="bordered" {...commonProps} />;
      case InputType.MULTIPLE_CHOICE:
        const isRadio = currentField.validationRules?.some(
          (rule) => rule.type === ValidationRuleType.IS_RADIO
        );
        const isMultipleChoice = currentField.validationRules?.some(
          (rule) => rule.type === ValidationRuleType.IS_MULTIPLE_CHOICE
        );

        if (isRadio) {
          return (
            <RadioGroup
              className="flex flex-col w-full py-3"
              // value={groupSelected}
              // onChange={setGroupSelected}
            >
              {choices.map((choice, index) => (
                <AnswerRadio key={choice.value} letter={choice.letter} value={choice.value}>
                  {choice.label}
                </AnswerRadio>
              ))}
            </RadioGroup>
          )
        } else if (isMultipleChoice) {
          return (
            <CheckboxGroup
              className="flex flex-col w-full py-3"
              // value={groupSelected}
              // onChange={setGroupSelected}
            >
              {choices.map((choice, index) => (
                <AnswerCheckbox key={choice.value} letter={choice.letter} value={choice.value}>
                  {choice.label}
                </AnswerCheckbox>
              ))}
            </CheckboxGroup>
        )
          ;
        }
        break;
      case InputType.DATE:
        return <Input type="date" variant="bordered" {...commonProps} />;
      case InputType.NUMBER:
        return <Input type="number" variant="bordered" {...commonProps} />;
      case InputType.GEOLOCATION:
        // TODO - Implement geolocation input
        return <div>Geolocation input not implemented yet.</div>;
      default:
        return <Input variant="bordered" {...commonProps} />;
    }
  };

  if (isCompleted) {
    return (
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <h3 className="text-lg font-bold">Merci pour vos réponses !</h3>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mt-18 mx-auto p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex} // Key helps AnimatePresence recognize changes
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col"
        >
          <span className="text-sm text-gray-500">{currentGroup.name}</span>
          <span className="text-xl font-semibold">{currentField.label}</span>
          <Spacer y={1} />
          {renderInputField()}
          <Spacer y={2} />
          <div className="w-full flex flex-row justify-end">
            <Button
              onClick={handleNext}
              color={buttonState.isError ? 'danger' : 'primary'}
              className="gap-4"
              endContent={buttonState.isError ? <FaExclamationTriangle /> : <FaCheck />}
            >
              {buttonState.label} {/* Button displays error message or 'Done' */}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
