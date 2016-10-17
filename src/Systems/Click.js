import System from '../System';
import { getComponent } from '../Entity';

export default class ClickSystem extends System {
  constructor(props) {
    super(props);
    this.subscribe = this.subscribe.bind(this);
    this.store.subscribe(["ON_CLICK"], this.subscribe);
  }

  subscribe(action, entity) {
    switch (action) {
      case "ON_CLICK":
	const globals = this.getEntities()
			    .filter(ent => {
			      let click_comp = getComponent(ent, 'Click');
			      return (
				ent.get('id') !== entity.get('id') &&
				click_comp.getIn(['data','global'], false)
			      )});

	globals.map(glob => {
	  let click_comp = getComponent(glob, "Click");
	  click_comp.getIn(['data', 'onClick'])(entity.toJS())
	});

	let click_comp = getComponent(entity, "Click");
	click_comp.getIn(['data', 'onClick'], () => {}).call(this, entity.toJS());
	break;
      default: break;
    }
  }
}
