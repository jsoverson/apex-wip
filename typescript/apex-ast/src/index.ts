import * as ast from './generated';

export * as ast from './generated';

export function name(name: string): ast.Name {
  return new ast.Name(name);
}

export function str(value: string): ast.StringValue {
  return new ast.StringValue(value);
}
export function int(value: number): ast.IntValue {
  return new ast.IntValue(value);
}
export function float(value: number): ast.FloatValue {
  return new ast.FloatValue(value);
}
export function bool(value: boolean): ast.BooleanValue {
  return new ast.BooleanValue(value);
}
