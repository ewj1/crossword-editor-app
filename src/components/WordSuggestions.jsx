import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

export function WordSuggestions({ ref, pattern, dispatch }) {
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
          debouncedPattern,
        )}&max=30`;
        const res = await fetch(url);
        const data = await res.json();

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

  const filteredSuggestions = suggestions.filter(
    (s) => toAlphanumeric(s.word).length === pattern?.length,
  );
  return (
    <>
      <ul
        ref={ref}
        className="max-h-[21rem] w-full min-w-[20rem] overflow-y-auto"
      >
        {pattern == "" || filteredSuggestions.length == 0
          ? Array.from({ length: 10 }).map((_, i) => (
              <li key={i} className="px-4 py-2">
                &nbsp;
              </li>
            ))
          : filteredSuggestions.map((s) => (
              <li
                key={s.word}
                className="cursor-pointer text-gray-400 transition-colors hover:text-black"
                onClick={() => {
                  dispatch({
                    type: "selectedSuggestion",
                    value: toAlphanumeric(s.word).toUpperCase(),
                  });
                }}
              >
                {s.word}
              </li>
            ))}
      </ul>
    </>
  );
}
