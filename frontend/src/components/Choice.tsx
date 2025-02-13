import cn from "../utils/cn";

export function Choice({ value, groupName, onPress, checked, index, }: { value: string, groupName: string, checked: boolean; onPress: () => void; index: number }) {
    return <>
    <button onClick={onPress} style={{
        animationDelay: `${index * 0.15}s`,
        animationFillMode: "backwards",
    }} className={cn("p-4 h-fit text-white w-full flex bg-dark rounded-md flex-row items-center animate-pop-in transition-all cursor-pointer hover:scale-[1.02] hover:bg-light-dark")}>
        <input type="radio" name={groupName} onChange={onPress} checked={checked} value={value} className="hidden peer/radio-btn" id={value}></input>
        <div onClick={onPress} className="h-2 w-2 rounded-full bg-white peer-checked/radio-btn:bg-extra-dark outline outline-white"></div>
        <label htmlFor={value} className="h-full w-full flex text-left text-md px-4 cursor-pointer">{value}</label>
    </button>
    </>
}