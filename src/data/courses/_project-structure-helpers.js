(function () {
const file = (name, role, description, extra = {}) =>
    ({name, type: 'file', role, description, ...extra});
const folder = (name, role, description, children = [], extra = {}) =>
    ({name, type: 'folder', role, description, children, ...extra});
const common = {
  commit: 'Usually commit',
  required: false,
  generated: false,
  rename: 'Sometimes, if imports and tooling are updated.',
  delete: 'Only after confirming nothing imports or requires it.'
};
const withDefaults = node =>
    ({...common, ...node, children: node.children?.map(withDefaults)});
const structure = config => ({...config, tree: withDefaults(config.tree)});
  window.DevPathProjectStructures = {file, folder, structure};
  window.ACADEMY_PROJECT_STRUCTURES = window.ACADEMY_PROJECT_STRUCTURES || {};
})();
