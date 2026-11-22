// Eden Deep Sea: blue-teal — glacial cyan over abyssal navy.
import { definePalette } from './derive.mjs'

export const palette = definePalette({
  id: 'deep-sea',
  variant: 'Deep Sea',
  description: 'Blue-teal — glacial cyan over abyssal navy',
  base: {
    bg: '#0D1620', raised: '#1A2A3A', muted: '#7E93A8', info: '#94A8E8',
    accent: '#7FD9E8', secondary: '#F0AAB8', error: '#F2808E', warm: '#F0C088',
    bright: '#DDF3EC', success: '#8AD4B4',
  },
  names: {
    bg: 'Abyss', raised: 'Trench', muted: 'Mist', info: 'Indigo',
    accent: 'Glacier', secondary: 'Reef', error: 'Coral', warm: 'Lantern',
    bright: 'Foam', success: 'Seafoam',
  },
})
