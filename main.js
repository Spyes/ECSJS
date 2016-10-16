/* STORE */
function Store() {
  this.data = {};
  this.getStore = () => this.data;
  this.get = (reducer, defaultValue) => this.data[reducer] || defaultValue;
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

      default:
        break;
    }
  };
}
const store = new Store();

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

/* ENTITY */
const Entity = () => (
  {
    id: uniqueId(),
    components: []
  }
);

const createEntity = (store) => {
  const entity = Entity();
  const action = { type: "ENTITY_CREATED", entity };
  store.dispatch(action);
  return entity;
};

const hasComponents = (entity, component_names) => {
  if (component_names.length === 0) return true;  
  const comp = component_names[0];
  const has = entity.components.find(component => component.name === comp) !== undefined;
  return has && hasComponents(entity, component_names.slice(1));
};

/* COMPONENT */
const PositionComponent = () => ({
  name: "Position",
  data: { location: "" }
});

const RenderComponent = () => ({
  name: "Render"
});

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
}

class RenderSystem extends System {
  constructor(props) {
    super(props);
  }

  render(entity) {
    const position_comp = entity.components.find(comp => comp.name === "Position");
    document.getElementById(position_comp.data.location).innerHTML = `<h4>${ entity.id }</h4>`;
  }
  
  execute() {
    this.getEntities().map(this.render)
  }
}

/** MAIN **/
const playerEnt = createEntity(store);
addComponent(playerEnt, RenderComponent(), store);
addComponent(playerEnt, PositionComponent(), store);

const locationEnt = createEntity(store);
addComponent(locationEnt, RenderComponent(), store);
addComponent(locationEnt, PositionComponent(), store);

const render_system_params = {
  store,
  componentDeps: ["Render", "Position"]
};

const systems = [
  new RenderSystem(render_system_params)
];

systems.map(system => system.execute());
