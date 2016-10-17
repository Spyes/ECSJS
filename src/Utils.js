export function uniqueId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();  
}

export function log({error, debug}) {
  if (!error) return log({error: [], debug});
  if (!debug) return log({error, debug: []});
  if (!Array.isArray(error)) return log({error: Array(error), debug});
  if (!Array.isArray(debug)) return log({error, debug: Array(debug)});
  error.map(err => console.error(err));
  debug.map(d => console.log(d));
}

export const times = (n, fun) => (
  Array.apply(0, Array(n))
       .map((k, v) => fun(k, v))
);

export const result = (obj = {}, path = [], defaultValue) => {
  if (!Array.isArray(path)) return result(obj, [path]);
  return path.reduce((curr, prev) => curr[prev], obj) || defaultValue;
};
