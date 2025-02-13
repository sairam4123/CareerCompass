import { useState } from "react";
import Button from "../components/Button";
import cn from "../utils/cn";
import { BsChevronDown as ChevronDown } from "react-icons/bs";

const Dropdown = <T extends object>({ options, onSelect, label_key, value_key }: {options: T[], onSelect: (option: T) => void; label_key: keyof T; value_key: keyof T}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T | null> (null);

  const handleSelect = (option: T) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative text-left w-full">
      <Button
        // text={selected || "Select an option"}
        onClick={() => setIsOpen(!isOpen)}
        className="flex-1 flex w-full md:w-full lg:w-full xl:w-full hover:md:w-full hover:lg:w-full hover:xl:w-full items-center px-4 justify-start gap-2"
        // icon={<ChevronDown className="h-4 w-4" />}
      >
        {selected ? String(selected[label_key]) : "Select an option"}
        <ChevronDown className="h-4 w-4 ml-auto" />
      </Button>
      {isOpen && (
        <div className="absolute mt-2 w-full md:w-full lg:w-full xl:w-full hover:md:w-full hover:lg:w-full hover:xl:w-full bg-white border rounded-lg shadow-lg">
          {options.map((option, index) => (
            <div
              key={String(selected?.[value_key] ?? index)}
              onClick={() => handleSelect(option)}
              className={cn(
                "px-4 w-full py-2 cursor-pointer hover:bg-gray-100",
                selected === option && "bg-gray-200"
              )}
            >
              {option ? String(option[label_key]) : "Unknown value"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
