import { List } from 'immutable';
import { hasComponents } from './Entity';

export default class System {
  constructor({store, componentDeps}) {
    this.store = store;
    this.componentDeps = componentDeps || [];
  }

  getEntities(additionalDeps = []) {
    const deps = this.componentDeps.concat(additionalDeps);
    return this.store.getEntities(deps);
  }

  mapEntities(fun, additionalDeps = []) {
    return this.getEntities(additionalDeps)
	       .map(fun);
  }
  
  execute() {    
  }
}
