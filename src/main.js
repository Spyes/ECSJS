import { log, times } from './Utils';
import Store from './Store';
import Entity, { createEntity,
		 addComponent,
		 getComponent,
		 hasComponents } from './Entity';
import * as Component from './Components';
import * as Assemblage from './Assemblages';
import * as System from './Systems';

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

const createCell = (idx) => {
  const cell = Assemblage.Cell(store);
  const comp = getComponent(cell, "Position");
  comp.data.location = getPositionByIndex(idx);
  let action = {
    type: 'UPDATE_COMPONENT',
    entity: cell,
    component: 'Position',
    data: comp.data
  };
  store.dispatch(action);
};
const cells = times(9, (_, i) => createCell(i));

const turn = createEntity(store);
addComponent(turn, Component.Count(), store);
addComponent(turn,
	     Component.Click({
	       onClick: globalClick,
	       global: true
	     }),
	     store);

let _running = true;
function GameLoop() {
  systems.map(system => system.execute());
  if (_running !== false) {
    requestAnimationFrame(GameLoop);
  }
}
requestAnimationFrame(GameLoop);

