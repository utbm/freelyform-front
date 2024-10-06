import React from "react";
import { useCheckbox, VisuallyHidden } from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

interface AnswerCheckboxProps {
  value: string; // Adjust the type if necessary
  letter: string;
  children: React.ReactNode;
}

export const AnswerCheckbox: React.FC<AnswerCheckboxProps> = ({ value, letter, children }) => {
  const { isSelected, getBaseProps, getInputProps, getLabelProps } = useCheckbox({
    value,
  });

  return (
    <label {...getBaseProps()} className="w-full">
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <motion.div
        initial={{ scale: 1, opacity: 0 }}
        animate={{
          scale: isSelected ? 1.02 : 1,
          opacity: 1,
        }}
        transition={{ duration: 0.3 }}
        className={`flex cursor-pointer items-center justify-between border p-2 rounded-lg 
            ${isSelected ? "bg-primary-foreground" : ""}`}
      >
        <div className="flex items-center">
          <div
            className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded text-black font-bold mr-4
                transition-all duration-300 ease-in-out"
          >
            {letter}
          </div>
          <span {...getLabelProps()}>{children}</span>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FaCheck className="text-primary" />
          </motion.div>
        )}
      </motion.div>
    </label>
  );
};
