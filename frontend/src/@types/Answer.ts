import { ChoiceType } from "./Choice";
import { QuestionType } from "./Question";

export type AnswerType = {
    id: string;
    question: QuestionType;
    choice: ChoiceType;
}