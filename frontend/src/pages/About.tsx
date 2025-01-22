import { useNavigate } from "react-router";
import Button from "../components/Button";
import { GrGithub } from "react-icons/gr";

export default function AboutPage() {
    const navigate = useNavigate();
    return <div className="p-4 h-screen bg-gradient-to-br from-30% from-extra-light/25 via-extra-light to-light">
        <section className="flex flex-1 h-full gap-3 flex-col justify-center items-center">
            <div className="flex w-full flex-col items-center my-auto justify-center gap-2">
                <h1 className="text-center font-bold text-4xl md:text-6xl">
                    Career Compass
                </h1>
                <p className="text-center text-3xl">
                    Your personalized career path starts here.
                </p>
                <Button
                    onClick={() => navigate("/")}
                    text="Let's Begin!"
                    className="mt-4"
                />
            </div>
            <h1 className="text-center font-bold text-4xl md:text-6xl">
                About CareerCompass
            </h1>
            <p className="text-left font-semibold text-lg w-full md:w-3/4 lg:w-2/3 xl:w-2/3">
            CareerCompass is your ultimate guide to discovering the ideal career path tailored to you.<br/>
            We leverage advanced machine learning algorithms alongside your personal input to recommend career options that align with your unique skills, interests, and personality.<br></br>
<br></br>
            By continually refining our algorithms and incorporating the latest insights, we ensure you receive up-to-date, personalized guidance to navigate your career journey confidently and successfully.<br></br>
            </p>
            <p className="text-center mt-auto text-lg">
                Developed by Sairam Mangeshkar with ❤️<br />
                <a href="https://github.com/sairam4123" className="items-center flex flex-row gap-2 justify-center" target="_blank" rel="noreferrer">
                    <GrGithub size={24} /> sairam4123
                </a>
            </p>
        </section>
    </div>
}