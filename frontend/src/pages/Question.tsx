import { useEffect, useState } from "react";
import { Choice } from "../components/Choice";
import Progress from "../components/Progress";

import { QuestionType as QuestionType } from "../@types/Question";
import Button from "../components/Button";

export default function Question({
  question,
  onAnswer,
  onPrev,
  disablePrev,
  disableNext,
  disableSubmit,
  maxQuestions,
  isLoading,
  selectedAnswer,
  note,
}: {
  question: QuestionType;
  onAnswer: (answer: number) => void;
  onPrev?: () => void;
  disablePrev: boolean;
  disableNext: boolean;
  disableSubmit: boolean;
  maxQuestions: number;
  isLoading: boolean;
  selectedAnswer?: number;
  note?: string;
}) {
  const [answer, setAnswer] = useState<number>(selectedAnswer ?? -1);

  useEffect(() => {
    setAnswer(selectedAnswer ?? -1);
  }, [question, selectedAnswer]);  

  return (
    <main className="p-4 h-screen bg-gradient-to-br from-30% from-extra-light/25 via-extra-light to-light">
      <section className={`flex justify-center h-full flex-col ${isLoading && "animate-pulse"} items-center gap-2`}>
        <h1 className="flex min-w-full md:min-w-fit max-h-fit text-left justify-items-stretch md:text-center font-bold text-6xl">
          Question {question.question}
        </h1>
        <p className="flex text-left md:text-center min-w-full md:min-w-fit max-h-fit font-semibold text-lg">{question.title}</p>
        <Progress value={question.question} maxValue={maxQuestions} key="question-progress" className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 transition-all"></Progress>
        <div className="flex flex-col items-center justify-center transition-all w-full md:w-3/4 lg:w-2/3 xl:w-1/2 min-w-fit h-fit mt-4 gap-2">
          {question.choices.map((choice, index) => (
            <Choice
              onPress={() => {
                setAnswer(choice.choice);
              }}
              key={index}
              value={choice.label}
              checked={answer === choice.choice}
              groupName={`question${question.question}`}
            ></Choice>
          ))}
        </div>
        <div className="w-full flex justify-center gap-4">
          {!disablePrev && (
            <Button
            onClick={() => onPrev?.()}
            text="Previous"
             />
          )}
          {!disableNext && (
            <Button
            onClick={() => {onAnswer(answer)}}
            text="Next"
            isLoading={isLoading}
            disabled={answer === -1}
             />
          )}
          {!disableSubmit && (
            <Button
            onClick={() => {onAnswer(answer)}}
            text="Submit"
            isLoading={isLoading}
            disabled={answer === -1}
             />
          )}
        </div>
        <p className="text-center mt-3 text-extra-dark text-sm">{note}</p>
      </section>
    </main>
  );
}
