import React, { useState } from "react";
import { Accordion, AccordionItem, Button, Input } from "@nextui-org/react";
import { FaTimes } from "react-icons/fa";

interface MultipleChoiceOptionsEditorProps {
  choices: string[];
  onUpdateChoices: (choices: string[]) => void;
}

const MultipleChoiceOptionsEditor: React.FC<MultipleChoiceOptionsEditorProps> = ({ choices, onUpdateChoices }) => {
  const [newChoice, setNewChoice] = useState("");

  const addChoice = () => {
    if (newChoice.trim() !== "") {
      onUpdateChoices([...choices, newChoice.trim()]);
      setNewChoice("");
    }
  };

  const itemClasses = {
    title: "font-normal text-medium",
    trigger: "py-0 mt-3",
  };

  const removeChoice = (index: number) => {
    const updatedChoices = choices.filter((_, i) => i !== index);
    onUpdateChoices(updatedChoices);
  };

  return (
    <Accordion itemClasses={itemClasses}>
      <AccordionItem key="1" aria-label="Choices" title="Choices">
        <div>
          {choices.map((choice, index) => (
            <div key={index} className="flex items-center justify-between mt-2 border p-2 rounded-lg">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded text-black font-bold mr-4">
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{choice}</span>
              </div>
              <Button
                size="sm"
                color="danger"
                onPress={() => removeChoice(index)}
                startContent={<FaTimes />}
              />
            </div>
          ))}

          <div className="mt-4">
            <Input
              fullWidth
              size="sm"
              label="New Choice"
              placeholder="Enter new choice"
              value={newChoice}
              onChange={(e) => setNewChoice(e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-4">
            <Button onPress={addChoice}>Add Choice</Button>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default MultipleChoiceOptionsEditor;
