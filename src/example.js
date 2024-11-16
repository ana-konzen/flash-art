export function getExample() {
  return {
    mood: ["calm", "sad", "neutral", "bored", "serene"],
    color: ["#967d54", "#bfc8a1", "#6b8b8a", "#a24d42", "#3b5c68"],
    shape: ["organic", "rectangular"],
    style: ["classic", "expressionist"],
    contrast: "low",
    artist: "paul cezanne",
    afinn: {
      sum: 0,
      absSum: 8,
      scores: [
        {
          mood: "calm",
          score: 2,
        },
        {
          mood: "sad",
          score: -2,
        },
        {
          mood: "neutral",
          score: 0,
        },
        {
          mood: "bored",
          score: -2,
        },
        {
          mood: "serene",
          score: 2,
        },
      ],
    },
    timestamp: "2024-11-16T21:12:35.373Z",
  };
}
