import { Bounce, toast } from "react-toastify";
import Button from "../components/Button";
import Ratings from "../components/Rating";
import { api } from "../lib/api";
import useMutation from "../lib/useMutation";
import cn from "../utils/cn";
import { useState } from "react";

export default function FeedbackForm({ isVisible, setIsVisible, userId }: { isVisible: boolean, setIsVisible: (value: boolean) => void; userId: string }) {

    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");

    const mutation = useMutation<null, { feedback: string, rating: number }, {success: false, message: string}>({
        url: `${api}/feedback/${userId}`,
        method: "POST",
        onSuccess: () => {
            setIsVisible(false);
            toast.success("Feedback submitted successfully", {
                transition: Bounce,
                autoClose: 5000,
                position: "top-right"
            });
        },
        onFailure: ({message}) => {
            setIsVisible(false);
            toast.error(`Failed to submit feedback: ${message}`, {
                transition: Bounce,
                autoClose: 5000,
                position: "top-right"
            });
        }
    });

    return (
        <>
        <div className={cn("transition-all absolute flex top-0 left-0 h-screen w-screen flex-col items-center justify-center gap-4 bg-white/40 backdrop-blur-md", isVisible ? "" : "hidden")} onClick={() => setIsVisible(false)}>
            <div className="flex outline outline-2 outline-gray-200 flex-col h-fit w-5/6 md:w-4/5 lg:w-2/3 xl:w-1/2 2xl:w-2/7  justify-center items-center gap-4 p-4 bg-white rounded-lg">
                <h2 className="text-xl">Feedback Form</h2>
                <p className="text-sm text-gray-700">How well did the results match your expectations?</p>
                <div className="flex flex-col flex-1 w-full items-center gap-4">
                    <Ratings value={rating} maxValue={5} onChange={(v) => {setRating(v)}} />
                    <div className="flex flex-col w-full gap-2">
                        <p className="text-sm text-gray-700">Feedback</p>
                        <textarea value={feedback} onChange={(e) => {
                            setFeedback(e.target.value);
                        }} className="w-full h-32 p-2 border border-gray-200 rounded-md" />
                    </div>
                    <Button isLoading={mutation.status === "LOADING"} onClick={() => {
                        mutation.mutate({ feedback: feedback, rating: rating });
                    }}>Submit</Button>
                </div>
            </div>
        </div>
        </>
    );
}