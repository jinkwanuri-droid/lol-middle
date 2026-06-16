export type Role = 'TOP' | 'JGL' | 'MID' | 'BOT' | 'SUP';

export interface PlayerStats {
  games: number;
  wins: number;
  losses: number;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  vision: number;
  cs: number;
  dpm: number;
  gpm: number;
  csm: number;
  dpg: number;
  damagePercent: number;
  mostPlayed?: { name: string; id: string; wins: number; losses: number; }[];
}

export interface Player {
  id: string;
  name: string;
  summonerName?: string;
  role: Role;
  teamId: string;
  tierScore: number;
  stats: PlayerStats;
}

export interface TeamStats {
  games: number;
  wins: number;
  losses: number;
  kills: number;
  deaths: number;
  assists: number;
  towers: number;
  dragons: number;
  barons: number;
}

export interface HeadToHeadRecord {
  opponentId: string;
  opponentName: string;
  wins: number;
  losses: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  stats: TeamStats;
  totalScore: number;
  headToHead: HeadToHeadRecord[];
}
