# WezTerm: всё, что раскрашивается, и форматы собственной цветовой схемы

Исследование по официальной документации WezTerm (и выборочно — по исходникам репозитория wez/wezterm, где документация умалчивает). Дата: 2026-11-21.

Важно про адреса: старые ссылки вида `https://wezfurlong.org/wezterm/...` больше не работают (404); актуальный официальный сайт документации — `https://wezterm.org` (то же содержимое, что в `docs/` репозитория). Ниже все ссылки даны на wezterm.org.

Актуальный стабильный релиз — `20240203-110809-5046fc22`; всё, что новее (см. пометки «nightly» ниже), есть только в nightly-сборках.
Источник: https://wezterm.org/changelog.html

---

## 1. Полный список цветовых ключей схемы / таблицы `colors`

Схема (файл .toml, `config.color_schemes[имя]` или `config.colors`) принимает один и тот же набор ключей — это структура `Palette` из исходников (`config/src/color.rs`).
Источники: https://wezterm.org/config/appearance.html (раздел «Defining your own colors»), https://wezterm.org/config/lua/config/colors.html

### 1.1. Базовые цвета терминала (скалярные ключи верхнего уровня)

| Ключ | Назначение | Начиная с версии |
|---|---|---|
| `foreground` | цвет текста по умолчанию | давно |
| `background` | цвет фона по умолчанию | давно |
| `cursor_bg` | фон ячейки под курсором (при стиле Block) | давно |
| `cursor_fg` | цвет текста в ячейке под курсором | давно |
| `cursor_border` | рамка курсора (Block) либо цвет полоски Bar/Underline | давно |
| `selection_fg` | цвет выделенного текста | давно |
| `selection_bg` | фон выделенного текста | давно |
| `scrollbar_thumb` | цвет «бегунка» скроллбара (при `enable_scroll_bar = true`) | давно |
| `split` | цвет линий разделителей панелей | давно |
| `visual_bell` | цвет вспышки «visual bell» (есть в структуре `Palette` исходников; в примере документации не показан) | давно (исходники) |
| `compose_cursor` | цвет курсора во времяcompose/IME/leader-ввода | 20220319-142410-0fcdea07 |
| `compose_fg` | цвет текста предпросмотра композиции/IME (fallback — `cursor_fg`) | nightly |
| `compose_bg` | фон предпросмотра композиции/IME (fallback — `cursor_bg`) | nightly |

Источник всех строк таблицы: https://wezterm.org/config/appearance.html#defining-your-own-colors (для `visual_bell` — структура `Palette`, https://github.com/wez/wezterm/blob/main/config/src/color.rs).

### 1.2. Специальные ключи типа ColorSpec (принимают `{ Color = '...' }` или `{ AnsiColor = 'Имя' }`)

- `copy_mode_active_highlight_bg`, `copy_mode_active_highlight_fg` — активная подсветка выделения в copy mode (если текст выделен мышью дополнительно);
- `copy_mode_inactive_highlight_bg`, `copy_mode_inactive_highlight_fg` — неактивная подсветка;
- `quick_select_label_bg`, `quick_select_label_fg` — фон/текст меток quick select;
- `quick_select_match_bg`, `quick_select_match_fg` — подсветка совпадений quick select;
- `input_selector_label_bg`, `input_selector_label_fg` — метки input selector — **nightly**;
- `launcher_label_bg`, `launcher_label_fg` — метки launcher menu — **nightly**.

Все появились в 20220807-113146-c2fee766 (кроме помеченных nightly).
Значения-обёртки: `{ Color = '#rrggbb' }` либо `{ AnsiColor = 'Black' }`. Допустимые имена AnsiColor (индексы 0–15): `Black`, `Maroon`, `Green`, `Olive`, `Navy`, `Purple`, `Teal`, `Silver`, `Grey`, `Red`, `Lime`, `Yellow`, `Blue`, `Fuchsia`, `Aqua`, `White`.
Источник: https://wezterm.org/config/appearance.html#defining-your-own-colors

### 1.3. Палитра

