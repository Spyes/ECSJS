/* UTIL */
function uniqueId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();  
}

function log() {
  Array.from(arguments)
       .map(argument => console.log(argument));
}

const times = (n, fun) => (
  Array.apply(0, Array(n))
       .map((k, v) => fun(k, v))
);

const result = (obj = {}, path = [], defaultValue) => {
  if (!Array.isArray(path)) return result(obj, [path]);
  return path.reduce((curr, prev) => curr[prev], obj) || defaultValue;
};

/* STORE */
function Store() {
  this.data = {};
  this.subscribers = {};
  this.getStore = () => this.data;
  this.get = (reducer, defaultValue) => result(this.data, reducer, defaultValue);
  this.dispatch = function (action) {
    const { type, component, entity } = action;
    switch (type) {
      case "ENTITY_CREATED":
        if (!this.data.entities) this.data.entities = [];
        this.data.entities.push(entity);
        break;

      case "ADD_COMPONENT":
        const { id } = entity;
        const found_entity =
          this.data
              .entities
              .find(entity => entity.id === id);
        if (!found_entity) break;
        found_entity.components.push(component);
        break;
      case "CHANGE_LOCATION":
        const ent = this.data
			.entities
			.find(e => e.id === entity);
	const pos_comp = getComponent(ent, "Position");
	pos_comp.data.location = action.location;
      default:
        break;
    }
    if (type) {
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

/* ENTITY */
const Entity = () => (
  {
    id: uniqueId(),
    components: []
  }
);

/*** SIDE EFFECTS ***/
/* ENTITY MANAGER */
const createEntity = (store) => {
  const entity = Entity();
  const action = { type: "ENTITY_CREATED", entity };
  store.dispatch(action);
  return entity;
};

const getComponent = (entity, component_name) => (
  entity.components
	.find(component => component.name === component_name)
);

const hasComponents = (entity, component_names) => (
  component_names.reduce((prev, curr) => (
    prev && getComponent(entity, curr) !== undefined
  ), true)
);

/* COMPONENT */
const PositionComponent = ({location: location} = {location: ''}) => ({
  name: "Position",
  data: { location }
});

const RenderComponent = ({model: model} = {model: ''}) => ({
  name: "Render",
  data: { model }
});

const ClickComponent = ({onClick: onClick} = {onClick: () => {}}) => ({
  name: "Click",
  data: { onClick }
});

/*** SIDE EFFECTS ***/
const addComponent = (entity, component, store) => {
  const action = { type: "ADD_COMPONENT", entity, component };
  store.dispatch(action);
};


/* SYSTEM */
class System {
  constructor({store, componentDeps}) {
    this.store = store;
    this.componentDeps = componentDeps;
  }

  getEntities() {
    return this.store
               .get('entities', [])
               .filter(entity => hasComponents(entity, this.componentDeps))
  }

  execute() {    
  }
}

class ClickSystem extends System {
  constructor(props) {
    super(props);

    this.store.subscribe(["ON_CLICK"], this.subscribe);
  }

  subscribe(action, entity) {
    switch (action) {
      case "ON_CLICK":
	const click_comp = getComponent(entity, "Click");
	if (click_comp.data.onClick) click_comp.data.onClick(entity);	
	break;
      default: break;
    }
  }
}

class RenderSystem extends System {
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
    const { location } = position_comp.data;
    const el = document.getElementsByClassName(location).item(0);
    if (!el) {
      log("Position component points to a location that doesn't exist", entity.id, position_comp);
      return;
    }
    const model = result(render_comp, ['data', 'model']);
    const className = clickable_comp.data ? 'clickable' : '';
    if (model) el.innerHTML = `<span class='${className}'>${ model }</span>`;
    const action = { type: "ON_CLICK", entity };
    el.onclick = () => { this.store.dispatch(action); };
  }
  
  execute() {
    this.getEntities().map(this.render);
  }
}

/** MAIN **/
const store = new Store();

const render_system_params = {
  store,
  componentDeps: ["Render", "Position"]
};
const click_system_params = {
  store,
  componentDeps: ["Click"]
};
const systems = [
  new ClickSystem(click_system_params),  
  new RenderSystem(render_system_params)
];

const getPositionByIndex = (idx) => {
  switch (idx) {
    case 0: return "NW";
    case 1: return "N";
    case 2: return "NE";
    case 3: return "W";
    case 4: return "C";
    case 5: return "E";
    case 6: return "SW";
    case 7: return "S";
    case 8: return "SE";
    default:
      log("Idx doesn't map to any position");
      return false;
  }
}

const onClick = (entity) => {
  // do something
}
const createCell = (idx) => {
  const entity = createEntity(store);
  addComponent(entity,
	       PositionComponent({ location: getPositionByIndex(idx) }),
	       store);
  addComponent(entity,
	       ClickComponent({onClick}),
	       store);
  addComponent(entity,
	       RenderComponent({model: "xxx"}),
	       store);
  return entity;
};
const cells = times(9, (_, i) => createCell(i));
const [head, ...rest] = cells;
store.dispatch({ type: "CHANGE_LOCATION", entity: head.id, location: "N" });

systems.map(system => system.execute());
