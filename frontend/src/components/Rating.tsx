import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
export default function Rating({initialValue, setValue, maxValue}: {initialValue: number, setValue: (value: number) => void; maxValue: number}) {    
    return (
        <div className="flex flex-row">
            {[...Array(maxValue)].map((_, i) => {
                const filled = i < initialValue;
                const half = i === Math.ceil(initialValue-1);
                console.log(i, initialValue, half, filled, initialValue-1);
                return <Star filled={filled} half={half} key={i} />
             })
            }
        </div>
    )
}

function Star({filled, half}: {filled?: boolean, half?: boolean}) {
    return (
        <>
        {filled ? <BsStarFill className="text-yellow-500" /> : half ? <BsStarHalf className="text-yellow-500" /> : <BsStar className="text-yellow-500" />}
        </>
    )
}