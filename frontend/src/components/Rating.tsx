// import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
// export default function Rating({initialValue, setValue, maxValue}: {initialValue: number, setValue: (value: number) => void; maxValue: number}) {    
//     return (
//         <div className="flex flex-row">
//             {[...Array(maxValue)].map((_, i) => {
//                 const filled = i < initialValue;
//                 const half = i === Math.ceil(initialValue-1);
//                 console.log(i, initialValue, half, filled, initialValue-1);
//                 return <Star filled={filled} half={half} key={i} />
//              })
//             }
//         </div>
//     )
// }

// function Star({filled, half}: {filled?: boolean, half?: boolean}) {
//     return (
//         <>
//         {filled ? <BsStarFill className="text-yellow-500" /> : half ? <BsStarHalf className="text-yellow-500" /> : <BsStar className="text-yellow-500" />}
//         </>
//     )
// }

import { useState, useMemo } from "react";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";

export default function Ratings({ maxValue = 5, value = 0, onChange }: {
    maxValue?: number;
    value?: number;
    onChange?: (value: number) => void;
}) {
  const [rating, setRating] = useState(value);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index: number, event: React.MouseEvent<HTMLOrSVGElement>) => {
    const rect = (event.target as HTMLElement)?.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const isHalf = clickPosition < rect.width / 2;
    const newRating = isHalf ? index + 0.5 : index + 1;
    setRating(newRating);
    if (onChange) onChange(newRating);
  };

  const handleMouseMove = (index: number, event: React.MouseEvent<HTMLOrSVGElement>) => {
    const rect = (event.target as HTMLElement)?.getBoundingClientRect();
    const hoverPosition = event.clientX - rect.left;
    const isHalf = hoverPosition < rect.width / 2;
    setHoverRating(isHalf ? index + 0.5 : index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  console.log(rating, hoverRating);

  const displayedRating = hoverRating || rating;

  const stars = useMemo(() => {
    const fullStars = Math.floor(displayedRating);
    const hasHalfStar = displayedRating % 1 !== 0;
    const emptyStars = maxValue - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
        {[...Array(fullStars)].map((_, i) => (
          <BsStarFill key={i} fill="currentColor" className={`w-6 h-6 cursor-pointer ${(hoverRating > i) ? "text-yellow-200" : "text-yellow-500"}`} onClick={(e) => handleClick(i, e)} onMouseMove={(e) => handleMouseMove(i, e)} />
        ))}
        {hasHalfStar && <BsStarHalf fill="currentColor" className={`w-6 h-6 cursor-pointer ${(hoverRating > fullStars) ? "text-yellow-200" : "text-yellow-500"}`} onClick={(e) => handleClick(fullStars, e)} onMouseMove={(e) => handleMouseMove(fullStars, e)} />}
        {[...Array(emptyStars)].map((_, i) => (
          <BsStar key={i + fullStars + 1} className={`w-6 h-6 cursor-pointer ${(hoverRating > i + fullStars) ? "text-yellow-200" : "text-yellow-500"}`} onClick={(e) => handleClick(i + fullStars, e)} onMouseMove={(e) => handleMouseMove(i + fullStars, e)} />
        ))}
      </div>
    );
  }, [displayedRating, maxValue]);

  return <div>{stars}</div>;
}
