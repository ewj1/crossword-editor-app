import { clsx } from "clsx";

export function Cell({
  value,
  cellSizeRem,
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
            "border-r-[0.5px]": isRightEdge,
            "border-b-[0.5px]": isBottomEdge,
          }
        )}
        style={{
          width: `${cellSizeRem}rem`,
          height: `${cellSizeRem}rem`,
          backgroundColor: [
            // base
            isBlack
              ? "#000"
              : isSelected
              ? "var(--color-orange-400)"
              : isHighlighted
              ? "var(--color-orange-100)"
              : "#fff",
          ],
          backgroundImage: [
            isBlack && isSelected
              ? `repeating-linear-gradient(135deg,#000,#000 ${
                  cellSizeRem / 4
                }rem,var(--color-orange-400) ${
                  cellSizeRem / 4
                }rem,var(--color-orange-400) ${cellSizeRem / 2}rem)`
              : isReciprocal
              ? `linear-gradient(45deg,transparent 80%,var(--color-orange-400) 20%)`
              : "none",
          ],
        }}
        onClick={handleClick}
      >
        {!isBlack && value}
      </div>
    </>
  );
}
