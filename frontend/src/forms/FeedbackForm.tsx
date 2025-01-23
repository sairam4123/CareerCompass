import Rating from "../components/Rating";
import cn from "../utils/cn";

export default function FeedbackForm({ isVisible, setIsVisible }: { isVisible: boolean, setIsVisible: (value: boolean) => void }) {

    return (
        <>
        <div className={cn("absolute h-full w-full flex-col items-center gap-4 bg-white/40 backdrop-blur-md", isVisible ? "" : "hidden")}>
            <div className="flex flex-col h-fit w-fit justify-center items-center gap-4 p-4 bg-white rounded-lg">
                <h2>Feedback Form</h2>
                <form>
                    <Rating initialValue={0.4} maxValue={5} setValue={(v) => {}} />
                    <label>
                        Feedback:
                        <input type="text" name="feedback" />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
        </>
    );
}