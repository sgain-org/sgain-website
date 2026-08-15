declare module "reading-time/lib/reading-time" {
  export interface Options {
    wordBound?: (char: string) => boolean;
    wordsPerMinute?: number;
  }

  export interface ReadTimeResults {
    text: string;
    time: number;
    words: number;
    minutes: number;
  }

  /** Core word-counting function, imported directly so the Node stream subpath never bundles. */
  export default function readingTime(text: string, options?: Options): ReadTimeResults;
}
