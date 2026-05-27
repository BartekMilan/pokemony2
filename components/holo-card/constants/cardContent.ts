export type PokemonType = 'fire' | 'water' | 'grass' | 'electric';

export type CardContent = {
  name: string;
  hp: number;
  type: PokemonType;
  stage: string;
  attacks: { name: string; damage: string; description: string }[];
  weakness: string;
  resistance: string;
  retreat: string;
};

export const TYPE_COLORS: Record<PokemonType, { primary: string; secondary: string; accent: string }> = {
  fire: { primary: '#c62828', secondary: '#ff6f00', accent: '#ffab00' },
  water: { primary: '#1565c0', secondary: '#0288d1', accent: '#4fc3f7' },
  grass: { primary: '#2e7d32', secondary: '#558b2f', accent: '#aed581' },
  electric: { primary: '#f9a825', secondary: '#fbc02d', accent: '#fff59d' },
};

export const SAMPLE_CARD: CardContent = {
  name: 'Charizard',
  hp: 120,
  type: 'fire',
  stage: 'Stage 2',
  attacks: [
    { name: 'Ember', damage: '30', description: 'Flip a coin. If tails, discard an Energy.' },
    { name: 'Fire Spin', damage: '90', description: 'Discard 2 Energy attached to this Pokémon.' },
  ],
  weakness: 'Water ×2',
  resistance: 'Fighting -30',
  retreat: '3',
};
