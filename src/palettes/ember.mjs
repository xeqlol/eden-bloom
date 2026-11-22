// Eden Ember: warm sunset — ember oranges over dark umber.
import { definePalette } from './derive.mjs'

export const palette = definePalette({
  id: 'ember',
  variant: 'Ember',
  description: 'Warm sunset — ember orange over dark umber and cinder',
  base: {
    bg: '#221612', raised: '#382420', muted: '#9C8272', info: '#9FB0DC',
    accent: '#F0A35E', secondary: '#E8AFA8', error: '#F2838D', warm: '#F5C069',
    bright: '#FFE0B8', success: '#A8CB8F',
  },
  names: {
    bg: 'Cinder', raised: 'Umber', muted: 'Ash', info: 'Dusk',
    accent: 'Ember', secondary: 'Clay', error: 'Spark', warm: 'Amber',
    bright: 'Candlelight', success: 'Olive',
  },
})
