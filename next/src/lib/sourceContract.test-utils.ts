/**
 * Legacy source-contract checks inspect wiring that is also covered by browser
 * tests. Ignore presentation-only differences so formatting does not break them.
 * Do not use this normalization to compare runtime values or program behavior.
 */
function sourceCharacters(source: string) {
  const characters: string[] = [];
  const positions: number[] = [];

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (/[\s(),;]/.test(character)) continue;
    if (character === "0" && source[index + 1] === ".") continue;

    characters.push(character === "'" ? '"' : character);
    positions.push(index);
  }

  return { text: characters.join(""), positions };
}

export function includesSource(source: string, fragment: string) {
  return sourceCharacters(source).text.includes(
    sourceCharacters(fragment).text,
  );
}

export function indexOfSource(source: string, fragment: string, start = 0) {
  const normalized = sourceCharacters(source.slice(start));
  const index = normalized.text.indexOf(sourceCharacters(fragment).text);

  return index < 0 ? -1 : start + normalized.positions[index];
}

export function compactWhitespace(source: string) {
  return source.replace(/\s+/g, "");
}
