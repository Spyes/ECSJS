import { uniqueId } from './Utils';
import { Map, Iterable } from 'immutable';

const Entity = ({type: type} = {type: ""}) => (
  {
    id: uniqueId(),
    type,
    components: []
  }
);
export default Entity;

export const createEntity = (store, opts = {}) => {
  const entity = Entity(opts);
  const action = { type: "ENTITY_CREATED", entity };
  store.dispatch(action);
  return entity;
};

export const addComponent = (entity, component, store) => {
  const action = { type: "ADD_COMPONENT", entity, component };
  store.dispatch(action);
};

export const addComponents = (entity, components, store) => {
  components.map(comp => addComponent(entity, comp, store));
};

export const getComponentData = (entity, component_name) => {
  const component = getComponent(entity, component_name);
  const is_iter = Iterable.isIterable(component);
  if (is_iter) return component.get('data', Map());
  return component ? component.data : {};
};

export const getComponent = (entity, component_name) => {
  const is_iter = Iterable.isIterable(entity);
  const components = is_iter ? entity.get('components') : entity.components;
  return components.find(component => {
    if (is_iter) return component.get('name') === component_name;
    return component.name === component_name
  })
};

export const hasComponents = (entity, component_names = []) => (
  component_names.reduce((prev, curr) => (
    prev && getComponent(entity, curr) !== undefined
  ), true)
);
