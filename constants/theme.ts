// Design tokens — the single source of truth.
// Values come from docs/DESIGN.md ("First Light" palette). Keep the two in sync.

export const colors = {
  cream: '#FBF7EF',
  mist: '#F1E9DB',
  ink: '#2C2A26',
  inkSoft: '#6B6459',
  dawn: '#E9B44C',
  ember: '#E07A5F',
  sage: '#81B29A',
  sageSoft: '#E7F0EA',
  sageDeep: '#4F7460',
  night: '#232946',
  nightSoft: '#2E3454',
  starlight: '#F5F1E8',
  starlightSoft: '#9BA0C0',
} as const;

export const fonts = {
  serif: 'Fraunces_600SemiBold',
  serifItalic: 'Fraunces_400Regular_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
} as const;

export const radius = {
  card: 22,
  button: 999,
} as const;

export const shadow = {
  shadowColor: '#2C2A26',
  shadowOpacity: 0.08,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 8 },
  elevation: 4,
} as const;
