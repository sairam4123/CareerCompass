import Button from "../components/Button";

export function First({onBegin}: {onBegin: () => void}) {
  return (
    <main className="p-4 h-screen flex justify-center items-center  bg-gradient-to-br from-30% from-extra-light/25 via-extra-light to-light">
      <section className="flex flex-1 flex-col justify-center items-center">
        <h1 className="text-center font-bold text-4xl md:text-6xl">
          Welcome to CareerCompass!
        </h1>
        <p className="text-center text-2xl">
          Your personalized carrer path starts here.
        </p>
        <Button
          onClick={onBegin}
          text="Let's Begin!"
          className="mt-4"
        />
      </section>
    </main>
  );
}
