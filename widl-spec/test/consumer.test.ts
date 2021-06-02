import { expect } from 'chai';
import { describe } from 'mocha';

import { parse, ConsumerType, SimpleType } from '../src/consumer';
import { IDLInterfaceMemberType, IDLTypeDescription } from 'webidl2';

const widlSrc = `
enum EnumType {
  "One",
  "Two",
  "Three",
};

typedef (PrimitiveType or ComplexType) TypeDefType;

interface Parent {};

interface Child : Parent{
  readonly attribute ByteString  rostring;
  attribute ByteString rwstring;
  attribute ByteString? optstring;
  attribute EnumType? optEnumType;
  attribute TypeDefType? optTypeDefType;
  attribute sequence<boolean>? optBoolList;
  attribute boolean bool;
  attribute EnumType enumType;
  attribute TypeDefType typeDefType;
  attribute sequence<boolean> boolList;
  attribute Child child;
};
`;
const tree = parse(widlSrc);
const child = tree.interfaces.Child;

function getMemberType(m: IDLInterfaceMemberType): IDLTypeDescription | IDLTypeDescription[] {
  if (m.type === 'constructor') throw new Error('unhandled type ' + m.type);
  if (m.idlType === null) throw new Error('null type for ' + JSON.stringify(m));
  return m.idlType;
}

function getType(m: IDLInterfaceMemberType): ConsumerType {
  return tree.idlTypeToType(getMemberType(m));
}

describe('type conversion', function () {
  it('should process webidl-primitive types', () => {
    expect(getType(child.members[0]).type).to.equal('webidl-primitive');
    expect(getType(child.members[1]).type).to.equal('webidl-primitive');
  });
  it('should process nullable types', () => {
    expect(getType(child.members[2]).type).to.equal('nullable');
    expect(getType(child.members[3]).type).to.equal('nullable');
    expect(getType(child.members[4]).type).to.equal('nullable');
    expect(getType(child.members[5]).type).to.equal('nullable');
  });
  it('should process enum types', () => {
    const nullableEnum = getType(child.members[3]) as SimpleType;
    expect(nullableEnum.def.type).to.equal('enum');
    expect(getType(child.members[7]).type).to.equal('enum');
  });
  it('should process sequence types', () => {
    const nullableEnum = getType(child.members[5]) as SimpleType;
    expect(nullableEnum.def.type).to.equal('list');
    expect(getType(child.members[9]).type).to.equal('list');
  });
  it('should process named types', () => {
    const nullableEnum = getType(child.members[5]) as SimpleType;
    expect(nullableEnum.def.type).to.equal('list');
    expect(getType(child.members[9]).type).to.equal('list');
  });
  it('should process interfaces types', () => {
    expect(getType(child.members[10]).type).to.equal('interface');
  });
  it('should process typedef types', () => {
    expect(getType(child.members[8]).type).to.equal('typedef');
  });
});
