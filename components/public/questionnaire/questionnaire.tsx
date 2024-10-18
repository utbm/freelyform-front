// Questionnaire.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Spacer } from "@nextui-org/react";
import { RadioGroup } from "@nextui-org/radio";
import { CheckboxGroup } from "@nextui-org/checkbox";
import { FaCheck, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";

import { InputType, ValidationRuleType } from "@/types/FormEnums";
import { Form, FormGroup, FormField, ValidationRule } from "@/types/FormTypes";
import { AnswerCheckbox } from "@/components/public/questionnaire/answer-checkbox";
import { AnswerRadio } from "@/components/public/questionnaire/answer-radio";
import { getPrefabById } from "@/services/prefabs";
import { throwConfettis } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { AnswerRequest } from "@/types/AnswerInterfaces";
import { createAnswer } from "@/services/answers";
import MapComponent from "@/components/public/questionnaire/map";

export default function Questionnaire({ params }: { params: { id: string } }) {
  // Initialize state variables with proper types
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [radioSelected, setRadioSelected] = useState<string | null>(null); // For Radio buttons
  const [checkboxSelected, setCheckboxSelected] = useState<string[]>([]); // For Checkboxes
  const [buttonState, setButtonState] = useState({
    label: "Done",
    isError: false,
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [redirecting, setRedirecting] = useState<boolean>(false); // New state variable
  const { token } = useAuth();

  // Fetch the form data when the component mounts
  useEffect(() => {
    async function fetchForm() {
      try {
        const response = await getPrefabById(token, params.id);
        const fetchedForm = response.data as Form;

        if (!fetchedForm.isActive) {
          setRedirecting(true); // Set redirecting to true
          router.push("/");

          return; // Return early to prevent further execution
        }

        setForm(fetchedForm);
        // Initialize fields after fetching the form
        setFields(
          fetchedForm.groups.flatMap((group: FormGroup) => group.fields),
        );
        setLoading(false); // Set loading to false only when form is active
      } catch (error) {
        toast.error("An error occurred while fetching the form (not found)");
        router.push("/prefabs");
        setLoading(false); // Set loading to false in case of error
      }
    }
    fetchForm();
  }, [params.id, router]);

  // Ensure currentField and currentGroup are safely defined
  const currentField: FormField | null =
    fields.length > 0 ? fields[currentQuestionIndex] : null;
  const currentGroup: FormGroup | undefined = form?.groups.find(
    (group: FormGroup) => currentField && group.fields.includes(currentField),
  );

  // Define handleNext and other functions
  const handleNext = async () => {
    if (!currentField) return;
    const isMultipleChoice: boolean =
      currentField.type === InputType.MULTIPLE_CHOICE;

    if (
      (isMultipleChoice && validateMultipleChoice()) ||
      (!isMultipleChoice && validateInput())
    ) {
      if (currentQuestionIndex < fields.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setButtonState({ label: "Done", isError: false }); // Reset button state for the next question
        resetSelectionStates(); // Reset selection states when moving to the next question
      } else {
        // Log the results and complete the questionnaire
        const answerRequest: AnswerRequest = logResults();

        setIsCompleted(true);
        try {
          await createAnswer(token, answerRequest);
          toast.success("Answers submitted successfully!");
          setTimeout(() => {
            router.push("/");
          }, 5000);
        } catch (error) {
          // @ts-ignore
          toast.error(error);
        }
      }
    }
  };

  // Updated useEffect to block Enter key when GEOLOCATION input is displayed
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent default behavior
        if (!loading && currentField?.type !== InputType.GEOLOCATION) {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [currentQuestionIndex, answers, loading, currentField]);

  // Handle loading state
  if (redirecting) {
    return null; // Do not render anything if redirecting
  }

  if (loading || !form || !currentField) {
    return (
      <div className="flex justify-center items-center mt-48">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  // Determine if the current input is a small input
  const isSmallInput: boolean = [
    InputType.TEXT,
    InputType.NUMBER,
    InputType.DATE,
  ].includes(currentField.type);

  // Set the appropriate margin-top class
  const marginTopClass = isSmallInput ? "mt-24" : "mt-18";

  const handleInputChange = (value: any) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentField!.id]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [currentField!.id]: null,
    }));
    setButtonState({ label: "Done", isError: false }); // Reset button state when input is modified
  };

  const validateInput = (): boolean => {
    if (!currentField) return false;
    const value = answers[currentField.id];
    const validationRules: ValidationRule[] =
      currentField.validationRules || [];
    let error: string | null = null;

    // Check for empty values based on input type
    const isEmptyValue = (): boolean => {
      switch (currentField.type) {
        case InputType.TEXT:
        case InputType.DATE:
          return value === null || value === undefined || value === "";
        case InputType.NUMBER:
          return (
            value === null ||
            value === undefined ||
            value === "" ||
            isNaN(Number(value))
          );
        case InputType.GEOLOCATION:
          return value === null || value === undefined;
        default:
          return value === null || value === undefined || value === "";
      }
    };

    if (isEmptyValue() && !currentField.optional) {
      error = "This field is required";
      setButtonState({ label: "Required", isError: true });
    }

    if (!error) {
      for (let rule of validationRules) {
        switch (rule.type) {
          case ValidationRuleType.MIN_LENGTH: {
            if (!value || (value as string).length < (rule.value as number)) {
              error = `Minimum length is ${rule.value}`;
              setButtonState({ label: "Too short", isError: true });
            }
            break;
          }
          case ValidationRuleType.MAX_LENGTH: {
            if (value && (value as string).length > (rule.value as number)) {
              error = `Maximum length is ${rule.value}`;
              setButtonState({ label: "Too long", isError: true });
            }
            break;
          }
          case ValidationRuleType.IS_EMAIL: {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (value && !emailRegex.test(value as string)) {
              error = "Invalid email address";
              setButtonState({ label: "Invalid email", isError: true });
            }
            break;
          }
          case ValidationRuleType.REGEX_MATCH: {
            const regex = new RegExp(rule.value as string);

            if (value && !regex.test(value as string)) {
              error = "Invalid format";
              setButtonState({ label: "Invalid format", isError: true });
            }
            break;
          }
          case ValidationRuleType.MIN_VALUE: {
            const numValue = Number(value);

            if (isNaN(numValue) || numValue < (rule.value as number)) {
              error = `Value must be at least ${rule.value}`;
              setButtonState({ label: `Min ${rule.value}`, isError: true });
            }
            break;
          }
          case ValidationRuleType.MAX_VALUE: {
            const numValue = Number(value);

            if (isNaN(numValue) || numValue > (rule.value as number)) {
              error = `Value must be at most ${rule.value}`;
              setButtonState({ label: `Max ${rule.value}`, isError: true });
            }
            break;
          }
          default:
            break;
        }
        if (error) break;
      }
    }

    if (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [currentField.id]: error,
      }));
      toast.error(error, { duration: 4000 }); // Show the error message in a toast

      return false;
    }

    return true;
  };

  const validateMultipleChoice = (): boolean => {
    if (!currentField) return false;
    const value = answers[currentField.id] || [];

    if (!currentField.optional && value.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [currentField.id]: "At least one option must be selected",
      }));
      toast.error("At least one option must be selected", { duration: 4000 });
      setButtonState({ label: "Required", isError: true });

      return false;
    }

    return true;
  };

  const handlePrevious = () => {
    if (!currentField) return;
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setButtonState({ label: "Done", isError: false }); // Reset button state for the previous question

      // Reset selection states for radio and checkbox inputs based on previous answers
      const previousField = fields[currentQuestionIndex - 1];
      const previousAnswer = answers[previousField.id];

      if (previousField.type === InputType.MULTIPLE_CHOICE) {
        const isRadio = previousField.validationRules?.some(
          (rule: ValidationRule) => rule.type === ValidationRuleType.IS_RADIO,
        );

        if (isRadio) {
          setRadioSelected(previousAnswer || null);
        } else {
          setCheckboxSelected(previousAnswer || []);
        }
      }
    }
  };

  // Function to reset selection states when moving to the next question
  const resetSelectionStates = () => {
    if (!currentField) return;
    if (currentField.type === InputType.MULTIPLE_CHOICE) {
      const isRadio = currentField.validationRules?.some(
        (rule: ValidationRule) => rule.type === ValidationRuleType.IS_RADIO,
      );

      if (isRadio) {
        setRadioSelected(null);
      } else {
        setCheckboxSelected([]);
      }
    }
  };

  // Function to log results in the format of the prefab
  const logResults = () => {
    let result = form!.groups.map((group: FormGroup) => {
      return {
        group: group.name,
        questions: group.fields.map((field: FormField) => ({
          question: field.label,
          answer: answers[field.id] || "No answer",
        })),
      };
    });
    const answerRequest: AnswerRequest = {
      answers: result,
    };

    throwConfettis();

    return answerRequest;
  };

  // Function to get the column letter(s) for a given index
  const getColumnLetter = (index: number): string => {
    let result = "";
    let tempIndex = index;

    while (tempIndex >= 0) {
      result = String.fromCharCode((tempIndex % 26) + 65) + result;
      tempIndex = Math.floor(tempIndex / 26) - 1;
    }

    return result;
  };

  const renderInputField = () => {
    if (!currentField) return null;
    const error = errors[currentField.id];
    const commonProps = {
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
          (rule: ValidationRule) => rule.type === ValidationRuleType.IS_RADIO,
        );
        const isMultipleChoice = currentField.validationRules?.some(
          (rule: ValidationRule) =>
            rule.type === ValidationRuleType.IS_MULTIPLE_CHOICE,
        );

        if (isRadio && currentField.options && currentField.options.choices) {
          return (
            <RadioGroup
              className="flex flex-col w-full py-3"
              value={
                radioSelected !== null
                  ? radioSelected
                  : answers[currentField.id] || null
              }
              onValueChange={(val: string) => {
                setRadioSelected(val);
                handleInputChange(val);
              }}
            >
              {currentField.options.choices.map(
                (choice: string, index: number) => (
                  <AnswerRadio
                    key={choice}
                    letter={getColumnLetter(index)}
                    value={choice}
                  >
                    {choice}
                  </AnswerRadio>
                ),
              )}
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
              value={
                checkboxSelected.length > 0
                  ? checkboxSelected
                  : answers[currentField.id] || []
              }
              onChange={(vals: string[]) => {
                setCheckboxSelected(vals);
                handleInputChange(vals);
              }}
            >
              {currentField.options.choices.map(
                (choice: string, index: number) => (
                  <AnswerCheckbox
                    key={choice}
                    letter={getColumnLetter(index)}
                    value={choice}
                  >
                    {choice}
                  </AnswerCheckbox>
                ),
              )}
            </CheckboxGroup>
          );
        }
        break;
      }
      case InputType.DATE: {
        return <Input type="date" variant="bordered" {...commonProps} />;
      }
      case InputType.NUMBER: {
        // Extract min and max values from validation rules
        let minValue: number | undefined = undefined;
        let maxValue: number | undefined = undefined;

        if (currentField.validationRules) {
          currentField.validationRules.forEach((rule: ValidationRule) => {
            if (rule.type === ValidationRuleType.MIN_VALUE) {
              minValue = rule.value as number;
            }
            if (rule.type === ValidationRuleType.MAX_VALUE) {
              maxValue = rule.value as number;
            }
          });
        }

        return (
          <Input
            type="number"
            variant="bordered"
            {...commonProps}
            max={maxValue}
            min={minValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value;
              let numValue = Number(value);

              if (!isNaN(numValue)) {
                if (minValue !== undefined && numValue < minValue) {
                  numValue = minValue;
                }
                if (maxValue !== undefined && numValue > maxValue) {
                  numValue = maxValue;
                }
                handleInputChange(numValue.toString());
              } else {
                // If the input is not a number, reset to empty string
                handleInputChange("");
              }
            }}
          />
        );
      }
      case InputType.GEOLOCATION: {
        return (
          <div className="w-full my-4">
            <div className="h-96">
              <MapComponent onLocationChange={handleInputChange} />
            </div>
          </div>
        );
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
    <div className={`max-w-lg ${marginTopClass} mx-auto p-8`}>
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
          <span className="text-xl font-semibold flex items-center">
            {currentField.label}
            {!currentField.optional && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </span>
          <Spacer y={1} />
          {renderInputField()}
          <Spacer y={2} />
          <div className="w-full flex flex-row justify-between mt-4">
            {/* Conditionally render the Back button */}
            {currentQuestionIndex > 0 && (
              <Button
                className="gap-2"
                color="secondary"
                startContent={<FaArrowLeft />}
                onClick={handlePrevious}
              >
                Back
              </Button>
            )}
            <div className="flex-1" />
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
