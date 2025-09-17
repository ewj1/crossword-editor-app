import { clsx } from "clsx";

export function Cell({
  value,
  size,
  isBlack,
  isHighlighted,
  isSelected,
  isRightEdge,
  isBottomEdge,
  handleClick,
}) {
  return (
    <>
      <div
        className={clsx(
          "flex justify-center items-center border-l-[0.5px] border-t-[0.5px] border-black",
          {
            "bg-orange-400": isSelected, // selected always wins
            "bg-yellow-100": isHighlighted && !isSelected,
            "bg-black": isBlack && !isSelected,
            "border-r-[0.5px]": isRightEdge,
            "border-b-[0.5px]": isBottomEdge,
          }
        )}
        style={{ width: `${size}rem`, height: `${size}rem` }}
        onClick={handleClick}
      >
        {value}
      </div>
    </>
  );
}
