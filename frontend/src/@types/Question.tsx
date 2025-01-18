import { ChoiceType } from "./Choice";

export type QuestionType = {
    id: string;
    question: number;
    title: string;
    choices: ChoiceType[];
};

export type BasicAnswersType = {
    age_group: string;
    gender: string;
    education: string;
}