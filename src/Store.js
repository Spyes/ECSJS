import { Map, List, fromJS } from 'immutable';
import { result } from './Utils';

export default function Store() {
  this.data = Map({
    entities: List()
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
  this.dispatch = function (action) {
    const { type, component, entity } = action;
    switch (type) {
      case "ENTITY_CREATED":
        this.data =
	  this.data.update('entities', ents => ents.push(fromJS(entity)));
        break;

      case "ADD_COMPONENT":
	const found_entity = this.data
				 .get('entities', List())
				 .findIndex(e => e.get('id') === entity.id);
	this.data =
	  this.data.updateIn(['entities', found_entity, 'components'], [],
			     comps => comps.push(fromJS(component)))
        break;

      case "UPDATE_COMPONENT":
	var entidx =
	  this.data
	      .get('entities', List())
	      .findIndex(e => e.get('id') === entity.id);
	if (entidx < 0) {
	  log({error: ["No such entity", entity]});
	  break;
	}
	const compidx =
	  this.data
	      .getIn(['entities', entidx, 'components'])
	      .findIndex(comp => comp.get('name') === component);
	this.data =
	  this.data.updateIn(['entities', entidx, 'components', compidx], Map({data: Map()}),
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
