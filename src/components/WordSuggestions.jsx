import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

export function WordSuggestions({ pattern, dispatch }) {
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

  return (
    <div>
      <h1>Word Suggestions</h1>
      <ul className="w-full min-w-[20rem] border border-gray-300 rounded-md overflow-y-auto max-h-[20rem]">
        {suggestions.length == 0
          ? Array.from({ length: 10 }).map((_, i) => (
              <li key={i} className="px-4 py-2 border-b border-gray-200">
                &nbsp;
              </li>
            ))
          : suggestions
              .filter((s) => toAlphanumeric(s.word).length === pattern.length)
              .map((s) => (
                <li
                  key={s.word}
                  className="px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
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
    </div>
  );
}
