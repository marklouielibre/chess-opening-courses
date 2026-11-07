import type { Opening } from '../types/chess'

export const openings: Opening[] = [
  {
    id: 'italian-game',
    name: 'Italian Game',
    category: 'Open game',
    description: 'A classical fight for the center with quick development and active pieces.',
    variations: [
      {
        id: 'italian-giuoco-piano',
        name: 'Giuoco Piano',
        side: 'white',
        moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6', 'O-O', 'O-O', 'Re1', 'a6', 'Bb3', 'Ba7'],
      },
      {
        id: 'evans-gambit',
        name: 'Evans Gambit',
        side: 'white',
        moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4', 'Bxb4', 'c3', 'Ba5', 'd4', 'exd4', 'O-O', 'dxc3', 'Qb3', 'Qf6'],
      },
    ],
  },
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez',
    category: 'Open game',
    description: 'A principled opening that puts lasting pressure on Black’s center.',
    variations: [
      {
        id: 'ruy-lopez-morphy',
        name: 'Morphy Defense',
        side: 'white',
        moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O'],
      },
      {
        id: 'ruy-lopez-berlin',
        name: 'Berlin Defense',
        side: 'black',
        moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6', 'O-O', 'Nxe4', 'd4', 'Nd6', 'Bxc6', 'dxc6', 'dxe5', 'Nf5', 'Qxd8+', 'Kxd8'],
      },
    ],
  },
  {
    id: 'sicilian-defense',
    name: 'Sicilian Defense',
    category: 'Semi-open',
    description: 'An ambitious, asymmetrical answer to 1.e4 with winning chances for both sides.',
    variations: [
      {
        id: 'sicilian-najdorf',
        name: 'Najdorf Variation',
        side: 'black',
        moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Be3', 'e5', 'Nb3', 'Be6', 'f3', 'Be7'],
      },
      {
        id: 'sicilian-dragon',
        name: 'Dragon Variation',
        side: 'black',
        moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6'],
      },
    ],
  },
  {
    id: 'caro-kann',
    name: 'Caro-Kann Defense',
    category: 'Semi-open',
    description: 'A sturdy, reliable defense that supports the center before developing the bishop.',
    variations: [
      {
        id: 'caro-kann-advance',
        name: 'Advance Variation',
        side: 'black',
        moves: ['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5', 'Nf3', 'e6', 'Be2', 'Nd7', 'O-O', 'Ne7', 'Nbd2', 'h6', 'Nb3', 'Bh7'],
      },
      {
        id: 'caro-kann-classical',
        name: 'Classical Variation',
        side: 'black',
        moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6', 'h4', 'h6', 'Nf3', 'Nd7', 'h5', 'Bh7'],
      },
    ],
  },
  {
    id: 'french-defense',
    name: 'French Defense',
    category: 'Semi-open',
    description: 'A resilient counterattacking defense built around the ...d5 pawn break.',
    variations: [
      {
        id: 'french-advance',
        name: 'Advance Variation',
        side: 'black',
        moves: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6', 'a3', 'Nh6', 'b4', 'cxd4', 'cxd4', 'Nf5'],
      },
    ],
  },
  {
    id: 'queens-gambit',
    name: 'Queen’s Gambit',
    category: 'Closed game',
    description: 'A timeless challenge to Black’s center and one of White’s most dependable first moves.',
    variations: [
      {
        id: 'queens-gambit-declined',
        name: 'Queen’s Gambit Declined',
        side: 'white',
        moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'h6', 'Bh4', 'b6', 'cxd5', 'Nxd5'],
      },
      {
        id: 'queens-gambit-accepted',
        name: 'Queen’s Gambit Accepted',
        side: 'white',
        moves: ['d4', 'd5', 'c4', 'dxc4', 'e3', 'Nf6', 'Bxc4', 'e6', 'Nf3', 'c5', 'O-O', 'a6', 'Qe2', 'b5', 'Bb3', 'Bb7'],
      },
    ],
  },
  {
    id: 'kings-indian',
    name: 'King’s Indian Defense',
    category: 'Closed game',
    description: 'A dynamic hypermodern system where Black invites a center and strikes back.',
    variations: [
      {
        id: 'kings-indian-classical',
        name: 'Classical Variation',
        side: 'black',
        moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5', 'O-O', 'Nc6', 'd5', 'Ne7'],
      },
      {
        id: 'kings-indian-samisch',
        name: 'Sämisch Variation',
        side: 'black',
        moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'f3', 'O-O', 'Be3', 'e5', 'd5', 'Nh5', 'Qd2', 'f5'],
      },
    ],
  },
  {
    id: 'london-system',
    name: 'London System',
    category: 'Closed game',
    description: 'A practical, repeatable setup that gives White a clear plan against many defenses.',
    variations: [
      {
        id: 'london-main-line',
        name: 'Main System',
        side: 'white',
        moves: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4', 'e6', 'e3', 'Bd6', 'Bg3', 'O-O', 'Nbd2', 'c5', 'c3', 'Nc6', 'Bd3', 'b6'],
      },
    ],
  },
]
