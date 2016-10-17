import { uniqueId } from './Utils';

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

export const getComponent = (entity, component_name) => (
  entity.get('components')
	.find(component => component.get('name') === component_name)
);
export const hasComponents = (entity, component_names) => (
  component_names.reduce((prev, curr) => (
    prev && getComponent(entity, curr) !== undefined
  ), true)
);
