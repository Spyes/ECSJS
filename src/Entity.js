import { uniqueId } from './Utils';
import { Iterable } from 'immutable';

const Entity = () => (
  {
    id: uniqueId(),
    components: []
  }
);
export default Entity;

export const createEntity = (store) => {
  const entity = Entity();
  const action = { type: "ENTITY_CREATED", entity };
  store.dispatch(action);
  return entity;
};

export const addComponent = (entity, component, store) => {
  const action = { type: "ADD_COMPONENT", entity, component };
  store.dispatch(action);
};

export const getComponent = (entity, component_name) => {
  if (Iterable.isIterable(entity)) return entity.get('components')
				       .find(component =>
					 component.get('name') === component_name)
  return entity.components
	       .find(component =>
		 component.name === component_name)
};

export const hasComponents = (entity, component_names) => (
  component_names.reduce((prev, curr) => (
    prev && getComponent(entity, curr) !== undefined
  ), true)
);
