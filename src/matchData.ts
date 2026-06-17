export interface RawMatchRecord {
  matchId: string;
  gameNum: number;
  duration: number;
  teamName: string;
  isWin: boolean;
  position: string;
  playerName: string;
  championName: string;
  championId: string;
  cs: number;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  gold: number;
}

const rosters = {
  'TEAM 클리드': [
    { name: '꿀템', pos: 'TOP' },
    { name: '아뚱', pos: 'JGL' },
    { name: '서건우', pos: 'MID' },
    { name: '엽둥이', pos: 'BOT' },
    { name: '뿌리', pos: 'SUP' }
  ],
  'TEAM 나는상윤': [
    { name: '꿀탱탱', pos: 'TOP' },
    { name: '구스범스', pos: 'JGL' },
    { name: '민찬기', pos: 'MID' },
    { name: '깐숙', pos: 'BOT' },
    { name: '김유나', pos: 'SUP' }
  ],
  'TEAM 스맵': [
    { name: '박사장', pos: 'TOP' },
    { name: '호진LEE', pos: 'JGL' },
    { name: '쪼이', pos: 'MID' },
    { name: '감블러', pos: 'BOT' },
    { name: '히엉', pos: 'SUP' }
  ],
  'TEAM 저라뎃': [
    { name: '마두', pos: 'TOP' },
    { name: '옥맨', pos: 'JGL' },
    { name: '김민교', pos: 'MID' },
    { name: '이경민', pos: 'BOT' },
    { name: '한아밍', pos: 'SUP' }
  ],
  'TEAM 준밧드': [
    { name: '한포비', pos: 'TOP' },
    { name: '이상호', pos: 'JGL' },
    { name: '야옹민지', pos: 'MID' },
    { name: '한남맛종욱', pos: 'BOT' },
    { name: '안녕수야', pos: 'SUP' }
  ],
  'TEAM 서도일': [
    { name: '눈길', pos: 'TOP' },
    { name: '라파엘ㅋ', pos: 'JGL' },
    { name: '김진솔', pos: 'MID' },
    { name: '종탁이', pos: 'BOT' },
    { name: '희진이라구', pos: 'SUP' }
  ]
};

// Helper to generate game data
function generateGame(matchId: string, gameNum: number, team1: keyof typeof rosters, team2: keyof typeof rosters, t1Win: boolean, duration: number = 1800): RawMatchRecord[] {
  const records: RawMatchRecord[] = [];
  
  // Team 1
  rosters[team1].forEach(p => {
    records.push({
      matchId, gameNum, duration, teamName: team1, isWin: t1Win,
      position: p.pos, playerName: p.name,
      championName: 'Champion', championId: 'Aali', // Simplified for large data
      cs: t1Win ? 240 : 180, kills: t1Win ? 5 : 2, deaths: t1Win ? 2 : 5, assists: t1Win ? 8 : 4,
      damage: t1Win ? 25000 : 15000, gold: t1Win ? 13000 : 9000
    });
  });

  // Team 2
  rosters[team2].forEach(p => {
    records.push({
      matchId, gameNum, duration, teamName: team2, isWin: !t1Win,
      position: p.pos, playerName: p.name,
      championName: 'Champion', championId: 'Aali',
      cs: !t1Win ? 240 : 180, kills: !t1Win ? 5 : 2, deaths: !t1Win ? 2 : 5, assists: !t1Win ? 8 : 4,
      damage: !t1Win ? 25000 : 15000, gold: !t1Win ? 13000 : 9000
    });
  });

  return records;
}

export const rawMatchRecords: RawMatchRecord[] = [
  ...generateGame('M1-1', 1, 'TEAM 저라뎃', 'TEAM 나는상윤', true),
  ...generateGame('M1-1', 2, 'TEAM 저라뎃', 'TEAM 나는상윤', true),
  ...generateGame('M1-2', 1, 'TEAM 스맵', 'TEAM 준밧드', true),
  ...generateGame('M1-2', 2, 'TEAM 스맵', 'TEAM 준밧드', false),
  ...generateGame('M1-3', 1, 'TEAM 클리드', 'TEAM 서도일', true),
  ...generateGame('M1-3', 2, 'TEAM 클리드', 'TEAM 서도일', true),
  ...generateGame('M1-4', 1, 'TEAM 저라뎃', 'TEAM 클리드', true),
  ...generateGame('M1-4', 2, 'TEAM 저라뎃', 'TEAM 클리드', false),
  ...generateGame('M1-5', 1, 'TEAM 준밧드', 'TEAM 나는상윤', true),
  ...generateGame('M1-5', 2, 'TEAM 준밧드', 'TEAM 나는상윤', true),
  ...generateGame('M1-6', 1, 'TEAM 스맵', 'TEAM 서도일', true),
  ...generateGame('M1-6', 2, 'TEAM 스맵', 'TEAM 서도일', false),
  ...generateGame('M1-7', 1, 'TEAM 저라뎃', 'TEAM 서도일', true),
  ...generateGame('M1-7', 2, 'TEAM 저라뎃', 'TEAM 서도일', true),
  ...generateGame('M1-8', 1, 'TEAM 클리드', 'TEAM 스맵', true),
  ...generateGame('M1-8', 2, 'TEAM 클리드', 'TEAM 스맵', false),

  ...generateGame('M2-1', 1, 'TEAM 저라뎃', 'TEAM 스맵', true),
  ...generateGame('M2-1', 2, 'TEAM 저라뎃', 'TEAM 스맵', true),
  ...generateGame('M2-2', 1, 'TEAM 나는상윤', 'TEAM 서도일', true),
  ...generateGame('M2-2', 2, 'TEAM 나는상윤', 'TEAM 서도일', false),
  ...generateGame('M2-3', 1, 'TEAM 준밧드', 'TEAM 클리드', true),
  ...generateGame('M2-3', 2, 'TEAM 준밧드', 'TEAM 클리드', true),
  ...generateGame('M2-4', 1, 'TEAM 클리드', 'TEAM 나는상윤', true),
  ...generateGame('M2-4', 2, 'TEAM 클리드', 'TEAM 나는상윤', false),
  ...generateGame('M2-5', 1, 'TEAM 저라뎃', 'TEAM 준밧드', true),
  ...generateGame('M2-5', 2, 'TEAM 저라뎃', 'TEAM 준밧드', true),
  ...generateGame('M2-6', 1, 'TEAM 스맵', 'TEAM 나는상윤', true),
  ...generateGame('M2-6', 2, 'TEAM 스맵', 'TEAM 나는상윤', true),
  ...generateGame('M2-7', 1, 'TEAM 준밧드', 'TEAM 서도일', true),
  ...generateGame('M2-7', 2, 'TEAM 준밧드', 'TEAM 서도일', false),
  ...generateGame('M2-8', 1, 'TEAM 나는상윤', 'TEAM 저라뎃', false),
  ...generateGame('M2-8', 2, 'TEAM 나는상윤', 'TEAM 저라뎃', true),
  ...generateGame('M2-9', 1, 'TEAM 준밧드', 'TEAM 스맵', true),
  ...generateGame('M2-9', 2, 'TEAM 준밧드', 'TEAM 스맵', false),
  ...generateGame('M2-9', 3, 'TEAM 준밧드', 'TEAM 스맵', true),
];
