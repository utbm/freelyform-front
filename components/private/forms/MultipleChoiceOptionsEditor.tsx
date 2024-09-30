// components/private/forms/MultipleChoiceOptionsEditor.tsx
"use client";

import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { FaTimes } from 'react-icons/fa';

interface MultipleChoiceOptionsEditorProps {
  choices: string[];
  onUpdateChoices: (choices: string[]) => void;
}

const MultipleChoiceOptionsEditor: React.FC<MultipleChoiceOptionsEditorProps> = ({
                                                                                   choices,
                                                                                   onUpdateChoices,
                                                                                 }) => {
  const [newChoice, setNewChoice] = useState('');

  const addChoice = () => {
    if (newChoice.trim() !== '') {
      onUpdateChoices([...choices, newChoice.trim()]);
      setNewChoice('');
    }
  };

  const removeChoice = (index: number) => {
    const updatedChoices = choices.filter((_, i) => i !== index);
    onUpdateChoices(updatedChoices);
  };

  return (
    <div className="mt-4">
      <h6>Choices</h6>
      {choices.map((choice, index) => (
        <div
          key={index}
          className="flex items-center mt-2 border p-2 rounded-lg"
        >
          <span className="flex-grow">{choice}</span>
          <Button
            color="danger"
            size="sm"
            onPress={() => removeChoice(index)}
            startContent={<FaTimes />}
          />
        </div>
      ))}
      <div className="mt-4">
        <Input
          fullWidth
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
  );
};

export default MultipleChoiceOptionsEditor;
