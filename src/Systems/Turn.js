import System from '../System';
import { getComponentData } from '../Entity';

export default class TurnSystem extends System {
  constructor(props) {
    super(props);
    this.subscribe = this.subscribe.bind(this);
    this.store.subscribe(["CHECK_COMPLETE", 'TURN_COMPLETE'], this.subscribe);
  }

  subscribe(type, entity) {
    switch (type) {
      case 'CHECK_COMPLETE':
	this.mapEntities(entity => {
	  let data = getComponentData(entity, "Count");
	  data.count++;
	  let action = {
	    type: 'UPDATE_COMPONENT',
	    entity: entity,
	    component: "Count",
	    data
	  };
	  this.store.dispatch(action);
	});
	this.store.dispatch({type: "TURN_COMPLETE"});
	break;
      case 'TURN_COMPLETE':
	this.mapEntities(entity => {
	  let render_data = getComponentData(entity, "Render");
	  let count_data = getComponentData(entity, "Count");
	  render_data.model = count_data.count.toString();
	  let action = {
	    type: 'UPDATE_COMPONENT',
	    entity: entity,
	    component: "Render",
	    data: render_data
	  };
	  this.store.dispatch(action);
	}, ['Render', 'Count']);
      default: break;
    }
  }
}
