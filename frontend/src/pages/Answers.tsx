import { useState } from "react";
import { AnswerType } from "../@types/Answer";
import Spinner from "../components/Spinner";
import { api } from "../lib/api";
import useFetch from "../lib/useFetch";
import cn from "../utils/cn";

export default function Answers({userId}: {userId?: string | null}) {
    const [openAnswerId, setOpenAnswerId] = useState<string>()
    const {data, loading: isLoading, error} = useFetch<{success: boolean; answers: AnswerType[]}>(`${api}/answers/${userId}`, {enabled: !!userId});
    return (
        <div className={isLoading ? "flex flex-1 items-center justify-center" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
            {isLoading && <Spinner color="normal" size="normal" />}
            {error && <p className="text-red-500">{error.message}</p>}
            {data && data.success && data.answers.map((answer) => <Answer key={answer.id} onPress={() => {
                setOpenAnswerId(answer.id === openAnswerId ? "" : answer.id)
            }} showAllChoices={answer.id === openAnswerId} answer={answer} />)}
        </div>
    )
}

function Answer({answer, showAllChoices = false, onPress}: {answer: AnswerType; showAllChoices?: boolean; onPress: () => void}) {
    return (
        <div className="p-4 select-none cursor-pointer bg-white shadow-md rounded-md hover:shadow-xl transition-all  hover:scale-[1.02]" onClick={onPress} onMouseEnter={onPress} onMouseLeave={onPress}>
            <h1 className="font-bold text-lg text-black">{answer.question.question}. {answer.question.title}</h1>
            {<p className={cn("italic font-semibold text-gray-600", showAllChoices ? "hidden" : "visible")}>{answer.choice.choice} - {answer.choice.label}</p>}
            {
                <ul className={showAllChoices ? "opacity-100" : "opacity-0"}>
                    {answer.question.choices.map((choice) => (
                        <li key={choice.id} className="flex items-center gap-2">
                            <span className={cn("font-semibold text-sm text-gray-600", choice.id === answer.choice.id ? "italic font-bold text-green-800 text-base" : "")}>{choice.choice} - {choice.label}</span>
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}