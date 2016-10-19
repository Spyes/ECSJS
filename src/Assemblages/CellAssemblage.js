import { createEntity,
	 addComponents,
	 getComponentData } from '../Entity';
import { Position, Click, Render } from '../Components';

function clickCell(entity) {
  let action = {
    type: "CHECK_CELL",
    entity
  };
  this.store.dispatch(action);
}

export default function CellAssemblage(store) {
  const entity = createEntity(store, {type: "Cell"});
  addComponents(entity,
	       [
		 Position(),
		 Click({onClick: clickCell}),
		 Render()
	       ],
	       store);
  return store.get(['entities', entity.id]).toJS();
}
