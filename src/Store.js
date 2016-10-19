import { Map, List, fromJS } from 'immutable';
import { result } from './Utils';
import { hasComponents } from './Entity';

export default function Store() {
  this.data = Map({
    entities: Map()
  });
  this.subscribers = {};
  this.getStore = () => this.data.toJS();
  this.get = (reducer, defaultValue) => {
    if (Array.isArray(reducer)) {
      return this.data
		 .getIn(reducer, defaultValue);
    }
    return this.data
	       .get(reducer, defaultValue);
  };
  this.getEntities = (components) => (
    this.data.get('entities', Map())
	.filter(entity => (
	  hasComponents(entity, components)
	)).toList().toJS()
  );
  this.dispatch = function (action) {
    const { type, component, entity } = action;
    switch (type) {
      case "ENTITY_CREATED":
        this.data =
	  this.data.setIn(['entities', entity.id], fromJS(entity));
        break;

      case "ADD_COMPONENT":
	this.data =
	  this.data.updateIn(['entities', entity.id, 'components'], [],
			     comps => comps.push(fromJS(component)))
        break;

      case "UPDATE_COMPONENT":
	const compidx =
	  this.data
	      .getIn(['entities', entity.id, 'components'])
	      .findIndex(comp => comp.get('name') === component);
	this.data =
	  this.data.updateIn(['entities', entity.id, 'components', compidx],
			     Map({data: Map()}),
			     comp => comp.set('data', fromJS(action.data)));
	break;

      default:
        break;
    }
    if (type) {  // broadcast to subscribers
      result(this.subscribers, [type], []).map(fun => { fun(type, entity) });
    }
  };
  this.subscribe = function (actions, fun) {
    actions.map(action => {
      if (!Array.isArray(this.subscribers[action])) {
	this.subscribers[action] = [];
      }
      this.subscribers[action].push(fun);
    });
  };
}
