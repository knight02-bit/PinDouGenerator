import type { BeadColor } from '../types';

const perlerColorDefinitions: Array<[string, string]> = [
  ['P01', '#F1F1F1'],
  ['P02', '#E0DEA9'],
  ['P03', '#ECD800'],
  ['P04', '#ED6120'],
  ['P05', '#F01820'],
  ['P06', '#DD669B'],
  ['P07', '#604089'],
  ['P08', '#2B3F87'],
  ['P09', '#3370C0'],
  ['P10', '#1C753E'],
  ['P11', '#56BA9F'],
  ['P12', '#513931'],
  ['P17', '#8A8D91'],
  ['P18', '#2E2F32'],
  ['P20', '#8C372C'],
  ['P21', '#815D34'],
  ['P33', '#EEBAB2'],
  ['P35', '#BC9371'],
  ['P38', '#F22A7B'],
  ['P47', '#DCE002'],
  ['P48', '#FF7700'],
  ['P49', '#019E43'],
  ['P50', '#FF3991'],
  ['P52', '#5390D1'],
  ['P53', '#76C882'],
  ['P54', '#8A72C1'],
  ['P56', '#FEF875'],
  ['P57', '#F1AA0C'],
  ['P58', '#93C8D4'],
  ['P59', '#FF3851'],
  ['P60', '#A24B9C'],
  ['P61', '#6CBE13'],
  ['P62', '#2B89C6'],
  ['P63', '#FF8285'],
  ['P70', '#647CBE'],
  ['P75', '#BEC696'],
  ['P79', '#F6B3DD'],
  ['P80', '#4FAD42'],
  ['P81', '#EEE3CF'],
  ['P82', '#AD98D4'],
  ['P83', '#E44892'],
  ['P85', '#BB7634'],
  ['P88', '#A53061'],
  ['P90', '#D48437'],
  ['P91', '#067C81'],
  ['P92', '#4D5156'],
  ['P93', '#8297D9'],
  ['P96', '#801922'],
  ['P97', '#BDDA01'],
  ['P98', '#E4B690'],
  ['P100', '#F97E79'],
  ['P101', '#7AAEA2'],
  ['P102', '#84B791'],
  ['P103', '#CAC033'],
  ['P104', '#D7A8A2'],
  ['P105', '#777B81'],
  ['P179', '#114938'],
];

function getPerlerCodeNumber(code: string) {
  return Number.parseInt(code.replace(/^P/, ''), 10);
}

function hexToRgb(hex: string): [number, number, number] {
  const normalizedHex = hex.replace('#', '');
  return [
    Number.parseInt(normalizedHex.slice(0, 2), 16),
    Number.parseInt(normalizedHex.slice(2, 4), 16),
    Number.parseInt(normalizedHex.slice(4, 6), 16),
  ];
}

export const perlerColors: BeadColor[] = [...perlerColorDefinitions]
  .sort(([leftCode], [rightCode]) => getPerlerCodeNumber(leftCode) - getPerlerCodeNumber(rightCode))
  .map(([code, hex]) => ({
    id: code,
    name: code,
    hex,
    rgb: hexToRgb(hex),
    brand: 'perler',
  }));
