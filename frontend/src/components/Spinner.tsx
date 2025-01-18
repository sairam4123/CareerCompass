export default function Spinner({color = "normal", size="normal", visible = true}: {color?: "black" | "normal" | "white"; size?: "normal" | "large" | "small"; visible?: boolean}) {
    const sizeClasses = size === "normal" ? "h-10 w-10 border-l-2 border-t-4 border-r-2 border-b-2" : size === "large" ? "h-20 w-20 border-l-4 border-t-8 border-r-4 border-b-4" : "h-5 w-5 border-l border-t-2 border-r border-b-1";
    return (
        <div className={`flex justify-center items-center ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`animate-spin rounded-full ${sizeClasses} ${color==='black' ? "border-black" : color==='normal' ? 'border-light' : 'border-white'}`}></div>
        </div>
    );
}