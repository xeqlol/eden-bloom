// Debug, testing, welcome, git, source control graph, settings editor,
// breadcrumbs, symbol icons, debug icons, notebook, charts, ports, comments,
// action bar, gauge, markdown.
import { state } from '../palette.mjs'

export const sections = ['Debug colors', 'Testing colors', 'Welcome page colors', 'Git colors', 'Source Control Graph colors', 'Settings Editor colors', 'Breadcrumbs colors', 'Symbol Icons colors', 'Debug Icons colors', 'Notebook colors', 'Chart colors', 'Ports colors', 'Comments View colors', 'Action Bar colors', 'Gauge colors', 'Markdown']

export default {
  'gitDecoration.addedResourceForeground': state.gitAdded,
  'gitDecoration.modifiedResourceForeground': state.gitModified,
  'gitDecoration.deletedResourceForeground': state.gitDeleted,
}
