"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const consumer_1 = require("../src/consumer");
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
const tree = consumer_1.parse(widlSrc);
const child = tree.interfaces.Child;
function getMemberType(m) {
    if (m.type === 'constructor')
        throw new Error('unhandled type ' + m.type);
    if (m.idlType === null)
        throw new Error('null type for ' + JSON.stringify(m));
    return m.idlType;
}
function getType(m) {
    return tree.idlTypeToType(getMemberType(m));
}
mocha_1.describe('type conversion', function () {
    it('should process webidl-primitive types', () => {
        chai_1.expect(getType(child.members[0]).type).to.equal('webidl-primitive');
        chai_1.expect(getType(child.members[1]).type).to.equal('webidl-primitive');
    });
    it('should process nullable types', () => {
        chai_1.expect(getType(child.members[2]).type).to.equal('nullable');
        chai_1.expect(getType(child.members[3]).type).to.equal('nullable');
        chai_1.expect(getType(child.members[4]).type).to.equal('nullable');
        chai_1.expect(getType(child.members[5]).type).to.equal('nullable');
    });
    it('should process enum types', () => {
        const nullableEnum = getType(child.members[3]);
        chai_1.expect(nullableEnum.def.type).to.equal('enum');
        chai_1.expect(getType(child.members[7]).type).to.equal('enum');
    });
    it('should process sequence types', () => {
        const nullableEnum = getType(child.members[5]);
        chai_1.expect(nullableEnum.def.type).to.equal('list');
        chai_1.expect(getType(child.members[9]).type).to.equal('list');
    });
    it('should process named types', () => {
        const nullableEnum = getType(child.members[5]);
        chai_1.expect(nullableEnum.def.type).to.equal('list');
        chai_1.expect(getType(child.members[9]).type).to.equal('list');
    });
    it('should process interfaces types', () => {
        chai_1.expect(getType(child.members[10]).type).to.equal('interface');
    });
    it('should process typedef types', () => {
        chai_1.expect(getType(child.members[8]).type).to.equal('typedef');
    });
});
//# sourceMappingURL=consumer.test.js.map