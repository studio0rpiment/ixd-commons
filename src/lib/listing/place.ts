/** US states (and DC) by name → two-letter code. */
const STATES: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO",
  Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY",
  Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
  Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH",
  "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
  Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI",
  "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
};
const CODES = new Set(Object.values(STATES));
const CITY_STATES = new Set(["Washington", "New York"]);

// Longest names first, so "West Virginia" wins over "Virginia".
const NAMES = Object.keys(STATES).sort((a, b) => b.length - a.length);
const STATE = `(${NAMES.join("|")}|D\\.C\\.|[A-Z]{2})`;
const CITY_STATE = new RegExp(`([A-Z][A-Za-z.' -]*?),\\s*${STATE}(?![A-Za-z])`, "g");
const STATE_ONLY = new RegExp(`\\b(${NAMES.join("|")})\\b`, "g");

const code = (s: string): string | null => (s === "D.C." ? "DC" : STATES[s] ?? (CODES.has(s) ? s : null));

/**
 * The Location field as a short tag: "City, ST" for each city found, else the
 * states it names as codes ("NC, NJ"), else the text as written. Pattern-based,
 * so odd phrasings fall through to the original rather than a guess.
 */
export function formatPlace(location: string | null): string | null {
  const text = location?.trim();
  if (!text) return null;

  const cities: string[] = [];
  for (const [, city, state] of text.matchAll(CITY_STATE)) {
    const st = code(state);
    const name = city.trim();
    // "State of North Carolina, State of New Jersey" or "North Carolina, New Jersey" is
    // two states, not a city. Washington and New York are cities as well as states.
    const stateNotCity = STATES[name] && !CITY_STATES.has(name);
    if (st && !stateNotCity && !/^(state of|remote|or|and)\b/i.test(name)) cities.push(`${name}, ${st}`);
  }
  if (cities.length) return [...new Set(cities)].join(" · ");

  const states = [...new Set([...text.matchAll(STATE_ONLY)].map((m) => STATES[m[1]]))];
  if (states.length) return states.join(", ");

  return text;
}
