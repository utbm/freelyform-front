// components/AnswerViewer.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Input, Button, Spacer } from "@nextui-org/react";
import { RadioGroup } from "@nextui-org/radio";
import { CheckboxGroup } from "@nextui-org/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { Answer, AnswerGroup, AnswerQuestion } from "@/types/AnswerInterfaces";
import { getAnswerById } from "@/services/answers";
import { InputType } from "@/types/FormEnums";
import { AnswerRadio } from "@/components/public/questionnaire/answer-radio";
import { AnswerCheckbox } from "@/components/public/questionnaire/answer-checkbox";
import MapComponent from "@/components/public/questionnaire/map";

interface AnswerViewerProps {
  prefabId: string;
  answerId: string;
}

interface FlattenedQuestion {
  group: string;
  question: AnswerQuestion;
}

const AnswerViewer: React.FC<AnswerViewerProps> = ({ prefabId, answerId }) => {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [flattenedQuestions, setFlattenedQuestions] = useState<
    FlattenedQuestion[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  useEffect(() => {
    async function fetchAnswer() {
      try {
        const fetchedAnswer = await getAnswerById(prefabId, answerId);

        setAnswer(fetchedAnswer);

        // Flatten the questions from all groups
        const allQuestions: FlattenedQuestion[] = fetchedAnswer.answers.flatMap(
          (group: AnswerGroup) =>
            group.questions.map((question: AnswerQuestion) => ({
              group: group.group,
              question,
            })),
        );

        setFlattenedQuestions(allQuestions);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnswer();
  }, [prefabId, answerId]);

  useEffect(() => {
    // Ensure currentQuestionIndex stays within bounds
    const totalQuestions = flattenedQuestions.length;
    const safeCurrentIndex = Math.min(
      Math.max(currentQuestionIndex, 0),
      totalQuestions - 1,
    );

    if (safeCurrentIndex !== currentQuestionIndex) {
      setCurrentQuestionIndex(safeCurrentIndex);
    }
  }, [currentQuestionIndex, flattenedQuestions]);

  const handleNext = () => {
    if (currentQuestionIndex < flattenedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-gray-700 text-xl">
          No answer data available.
        </div>
      </div>
    );
  }

  // Verify that flattenedQuestions is a non-empty array
  if (!Array.isArray(flattenedQuestions) || flattenedQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-gray-700 text-xl">
          No questions available.
        </div>
      </div>
    );
  }

  const totalQuestions = flattenedQuestions.length;
  const safeCurrentIndex = Math.min(
    Math.max(currentQuestionIndex, 0),
    totalQuestions - 1,
  );
  const { group, question } = flattenedQuestions[safeCurrentIndex];

  return (
    <div className="max-w-lg mx-auto px-8 min-h-screen flex flex-col mt-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Questionnaire Results
      </h1>
      <AnimatePresence mode="wait">
        <motion.div
          key={safeCurrentIndex} // Unique key to trigger animation
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
          exit={{ opacity: 0, x: -100 }}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <h2 className="text-xl font-semibold mb-2">{group}</h2>
          <div className="mt-2">
            <span className="text-lg font-medium">{question.question}</span>
            <div className="mt-2 text-gray-700">
              {renderReadOnlyField(question)}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <Spacer y={4} />
      <div className="flex justify-between">
        <Button
          color="secondary"
          isDisabled={safeCurrentIndex === 0}
          startContent={<FaArrowLeft />}
          onClick={handlePrevious}
        >
          Back
        </Button>
        <Button
          color="primary"
          endContent={<FaArrowRight />}
          isDisabled={safeCurrentIndex === totalQuestions - 1}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// Helper function to get column letters for choices
function getColumnLetter(index: number): string {
  let result = "";
  let tempIndex = index;

  while (tempIndex >= 0) {
    result = String.fromCharCode((tempIndex % 26) + 65) + result;
    tempIndex = Math.floor(tempIndex / 26) - 1;
  }

  return result;
}

// Render fields in a read-only mode to match Questionnaire.tsx layout
function renderReadOnlyField(question: AnswerQuestion) {
  switch (question.type) {
    case InputType.TEXT:
    case InputType.NUMBER:
    case InputType.DATE:
      return (
        <Input
          fullWidth
          readOnly
          value={
            question.answer !== null && question.answer !== undefined
              ? String(question.answer)
              : ""
          }
          variant="bordered"
        />
      );

    case InputType.MULTIPLE_CHOICE:
      if (Array.isArray(question.answer)) {
        return (
          <CheckboxGroup
            isDisabled
            className="flex flex-col w-full py-3"
            value={question.answer as string[]}
          >
            {(question.answer as string[]).map((choice, index) => (
              <AnswerCheckbox
                key={choice}
                letter={getColumnLetter(index)}
                value={choice}
              >
                {choice}
              </AnswerCheckbox>
            ))}
          </CheckboxGroup>
        );
      } else {
        return (
          <RadioGroup
            isDisabled
            className="flex flex-col w-full py-3"
            value={question.answer as string}
          >
            <AnswerRadio
              letter={getColumnLetter(0)}
              value={question.answer as string}
            >
              {question.answer as string}
            </AnswerRadio>
          </RadioGroup>
        );
      }

    case InputType.GEOLOCATION:
      const { lat, lng } = question.answer as { lat: number; lng: number };

      return (
        <div className="w-full my-4">
          <div className="h-96">
            <MapComponent
              readOnly
              onLocationChange={() => {}}
              // @ts-ignore
              initialPosition={{ lat, lng }}
            />
          </div>
        </div>
      );

    default:
      return (
        <Input
          fullWidth
          readOnly
          value={
            question.answer !== null && question.answer !== undefined
              ? String(question.answer)
              : ""
          }
          variant="bordered"
        />
      );
  }
}

export default AnswerViewer;
