import { Bounce, toast } from "react-toastify";
import Button from "../components/Button";
import Ratings from "../components/Rating";
import { api } from "../lib/api";
import useMutation from "../lib/useMutation";
import cn from "../utils/cn";
import { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";

export default function FeedbackForm({ isVisible, setIsVisible, userId }: { isVisible: boolean, setIsVisible: (value: boolean) => void; userId: string }) {

    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {

        if (isVisible) {
            if (typeof window !== "undefined" && window.document) {
                window.document.body.style.overflow = "hidden";
                window.scrollTo({top: 0, behavior: "instant"});
            }
        } else {
            if (typeof window !== "undefined" && window.document) {
                window.document.body.style.overflow = "auto";
            }
        }
    }, [isVisible]);

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
        <div className={cn("transition-all absolute flex top-0 left-0 h-screen w-screen flex-col items-center justify-center gap-4 bg-white/40 backdrop-blur-md", isVisible ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <div className={cn("transition-all flex outline outline-2 outline-gray-200 flex-col w-0 h-0 justify-center items-center gap-4 p-4 bg-white rounded-lg", isVisible ? "h-fit w-5/6 md:w-4/5 lg:w-2/3 xl:w-1/2 2xl:w-2/7 animate-pop-in": "h-0 w-0 animate-pop-out")}>
                <div className="flex w-full justify-between items-center">
                <h2 className="text-xl w-full text-center">Feedback Form</h2>
                <button onClick={() => {setIsVisible(false)}} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-all"><BsX size={20} /></button>
                </div>
                <p className="text-sm text-gray-700">How well did the results match your expectations?</p>
                <div className="flex flex-col flex-1 w-full items-center gap-4">
                    <Ratings value={rating} maxValue={5} onChange={(v) => {setRating(v)}} />
                    <div className="flex flex-col w-full gap-2">
                        <p className="text-sm text-gray-700">Feedback</p>
                        <textarea value={feedback} onChange={(e) => {
                            setFeedback(e.target.value);
                        }} className="w-full h-32 p-2 border border-gray-200 rounded-md" />
                    </div>
                    <Button text="Submit" isLoading={mutation.isLoading} onClick={() => {
                        mutation.mutate({ feedback: feedback, rating: rating });
                    }} />
                </div>
            </div>
        </div>
        </>
    );
}