- `ansi` — массив из ровно 8 цветов (индексы 0–7, стандартные ANSI);
- `brights` — массив из ровно 8 цветов (индексы 8–15, яркие);
- `indexed` — таблица/секция с произвольными индексами диапазона 16–255, например `[136] = '#af8700'` (Lua) или `136 = "#af8700"` (TOML).

**Гоча для TOML-файлов: схема обязана содержать `ansi`** — иначе файл отбрасывается с ошибкой «scheme is missing ANSI colors» (проверено по исходникам: `ColorSchemeFile::from_toml_value` в config/src/color.rs).
Источник: https://wezterm.org/config/appearance.html#defining-your-own-colors ; исходники: https://github.com/wez/wezterm/blob/main/config/src/color.rs

### 1.4. Таб-бар: `colors.tab_bar.*` (входит в схему)

Ключи-группы (структура `TabBarColors`):

- `background` — фон полосы таб-бара. **Действует ТОЛЬКО в retro-режиме** — в документации прямо написано: «The color of the strip that goes along the top of the window (does not apply when fancy tab bar is in use)». Источник: https://wezterm.org/config/appearance.html#retro-tab-bar-appearance
- `active_tab` — активная вкладка;
- `inactive_tab` — неактивные вкладки;
- `inactive_tab_hover` — неактивная вкладка под курсором мыши;
- `new_tab` — кнопка «+» (новая вкладка);
- `new_tab_hover` — она же под курсором мыши;
- `inactive_tab_edge` — цвет разделителя/края у неактивных вкладок (показан в примере для fancy-бара);
- `inactive_tab_edge_hover` — то же под курсором (есть в структуре и в данных схем; в примере документации не показан).

Каждая из групп `active_tab` / `inactive_tab` / `inactive_tab_hover` / `new_tab` / `new_tab_hover` (структура `TabBarColor`) принимает одни и те же поля:

- `bg_color` — фон элемента (именно `bg_color`, НЕ `bg`);
- `fg_color` — текст элемента (именно `fg_color`, НЕ `fg`);
- `intensity` — `"Half"` | `"Normal"` (по умолчанию) | `"Bold"`;
- `underline` — `"None"` (по умолчанию) | `"Single"` | `"Double"`;
- `italic` — `true`/`false` (по умолчанию `false`);
- `strikethrough` — `true`/`false` (по умолчанию `false`).

Полей `italic_font` и подобных в текущей версии нет — текстовые атрибуты ограничены шестью полями выше (проверено по структуре `TabBarColor` в config/src/color.rs).
Источник: https://wezterm.org/config/appearance.html#retro-tab-bar-appearance

**Что где действует (проверено по документации):**

- Fancy (нативный) таб-бар — по умолчанию (`use_fancy_tab_bar = true`). Для него документация показывает `config.window_frame` (см. 1.5) плюс `colors.tab_bar.inactive_tab_edge`, и прямо говорит: «In addition, the tab bar colors mentioned below also apply to the items displayed in the tab bar» — то есть `active_tab`/`inactive_tab`/`inactive_tab_hover`/`new_tab`/`new_tab_hover` красят сами элементы вкладок В ОБОИХ режимах. Единственный заведомо retro-only ключ — `tab_bar.background`. Источники: https://wezterm.org/config/appearance.html#native-fancy-tab-bar-appearance , https://wezterm.org/config/appearance.html#retro-tab-bar-appearance
- Retro таб-бар (`use_fancy_tab_bar = false`) — полоса рисуется основным терминальным шрифтом, фон полосы берётся из `tab_bar.background`; `window_frame` на полосу не влияет. Также `tab_max_width` (макс. ширина вкладки в ячейках) задан «when using retro tab mode». Источники: https://wezterm.org/config/appearance.html#tab-bar-appearance-colors , https://wezterm.org/config/lua/config/use_fancy_tab_bar.html

### 1.5. `config.window_frame` (НЕ входит в схему .toml — только wezterm.lua)

Страница опции: https://wezterm.org/config/lua/config/window_frame.html (с 20210814-124438-54e29167). Документация: «This setting is applicable primarily on Wayland systems when client side decorations are in use. It allows you to customize the colors of the window frame. Some of these colors are used by the fancy tab bar.»

