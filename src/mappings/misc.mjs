// Debug, testing, welcome, git, source control graph, settings editor,
// breadcrumbs, symbol icons, debug icons, notebook, charts, ports, comments,
// action bar, gauge, markdown.

export const sections = ['Debug colors', 'Testing colors', 'Welcome page colors', 'Git colors', 'Source Control Graph colors', 'Settings Editor colors', 'Breadcrumbs colors', 'Symbol Icons colors', 'Debug Icons colors', 'Notebook colors', 'Chart colors', 'Ports colors', 'Comments View colors', 'Action Bar colors', 'Gauge colors', 'Markdown']

export default (p) => ({
  'gitDecoration.addedResourceForeground': p.state.gitAdded,
  'gitDecoration.modifiedResourceForeground': p.state.gitModified,
  'gitDecoration.deletedResourceForeground': p.state.gitDeleted,
})
