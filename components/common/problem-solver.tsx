"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Problem {
  id: string;
  type: "MULTIPLE_CHOICE" | "INPUT";
  question: string;
  options: Array<{ id: string; text: string }>;
  order: number;
}

interface ProblemSolverProps {
  problem: Problem;
  onAnswer: (problemId: string, answer: string) => void;
  selectedAnswer: string;
}

export const ProblemSolver = ({
  problem,
  onAnswer,
  selectedAnswer,
}: ProblemSolverProps) => {
  const [inputValue, setInputValue] = useState(selectedAnswer || "");

  const handleSelectOption = (option: string) => {
    onAnswer(problem.id, option);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmitInput = () => {
    if (inputValue.trim()) {
      onAnswer(problem.id, inputValue.trim());
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          {problem.order}. {problem.question}
        </h3>

        <div className="space-y-3">
          {problem.type === "MULTIPLE_CHOICE" ? (
            <div className="space-y-2">
              {problem.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.text)}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    selectedAnswer === option.text
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border ${
                        selectedAnswer === option.text
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedAnswer === option.text && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter your answer"
                className="w-full"
              />
              <Button
                onClick={handleSubmitInput}
                disabled={!inputValue.trim()}
                className="w-full"
              >
                Submit Answer
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
