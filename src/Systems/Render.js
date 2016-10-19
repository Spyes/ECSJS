import System from '../System';
import { getComponent, getComponentData } from '../Entity';

export default class RenderSystem extends System {
  constructor(props) {
    super(props);
    
    this.render = this.render.bind(this);
    this.subscribe = this.subscribe.bind(this);

    this.store.subscribe(["CHECK_CELL"], this.subscribe);
  }

  subscribe(type, entity) {
    switch (type) {
      case 'CHECK_CELL':
	const turn = this.store.getEntities(["Turn", "Count"])[0];
	const count = getComponentData(turn, "Count").count;
	const data = getComponentData(entity, "Render");
	data.model = (count % 2 === 0) ? "X" : "O";
	let action = {
	  type: 'UPDATE_COMPONENT',
	  entity: entity,
	  component: 'Render',
	  data: data
	};
	this.store.dispatch(action);
	this.store.dispatch({type: "CHECK_COMPLETE"});

	break;
      default: break;
    }
  }
  
  render(entity) {
    const position_comp = getComponentData(entity, "Position");
    const render_comp = getComponentData(entity, "Render");
    const clickable_comp = getComponentData(entity, "Click");

    const { location } = position_comp;
    const el = document.getElementsByClassName(location).item(0);
    if (!el) {
      log({error: ["Position component points to a location that doesn't exist", entity.id, position_comp]});
      return;
    }

    const { model } = render_comp;
    let className = '';
    if (clickable_comp)
      className += ' clickable ';

    if (model) el.innerHTML = `<span class='${className}'>${ model }</span>`;
    const action = { type: "ON_CLICK", entity };
    el.onclick = () => { this.store.dispatch(action); };
  }
  
  execute() {
    this.getEntities().map(this.render);
  }
}
