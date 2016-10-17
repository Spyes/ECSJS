import { List } from 'immutable';
import { hasComponents } from './Entity';

export default class System {
  constructor({store, componentDeps}) {
    this.store = store;
    this.componentDeps = componentDeps;
  }

  getEntities() {
    return this.store
               .get('entities', List())
               .filter(entity => hasComponents(entity, this.componentDeps))
  }

  execute() {    
  }
}