Цветовые ключи (полный набор по структуре `WindowFrameConfig`, config/src/color.rs; в примере на странице опции показаны не все):

- `active_titlebar_bg` — фон титлбара/таб-бара активного окна;
- `inactive_titlebar_bg` — то же для неактивного окна;
- `active_titlebar_fg` / `inactive_titlebar_fg` — цвет текста заголовка (есть в структуре и в примере на странице опции);
- `active_titlebar_border_bottom` / `inactive_titlebar_border_bottom` — цвет нижней границы титлбара;
- `button_fg`, `button_bg` — кнопки заголовка окна;
- `button_hover_fg`, `button_hover_bg` — они же при наведении. (Ключа `button_selected.bg` в текущей версии НЕ существует.)

Нецветовые ключи там же: `font` (по умолчанию `Roboto Bold`, идёт в комплекте), `font_size` (по умолчанию 10.0 на Windows, 12.0 на остальных), и с 20220903-194523-3bb1ed61 — рамка окна: `border_left_width`, `border_right_width`, `border_top_height`, `border_bottom_height` (значения вида `'0.5cell'`) и `border_left_color`, `border_right_color`, `border_top_color`, `border_bottom_color`.
Источники: https://wezterm.org/config/lua/config/window_frame.html , https://wezterm.org/config/appearance.html#native-fancy-tab-bar-appearance

### 1.6. Цветовые опции вне схемы (для полноты «всего раскрашиваемого»)

Отдельные опции конфига, принимающие цвета (в схему не входят, задаются в wezterm.lua):

- `command_palette_bg_color` / `command_palette_fg_color` — палитра команд (с 20230320-124340-559cb7b0). https://wezterm.org/config/lua/config/command_palette_bg_color.html
- `char_select_bg_color` / `char_select_fg_color` — режим выбора символов. https://wezterm.org/config/lua/config/char_select_bg_color.html
- `integrated_title_button_color` — `"Auto"` либо цвет, при `window_decorations = "INTEGRATED_BUTTONS|RESIZE"` (с 20230408-112425-69ae8472). https://wezterm.org/config/lua/config/integrated_title_button_color.html
- `win32_acrylic_accent_color` — акцент Acrylic на Windows старше build 22621 (с 20230712-072601-f4abf8fd). https://wezterm.org/config/lua/config/win32_acrylic_accent_color.html
- Фон окна: `window_background_opacity`, `text_background_opacity`, `window_background_image` (+ `window_background_image_hsb`), `window_background_gradient`, послойный `background`. https://wezterm.org/config/appearance.html (разделы Window Background ...)
- Цветокоррекция: `inactive_pane_hsb` (dimming неактивных панелей), `foreground_text_hsb`. https://wezterm.org/config/appearance.html
- Поведение палитры: `bold_brightens_ansi_colors` (усиливать ли bold яркими цветами), `text_min_contrast_ratio`, `force_reverse_video_cursor` + `reverse_video_cursor_min_contrast`. https://wezterm.org/config/lua/config/bold_brightens_ansi_colors.html

Итого масштаб полной схемы: ~25 скалярных ключей + 16 слотов `ansi`/`brights` + до 240 `indexed` + ~33 поля `tab_bar` внутри `colors`; плюс ~20 ключей `window_frame` снаружи схемы.

---

## 2. Допустимый синтаксис значений цветов

