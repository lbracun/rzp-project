const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTES = [
  ...notes,
  ...notes,
  ...notes,
  ...notes,
  ...notes,
  ...notes,
  ...notes,
  ...notes,
  ...notes,
  ...notes,
  ...notes,
]
  .filter((_, i) => i < 128)
  .map((note, number) => ({ note, number, octave: Math.floor(number / 12) }));

export interface Note {
  note: string;
  number: number;
  octave: number;
}
