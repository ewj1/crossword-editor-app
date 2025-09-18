import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

export function WordSuggestions({ pattern }) {
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
        )}&max=10`;
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

  return (
    <>
      <ul>
        {suggestions.map((s) => (
          <li key={s.word}>{s.word}</li>
        ))}
      </ul>
    </>
  );
}
