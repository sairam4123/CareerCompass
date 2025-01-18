import cn from "../utils/cn";
export default function Progress({
  className,
  value,
  maxValue,
}: {
  className: string;
  value: number;
  maxValue: number;
}) {
  return (
    <div
      className={cn(
        "flex-start flex h-2.5 transition-all w-full overflow-hidden rounded-full bg-extra-light font-sans text-xs font-medium",
        className
      )}
    >
      <div
        className="flex items-center transition-all justify-center h-full overflow-hidden text-white rounded-full bg-gradient-to-tr from-light to-dark"
        style={{ width: `${(value / maxValue) * 100}%` }}
      ></div>
    </div>
  );
}
