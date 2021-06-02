// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require('./generated/generated');

export function parse(widl: string): any {
  try {
    return parser.parse(widl, { grammarSource: 'widl.pegjs' });
  } catch (e) {
    if (typeof e.format === 'function') {
      console.error(e.format([{ text: widl, source: 'widl.pegjs' }]));
    } else if (e.location) {
      e.message += ` (Error at ${e.location.start.line}:${e.location.start.column} to ${e.location.end.line}:${e.location.end.column})`;
    }
    throw e;
  }
}