Документировано (https://wezterm.org/config/appearance.html#defining-your-own-colors):

- имена цветов **SVG/CSS3** (`'silver'`, `'black'`, `'peru'`, ...) — список имён: https://docs.rs/palette/0.4.1/palette/named/index.html#constants ;
- hex: `#RRGGBB` («usual hex notation», пример `#000000`);
- `hsl:H S L` — H в градусах 0–360, S и L в процентах 0–100, например `'hsl:235 100 50'` (с 20220101-133340-7edc5b5a);
- с 20220319-142410-0fcdea07 — CSS-функции: `rgb(0,255,0)`, `rgb(0% 100% 0%)`, `rgb(0 255 0 / 100%)`, `rgba(0,255,0,1)`, `hsl(120,100%,50%)`, `hsl(120deg 100% 50%)`, `hsl(-240 100% 50%)`, `hsl(0.3333turn 100% 50%)`, `hsl(133.333grad 100% 50%)`, `hsl(2.0944rad 100% 50%)`, `hsla(120,100%,50%,100%)`, `hwb(120 0% 0%)`, `hwb(480deg 0% 0% / 100%)`, `hsv(120,100%,100%)`, `hsv(120deg 100% 100% / 100%)`;
- спец-значение `'none'` для `selection_fg` (полная прозрачность — используется текущий цвет текста); `selection_bg` с альфой блендится поверх фона ячейки.

Альфа-канал игнорируется везде, КРОМЕ `selection_fg` и `selection_bg` (цитата: «The alpha value is ignored except when used with `selection_fg` and `selection_bg`»).
Источник: https://wezterm.org/config/appearance.html#defining-your-own-colors

Дополнительно (выяснено по исходникам парсера `SrgbaTuple::from_str`, color-types/src/lib.rs, https://github.com/wez/wezterm/blob/main/color-types/src/lib.rs):

- hex с `#` допускает 1–4 hex-цифры НА КАНАЛ, т.е. `#RGB`, `#RRGGBB`, `#RRRGGGBBB`, `#RRRRGGGGBBBB` (X11-стиль); а вот `#RGBA`/`#RRGGBBAA` (4 и 8 цифр с альфой) этим путём НЕ разбираются — альфу задавайте через `rgba(...)`;
- X11-синтаксис `rgb:R/G/B` и `rgba:R/G/B/A` (значения 0–255 или проценты).

Для порта из VSCode-темы достаточно `#rrggbb` — это гарантированно работает и в Lua, и в TOML.

---

## 3. Два способа доставки собственной схемы

### 3a. Отдельный TOML-файл схемы

Формат (см. любой из ~1001 встроенных schem'ы, например в https://github.com/wez/wezterm/tree/main/config/src/scheme_data.rs):

```toml
# ИмяФайлаСхемы.toml
[colors]
foreground = "#c0c0c0"
background = "#1a1b26"
cursor_bg = "#..."
cursor_fg = "#..."
cursor_border = "#..."
selection_fg = "#..."
selection_bg = "#..."
scrollbar_thumb = "#..."
split = "#..."
ansi = ["#...", "#...", "#...", "#...", "#...", "#...", "#...", "#..."]
brights = ["#...", "#...", "#...", "#...", "#...", "#...", "#...", "#..."]

[colors.indexed]
16 = "#..."
17 = "#..."

# опционально: вся таб-барная секция целиком
[colors.tab_bar]
background = "#..."                    # только retro-бар
inactive_tab_edge = "#..."
[colors.tab_bar.active_tab]
bg_color = "#..."
fg_color = "#..."
intensity = "Normal"
underline = "None"
italic = false
strikethrough = false
# ... inactive_tab / inactive_tab_hover / new_tab / new_tab_hover — те же поля

[metadata]
name = "My Theme"          # имя схемы; если не задать — берётся имя файла без .toml
author = "..."
origin_url = "..."          # именно origin_url; ключ `url` парсером игнорируется
wezterm_version = "..."
aliases = ["..."]           # альтернативные имена, под которыми схема тоже видна
```

Требования и факты (документация + проверено по исходникам config/src/config.rs, функция `load_color_schemes` / `compute_color_scheme_dirs`):

- расширение файла — строго `.toml`; **без секции `ansi` файл не загрузится**;
- имя, под которым схема видна в `color_scheme`, берётся из `metadata.name`, а при его отсутствии — из имени файла без `.toml`;
- в TOML нельзя задать `window_frame` — схема содержит только `colors` + `metadata` (структура `ColorSchemeFile`).

**Где WezTerm ищет эти файлы.** Документация (https://wezterm.org/config/appearance.html#defining-a-color-scheme-in-a-separate-file) говорит дословно:

- POSIX: рекомендуется `$HOME/.config/wezterm/colors`;
- Windows: «On a Windows system, `wezterm` will search for schemes in a directory named `colors` that is in the same directory as the `wezterm.exe`.» — т.е. `<папка_с_wezterm.exe>\colors`.

По исходникам (config/src/lib.rs `config_dirs()` + config/src/config.rs `compute_color_scheme_dirs()`) фактический список каталогов поиска на Windows, в порядке приоритета:

1. `<каталог wezterm.exe>\colors` — вставляется первым («thumb drive mode»);
2. все каталоги из `config.color_scheme_dirs` (в порядке перечисления);
3. `%XDG_CONFIG_HOME%\wezterm\colors`, а если переменная не задана — `%USERPROFILE%\.config\wezterm\colors`
   (на Windows `HOME_DIR` = `%USERPROFILE%`, поэтому `C:\Users\<user>\.config\wezterm\colors` тоже работает; posix-овое расширение через `XDG_CONFIG_DIRS` на Windows не применяется).

При совпадении имён выигрывает схема, загруженная раньше (первая), а Lua-схемы из `config.color_schemes` вообще не перебиваются файлами.

Свои каталоги задаются опцией `color_scheme_dirs`:

```lua
config.color_scheme_dirs = { 'C:/Users/xeqlo/Documents/Coding Projects/Theme/wezterm-colors' }
```

Источник: https://wezterm.org/config/appearance.html#defining-a-color-scheme-in-a-separate-file

Подключение из wezterm.lua:

```lua
config.color_scheme = 'My Theme'  -- metadata.name либо имя файла без .toml
```

«Color scheme names that are defined in files in your `color_scheme_dirs` list take precedence over the built-in color schemes.»
Источник: https://wezterm.org/config/appearance.html#defining-a-color-scheme-in-a-separate-file

### 3b. Инлайн в Lua

Вариант 1 — набор именованных схем (`config.color_schemes`), выбор — `config.color_scheme`:

```lua
config.color_scheme = 'Red Scheme'

config.color_schemes = {
  ['Red Scheme']  = { background = 'red' },   -- доступны ВСЕ ключи из раздела 1.1–1.4
  ['Blue Scheme'] = { background = 'blue' },
}
```

«All of the settings available from the `colors` section are available to use in the `color_schemes` sections.» И: «Color schemes names that you define in your `wezterm.lua` take precedence over all other color schemes.»
Источник: https://wezterm.org/config/appearance.html#defining-a-color-scheme-in-your-weztermlua

Вариант 2 — прямая таблица `config.colors = { ... }` (те же ключи, без имени).
Источник: https://wezterm.org/config/appearance.html#defining-your-own-colors , https://wezterm.org/config/lua/config/colors.html

### 3c. Приоритеты `color_scheme` / `color_schemes` / `colors`

- До 20220903-194523-3bb1ed61: `color_scheme` «takes precedence over the `colors` section below, and is mutually exclusive with it».
- Начиная с 20220903-194523-3bb1ed61: сначала берётся схема из `color_scheme`, затем ключи из `colors` НАКЛАДЫВАЮТСЯ поверх неё как переопределения (поведение подтверждается и исходниками: `cfg.resolved_palette.overlay_with(colors)`).
Источник: https://wezterm.org/config/appearance.html#precedence-of-colors-vs-color_schemes
- Разрешение имени схемы: сначала `color_schemes` из wezterm.lua, затем схемы из .toml-файлов (`color_scheme_dirs`, exe-каталог, config-каталоги), затем 1001 встроенная схема («wezterm.lua» > файлы > builtin). Источники: https://wezterm.org/config/appearance.html#defining-a-color-scheme-in-your-weztermlua , https://wezterm.org/config/appearance.html#defining-a-color-scheme-in-a-separate-file , исходники config/src/config.rs `resolve_color_scheme`.
- Если `color_scheme` указывает на несуществующее имя — в лог пишется ошибка «but that scheme was not found» (исходники).
- CLI-перекрытие `--config` всегда сильнее конфига: «Configuration specified via the command line will always override the values provided by the configuration file». Источник: https://wezterm.org/config/files.html#configuration-overrides

Практический вывод для порта темы: схема целиком в TOML (или в `color_schemes`), а в `colors` — только точечные правки поверх; `window_frame` — всегда отдельно в wezterm.lua.

---

## 4. Локальная проверка: просмотр и перебор схем

### CLI-подкоманды: схемы перечислять НЕЧЕМ

У `wezterm` нет подкоманды вида `ls-schemes` — проверено и по документации CLI, и по фактическому перечню подкоманд в исходниках (`enum SubCommand` в wezterm/src/main.rs): только `start`, `ssh`, `serial`, `connect`, `ls-fonts`, `show-keys`, `cli`, `imgcat`, `set-working-directory`, `record`, `replay`, `shell-completion` (+ скрытые `help` и алиас `-e`).
Источники: https://wezterm.org/cli/general.html (синопсис `wezterm --help`), https://github.com/wez/wezterm/blob/main/wezterm/src/main.rs

### Как всё-таки посмотреть имена и превью

1. **Каталог в доках**: https://wezterm.org/colorschemes/index.html — все 1001 встроенных схем по алфавиту, у каждой своя страница со скриншотом (ссылки вида `https://wezterm.org/colorschemes/a/index.html` и далее).
2. **Список имён программно** — `wezterm.get_builtin_color_schemes()` возвращает Lua-таблицу `имя → определение схемы` (с 20220101-133340-7edc5b5a):

```lua
local wezterm = require 'wezterm'
for name, _ in pairs(wezterm.get_builtin_color_schemes()) do
  wezterm.log_error(name)   -- или print(name)
end
```

Источник: https://wezterm.org/config/lua/wezterm/get_builtin_color_schemes.html
3. **Быстрое превью одной схемы без правки конфига** — глобальная опция `--config` (перед подкомандой):

```bash
# Git Bash / PowerShell:
wezterm --config 'color_scheme="My Theme"' start
# cmd.exe (двойные кавычки с экранированием):
wezterm --config "color_scheme=\"My Theme\"" start
```

Источник (опции `--config`, `--config-file`, `--skip-config`): https://wezterm.org/cli/general.html , примеры переопределений: https://wezterm.org/config/files.html#configuration-overrides
4. **Живая перезагрузка**: WezTerm следит за wezterm.lua и перезагружает конфиг при сохранении; принудительно — `CTRL+SHIFT+R`. Источник: https://wezterm.org/config/files.html#configuration-files
5. **Помощники для порта**:
   - `wezterm.color.load_scheme(путь)` — читает TOML-схему, возвращает `colors, metadata`;
   - `wezterm.color.save_scheme(colors, metadata, путь)` — пишет TOML-схему (удобно, чтобы сгенерировать .toml из Lua-таблицы);
   - `wezterm.color.load_base16_scheme(путь)` и `wezterm.color.load_terminal_sexy_scheme(путь)` — импорт из base16/terminal.sexy.
   Источники: https://wezterm.org/config/lua/wezterm.color/load_scheme.html , https://wezterm.org/config/lua/wezterm.color/save_scheme.html

---

## 5. Мини-чеклист порта VSCode-темы

1. Сопоставить: `foreground`/`background` ↔ `editor.foreground`/`editor.background`; `ansi[0..7]`+`brights[0..7]` ↔ `terminal.ansiBlack`...`terminal.brightWhite`; `cursor_bg`/`cursor_fg`/`cursor_border` ↔ `terminalCursor.*`; `selection_fg`/`selection_bg` ↔ `selection.background/foreground`.
2. Положить `MyTheme.toml` (с `[colors]`, обязательным `ansi`, `[colors.tab_bar]` по желанию и `[metadata] name = "My Theme"`) в `C:\Users\xeqlo\.config\wezterm\colors\` (создать каталоги) — или в любой свой каталог и указать его в `config.color_scheme_dirs`.
3. В wezterm.lua: `config.color_scheme = 'My Theme'`; fancy-бар докрасить через `config.window_frame` (это вне схемы).
4. Проверка: `wezterm --config 'color_scheme="My Theme"' start`; правки подхватываются при сохранении / `CTRL+SHIFT+R`.
