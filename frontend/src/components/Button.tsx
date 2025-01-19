import cn from "../utils/cn";
import Spinner from "./Spinner";
import React from "react";

export default function Button({
  className,
  onClick,
  children,
  isLoading,
  text,
  disabled = false,
  icon
}: {
  className?: string;
  onClick: () => void;
  children?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  text: string;
  icon?: React.ReactNode;
}) {
    const defaultClassName = "flex items-center gap-4 justify-center bg-dark flex-row text-white p-2 rounded-lg mt-4 transition-all min-w-fit w-full md:w-2/4 lg:w-2/5 xl:w-1/6 hover:md:w-3/4 hover:lg:w-3/5 hover:xl:w-1/4 hover:bg-light-dark";
  return (
    <button
      onClick={onClick}
      className={cn(defaultClassName, className, disabled && "cursor-not-allowed opacity-50")}
    >
      {children ? children : <>{isLoading && <Spinner size="small" color="black" />}{icon}{text}</>}
    </button>
  );
}
