export function NavBar() {
  return <nav className="flex flex-row h-10 text-white items-center bg-extra-dark  ">
    <h1 className="font-bold p-2">
      <a href="/">CareerCompass</a>
    </h1>
    <ul className="flex flex-row p-2 w-full">
      <li className="p-2">
        <a href="/about">About</a>
      </li>
      <li className="p-2">
        <a href="/contact">Contact</a>
      </li>
      <li className="ml-auto p-2 rounded-lg hover:bg-light hover:text-white cursor-pointer">
        <a className="px-4" href="/login">Login</a>
      </li>
    </ul>
  </nav>;
}
