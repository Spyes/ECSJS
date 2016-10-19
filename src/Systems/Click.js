import System from '../System';
import { getComponentData } from '../Entity';

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
			      let click_comp = getComponentData(ent, 'Click');
			      return (
				ent.id !== entity.id &&
				(click_comp.global || false)
			      )});

	globals.map(glob => {
	  let click_comp = getComponentData(glob, "Click");
	  click_comp.onClick(entity)
	});

	let click_comp = getComponentData(entity, "Click");
	const onclickfun = click_comp.onClick || function () {};
	onclickfun.call(this, entity);
	break;
      default: break;
    }
  }
}
