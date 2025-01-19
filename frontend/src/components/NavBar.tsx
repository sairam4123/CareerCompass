export function NavBar() {
  return <nav className="flex flex-row h-10 text-white items-center bg-extra-dark  ">
    <h1 className="font-bold p-2">
      <a href="/">CareerCompass</a>
    </h1>
    <ul className="flex flex-row p-2 w-full">
      <li className="p-2">
        <a href="/about">About</a>
      </li>
    </ul>
  </nav>;
}
