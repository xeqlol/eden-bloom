local wezterm = require 'wezterm'

local config = wezterm.config_builder()

config.color_schemes = {
  -- Мягкая версия палитры #6f1d1b #bb9457 #432818 #99582a #ffe6a7:
  -- всё на среднюю светлоту, насыщенность понижена, акценты не выпрыгивают
  ['Coffee Leather'] = {
    foreground = '#e6d5b0', -- крем приглушён и притемнён
    background = '#343028', -- тёмно-серый с тёплым подтоном
    cursor_bg = '#e6d5b0',
    cursor_fg = '#343028',
    selection_bg = '#6a4e33', -- тусклый тан вместо яркого #bb9457
    selection_fg = '#ede0c0',
    split = '#52493d',
    ansi = {
      '#3f3a33', -- black: мягкий тёплый графит
      '#b0604f', -- red
      '#98a377', -- green: шалфей
      '#cfa96b', -- yellow
      '#89a2b3', -- blue
      '#a9899b', -- magenta
      '#7ba39a', -- cyan
      '#d9cbae', -- white
    },
    brights = {
      '#85705a', -- bright black: комментарии
      '#d08270', -- soft terracotta
      '#b6c294',
      '#e4c98d',
      '#abc0d1',
      '#c7a9bb',
      '#9dc2b9',
      '#ede0c0',
    },
    tab_bar = {
      background = '#2d2a24',
      active_tab = { bg_color = '#6a4e33', fg_color = '#ede0c0' },
      inactive_tab = { bg_color = '#403a31', fg_color = '#a08c6c' },
      inactive_tab_hover = { bg_color = '#6f3d33', fg_color = '#ede0c0', italic = true },
      new_tab = { bg_color = '#2d2a24', fg_color = '#a08c6c' },
      new_tab_hover = { bg_color = '#6a4e33', fg_color = '#ede0c0' },
    },
  },
  ['Monokai Pro'] = {
    foreground = '#FCFCFA',
    background = '#2D2A2E',
    cursor_bg = '#FCFCFA',
    cursor_fg = '#2D2A2E',
    selection_bg = '#403E41',
    selection_fg = '#FCFCFA',
    split = '#727072',
    ansi = {
      '#403E41', -- black (comment bg / bright: #727072)
      '#FF6188', -- red
      '#A9DC76', -- green
      '#FFD866', -- yellow
      '#FC9867', -- blue -> orange (в Monokai Pro нет синего, слот blue занимает orange)
      '#AB9DF2', -- magenta -> purple
      '#78DCE8', -- cyan
      '#FCFCFA', -- white
    },
    brights = {
      '#727072', -- bright black = comment
      '#FF6188',
      '#A9DC76',
      '#FFD866',
      '#FC9867',
      '#AB9DF2',
      '#78DCE8',
      '#FCFCFA',
    },
  },
}
config.color_scheme = 'Coffee Leather'
config.front_end = 'WebGpu'
config.max_fps = 144

config.font = wezterm.font 'JetBrainsMono Nerd Font'
config.font_size = 13
return config
