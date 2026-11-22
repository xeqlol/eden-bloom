// Eden Moss: forest greens — moss and lichen over pine.
import { definePalette } from './derive.mjs'

export const palette = definePalette({
  id: 'moss',
  variant: 'Moss',
  description: 'Forest greens — moss light over pine and lichen',
  base: {
    bg: '#131A14', raised: '#1F2B21', muted: '#8A9C8A', info: '#8FC0E8',
    accent: '#B8E39B', secondary: '#E3B7C3', error: '#F08A8A', warm: '#EFC486',
    bright: '#F2EFD0', success: '#7FC9A6',
  },
  names: {
    bg: 'Pine', raised: 'Fir', muted: 'Lichen', info: 'Sky',
    accent: 'Moss', secondary: 'Thistle', error: 'Rowan', warm: 'Pollen',
    bright: 'Moonlit', success: 'Fern',
  },
})
