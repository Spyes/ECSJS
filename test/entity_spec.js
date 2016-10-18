import { expect } from 'chai';
import { uniqueId } from '../src/Utils';
import * as Entity from '../src/Entity';

describe("Entity", () => {
  it("should return a basic entity object", () => {
    const id = uniqueId();
    const entity = Entity.default({id});
    const expected = {id, components: []};
    expect(entity).to.deep.equal(expected);
  });
});
