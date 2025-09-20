import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

export function WordSuggestions({ pattern, dispatch }) {
  console.log(pattern, "pattern");
  const debouncedPattern = useDebounce(pattern, 400);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!debouncedPattern) {
      setSuggestions([]);
      return;
    }
    let isCancelled = false;

    async function fetchSuggestions() {
      try {
        const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(
          debouncedPattern
        )}&max=20`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(data, "data");

        if (!isCancelled) setSuggestions(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchSuggestions();

    return () => {
      isCancelled = true;
    };
  }, [debouncedPattern]);

  function toAlphanumeric(word) {
    return word.replace(/[^a-z0-9]/gi, "");
  }

  return (
    <>
      <ul>
        {suggestions
          .filter((s) => toAlphanumeric(s.word).length === pattern.length)
          .map((s) => (
            <li
              key={s.word}
              onClick={() =>
                dispatch({
                  type: "selectedSuggestion",
                  value: toAlphanumeric(s.word).toUpperCase(),
                })
              }
            >
              {s.word}
            </li>
          ))}
      </ul>
    </>
  );
}
