import System from '../System';
import { getComponent } from '../Entity';

export default class RenderSystem extends System {
  constructor(props) {
    super(props);
    
    this.render = this.render.bind(this);
    this.subscribe = this.subscribe.bind(this);

    this.store.subscribe(["CHANGE_LOCATION"], this.subscribe);
  }

  subscribe(type, entity) {
    console.log(entity);
  }
  
  render(entity) {
    const position_comp = getComponent(entity, "Position");
    const render_comp = getComponent(entity, "Render");
    const clickable_comp = getComponent(entity, "Click");

    const location = position_comp.getIn(['data', 'location'], '');
    const el = document.getElementsByClassName(location).item(0);
    if (!el) {
      log({error: ["Position component points to a location that doesn't exist", entity.id, position_comp]});
      return;
    }

    const model = render_comp.getIn(['data', 'model'], '');
    let className = clickable_comp.data ? ' clickable ' : '';

    if (model) el.innerHTML = `<span class='${className}'>${ model }</span>`;
    const action = { type: "ON_CLICK", entity };
    el.onclick = () => { this.store.dispatch(action); };
  }
  
  execute() {
    this.getEntities().map(this.render);
  }
}
