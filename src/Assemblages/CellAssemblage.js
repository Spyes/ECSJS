import { createEntity,
	 addComponent,
	 getComponentData } from '../Entity';
import { Position, Click, Render } from '../Components';

function clickCell(entity) {
  const data = getComponentData(entity, "Render");
  data.model = "X";
  let action = {
    type: 'UPDATE_COMPONENT',
    entity: entity,
    component: 'Render',
    data: data
  };
  this.store.dispatch(action);
}

export default function CellAssemblage(store) {
  const entity = createEntity(store);
  addComponent(entity,
	       Position(),
	       store);
  addComponent(entity,
	       Click({onClick: clickCell}),
	       store);
  addComponent(entity,
	       Render(),
	       store);
  return store.get(['entities', entity.id]).toJS();
}
