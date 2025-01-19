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
            <p className="text-left font-semibold text-lg w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
                CareerCompass is a career path recommendation system that helps you find the best career path for you.
                We use a combination of machine learning algorithms and user input to provide you with the best career path for you.
                We take into account your skills, interests, and personality to provide you with the best career path for you.
                We are constantly updating our algorithms to provide you with the best career path for you.
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