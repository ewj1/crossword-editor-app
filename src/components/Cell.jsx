import { clsx } from "clsx";

export function Cell({
  value,
  number,
  cellSizeRem,
  isHighlighted,
  isReciprocal,
  isSelected,
  gridActive,
  isRightEdge,
  isBottomEdge,
  handleClick,
}) {
  console.log(isHighlighted);
  const isBlack = value === ".";
  const colorMap = {
    orange: {
      100: "oklch(95.4% 0.038 75.164)",
      400: "oklch(75% 0.183 55.934)",
    },
    gray: {
      100: "oklch(96.7% 0.003 264.542)",
      400: "oklch(70.7% 0.022 261.325)",
    },
  };
  const themeColor = gridActive ? colorMap["orange"] : colorMap["gray"];
  return (
    <>
      <div
        className={clsx(
          "relative flex items-end justify-center border-t-[0.5px] border-l-[0.5px] border-black text-3xl",
          {
            "border-r-[0.5px]": isRightEdge,
            "border-b-[0.5px]": isBottomEdge,
          },
        )}
        style={{
          width: `${cellSizeRem}rem`,
          height: `${cellSizeRem}rem`,
          backgroundColor: [
            // base
            isBlack
              ? "#000"
              : isSelected
                ? themeColor[400]
                : isHighlighted
                  ? themeColor[100]
                  : "#fff",
          ],
          backgroundImage: [
            isBlack && isSelected
              ? `repeating-linear-gradient(135deg,#000,#000 ${
                  cellSizeRem / 4
                }rem,${themeColor[400]} ${
                  cellSizeRem / 4
                }rem,${themeColor[400]} ${cellSizeRem / 2}rem)`
              : isReciprocal
                ? `linear-gradient(45deg,transparent 80%,${themeColor[400]} 20%)`
                : "none",
          ],
        }}
        onClick={handleClick}
      >
        <div className="absolute top-0 left-0 m-[0.1rem] text-[0.55rem]">
          {number !== 0 && number}
        </div>
        {!isBlack && value}
      </div>
    </>
  );
}
