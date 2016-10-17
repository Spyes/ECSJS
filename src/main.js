/* UTIL */
import { log, times, result } from './Utils';

/* STORE */
import Store from './Store';

/* ENTITY */
import Entity, { createEntity, getComponent, hasComponents } from './Entity';

/* COMPONENTS */
import * as Component from './Components';

/* SYSTEMS */
import * as System from './Systems';

/*** SIDE EFFECTS ***/
const addComponent = (entity, component, store) => {
  const action = { type: "ADD_COMPONENT", entity, component };
  store.dispatch(action);
};


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
  new System.Click(click_system_params),  
  new System.Render(render_system_params)
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
      log({error: "Idx doesn't map to any position"});
      return false;
  }
}

const globalClick = () => {};
const clickCell = (entity) => {
  console.error( entity.components.find(comp => comp.name === "Render"));
  entity.components.find(comp => comp.name === "Render").data.model = "X";
};
const createCell = (idx) => {
  const entity = createEntity(store);
  addComponent(entity,
	       Component.Position({ location: getPositionByIndex(idx) }),
	       store);
  addComponent(entity,
	       Component.Click({onClick: clickCell}),
	       store);
  addComponent(entity,
	       Component.Render(),
	       store);
  return entity;
};
const cells = times(9, (_, i) => createCell(i));

const turn = createEntity(store);
addComponent(turn, Component.Count(), store);
addComponent(turn, Component.Click({onClick: globalClick, global: true}), store);

systems.map(system => system.execute());
