/* eslint-disable @typescript-eslint/no-explicit-any */
const parser = require('./generated/generated'); // eslint-disable-line

export function parse(widl: string, source = 'n/a'): any {
  try {
    return parser.parse(widl, { grammarSource: source });
  } catch (err) {
    if (typeof err === 'object' && err !== null) {
      const e = err as any;
      if (typeof e.format === 'function') {
        console.error(e.format([{ text: widl, source: source }]));
      } else if (e.location) {
        e.message += ` (Error at ${e.location.start.line}:${e.location.start.column} to ${e.location.end.line}:${e.location.end.column})`;
      }
    }
    throw err;
  }
}
