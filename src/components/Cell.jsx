import { clsx } from "clsx";

export function Cell({
  value,
  size,
  isHighlighted,
  isReciprocal,
  isSelected,
  isRightEdge,
  isBottomEdge,
  handleClick,
}) {
  const isBlack = value === ".";
  return (
    <>
      <div
        className={clsx(
          "flex justify-center items-center border-l-[0.5px] border-t-[0.5px] border-black",
          {
            "bg-orange-400": isSelected && !isBlack, // selected always wins
            "bg-orange-100": isHighlighted && !isSelected && !isBlack,
            "bg-black": isBlack && !isSelected,
            "bg-[repeating-linear-gradient(135deg,#000,#000_10px,#FFA500_10px,#FFA500_20px)]":
              isBlack && isSelected,
            "bg-[repeating-linear-gradient(45deg,#fff,#fff_20px,#FFA500_20px,#FFA500_30px)]":
              isReciprocal && !isBlack,
            "bg-[repeating-linear-gradient(45deg,#000,#000_20px,#FFA500_20px,#FFA500_30px)]":
              isReciprocal && isBlack,
            "border-r-[0.5px]": isRightEdge,
            "border-b-[0.5px]": isBottomEdge,
          }
        )}
        style={{ width: `${size}rem`, height: `${size}rem` }}
        onClick={handleClick}
      >
        {!isBlack && value}
      </div>
    </>
  );
}
