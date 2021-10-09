import { Idl } from '../consumer';
export declare function sanitizeIdentifier(name: string): string;
export declare function codegen(idl: Idl, attributeOrder: Record<string, string[]>): string;
