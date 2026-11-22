// The 16 syntax rules, migrated 1:1 from the overlay's editor.tokenColorCustomizations.
// Foreground values come from palette.tokens so provenance holds.
export const tokenColors = (p) => [
  {
    name: 'Comments',
    scope: ['comment', 'punctuation.definition.comment'],
    settings: { foreground: p.tokens.comment.hex6(), fontStyle: 'italic' },
  },
  {
    name: 'Keywords',
    scope: ['keyword', 'keyword.control', 'storage.type', 'storage.modifier'],
    settings: { foreground: p.tokens.keyword.hex6() },
  },
  {
    name: 'Strings',
    scope: ['string', 'string.quoted'],
    settings: { foreground: p.tokens.string.hex6() },
  },
  {
    name: 'Numbers and constants',
    scope: ['constant.numeric', 'constant.language', 'constant.character'],
    settings: { foreground: p.tokens.number.hex6() },
  },
  {
    name: 'Functions',
    scope: ['entity.name.function', 'support.function', 'meta.function-call'],
    settings: { foreground: p.tokens.fn.hex6() },
  },
  {
    name: 'Types and classes',
    scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'],
    settings: { foreground: p.tokens.type.hex6() },
  },
  {
    name: 'Variables',
    scope: ['variable', 'meta.definition.variable.name'],
    settings: { foreground: p.tokens.variable.hex6() },
  },
  {
    name: 'Parameters',
    scope: ['variable.parameter'],
    settings: { foreground: p.tokens.parameter.hex6(), fontStyle: 'italic' },
  },
  {
    name: 'Properties',
    scope: ['variable.other.property', 'meta.object-literal.key'],
    settings: { foreground: p.tokens.property.hex6() },
  },
  {
    name: 'Operators and punctuation',
    scope: ['keyword.operator', 'punctuation', 'meta.brace'],
    settings: { foreground: p.tokens.operator.hex6() },
  },
  {
    name: 'Tags',
    scope: ['entity.name.tag'],
    settings: { foreground: p.tokens.tag.hex6() },
  },
  {
    name: 'Attributes',
    scope: ['entity.other.attribute-name'],
    settings: { foreground: p.tokens.attribute.hex6() },
  },
  {
    name: 'Markup headings',
    scope: ['markup.heading'],
    settings: { foreground: p.tokens.heading.hex6(), fontStyle: 'bold' },
  },
  {
    name: 'Markup links',
    scope: ['markup.underline.link', 'string.other.link'],
    settings: { foreground: p.tokens.link.hex6(), fontStyle: 'underline' },
  },
  {
    name: 'Inserted text',
    scope: ['markup.inserted'],
    settings: { foreground: p.tokens.inserted.hex6() },
  },
  {
    name: 'Deleted text',
    scope: ['markup.deleted'],
    settings: { foreground: p.tokens.deleted.hex6() },
  },
]
