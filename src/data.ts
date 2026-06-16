import { Team, Player, HeadToHeadRecord } from './types';

const rawTeams = [
  { id: 't1', name: 'TEAM 클리드', score: 980 },
  { id: 't2', name: 'TEAM 나는상윤', score: 1000 },
  { id: 't3', name: 'TEAM 스맵', score: 1000 },
  { id: 't4', name: 'TEAM 저라뎃', score: 1000 },
  { id: 't5', name: 'TEAM 준밧드', score: 860 },
  { id: 't6', name: 'TEAM 서도일', score: 1000 },
];

const playersBase = [
  // TEAM 클리드
  { teamId: 't1', name: '꿀템은죽었다', summonerName: '난밸래곰팡이다', role: 'TOP', tierScore: 100 },
  { teamId: 't1', name: '아뚱', summonerName: '동판지구독점yo', role: 'JGL', tierScore: 500 },
  { teamId: 't1', name: '서건우', summonerName: '캐 치', role: 'MID', tierScore: 290 },
  { teamId: 't1', name: '엽둥이', summonerName: '앱떡이', role: 'BOT', tierScore: 10 },
  { teamId: 't1', name: '뿌리', summonerName: '패껄룩', role: 'SUP', tierScore: 80 },
  // TEAM 나는상윤
  { teamId: 't2', name: '꿀탱탱', summonerName: '04 rivenking', role: 'TOP', tierScore: 200 },
  { teamId: 't2', name: '구스범스', summonerName: '미움받을용기', role: 'JGL', tierScore: 0 },
  { teamId: 't2', name: '민찬기', summonerName: '잘생기면이레도됨', role: 'MID', tierScore: 170 },
  { teamId: 't2', name: '깐숙', summonerName: '깐숙', role: 'BOT', tierScore: 470 },
  { teamId: 't2', name: '김유나', summonerName: '서로 죽여라', role: 'SUP', tierScore: 160 },
  // TEAM 스맵
  { teamId: 't3', name: '(주)박사장$', summonerName: '샤프박', role: 'TOP', tierScore: 0 },
  { teamId: 't3', name: '호진LEE', summonerName: '플진남', role: 'JGL', tierScore: 150 },
  { teamId: 't3', name: '쪼이.', summonerName: '포 이', role: 'MID', tierScore: 320 },
  { teamId: 't3', name: '감블러', summonerName: '붕어에몽', role: 'BOT', tierScore: 390 },
  { teamId: 't3', name: '히엉^^7', summonerName: '히 영', role: 'SUP', tierScore: 140 },
  // TEAM 저라뎃
  { teamId: 't4', name: '마두', summonerName: '마두', role: 'TOP', tierScore: 100 },
  { teamId: 't4', name: '옥맨', summonerName: '옥맨', role: 'JGL', tierScore: 210 },
  { teamId: 't4', name: '김민교.', summonerName: '김민교', role: 'MID', tierScore: 500 },
  { teamId: 't4', name: '이경민+_+', summonerName: '이경민', role: 'BOT', tierScore: 140 },
  { teamId: 't4', name: '한아밍', summonerName: '한아밍', role: 'SUP', tierScore: 0 }, // It was 50 points, wait, let me check the image. "한아밍 0 Point". Ok.
  // TEAM 준밧드
  { teamId: 't5', name: '한포비', summonerName: '포 비', role: 'TOP', tierScore: 10 },
  { teamId: 't5', name: '이상호', summonerName: '이상호93', role: 'JGL', tierScore: 530 },
  { teamId: 't5', name: '야옹민지', summonerName: '명명민지', role: 'MID', tierScore: 0 },
  { teamId: 't5', name: '한남맛종욱', summonerName: '한남맛종욱', role: 'BOT', tierScore: 0 },
  { teamId: 't5', name: '안녕수야', summonerName: '청사과', role: 'SUP', tierScore: 330 },
  // TEAM 서도일
  { teamId: 't6', name: '눈길.', summonerName: '눈길', role: 'TOP', tierScore: 440 },
  { teamId: 't6', name: '라파엘ㅋ', summonerName: '라파엘ㅋ', role: 'JGL', tierScore: 10 },
  { teamId: 't6', name: '김진솔', summonerName: '김 진솔', role: 'MID', tierScore: 40 },
  { teamId: 't6', name: '종탁이', summonerName: '종탁이93', role: 'BOT', tierScore: 400 },
  { teamId: 't6', name: '희진이라구', summonerName: 'HEEMORING', role: 'SUP', tierScore: 110 },
];

const emptyPlayerStats = {
  games: 0, wins: 0, losses: 0, kills: 0, deaths: 0, assists: 0,
  damage: 0, vision: 0, cs: 0, dpm: 0, gpm: 0, csm: 0, dpg: 0, damagePercent: 0,
  mostPlayed: []
};

const emptyTeamStats = {
  games: 0, wins: 0, losses: 0, kills: 0, deaths: 0, assists: 0,
  towers: 0, dragons: 0, barons: 0
};

// Data from Scrims
// M1-1: 저라뎃 1:1 나는상윤 (62.03 min)
// M1-4: 저라뎃 1:1 클리드 (48.48 min)
// M1-7: 저라뎃 1:1 서도일 (60.00 min)

const duration_total_t4 = 170.51;
const duration_m1_1 = 62.03;
const duration_m1_4 = 48.48;
const duration_m1_7 = 60.00;

const scrim_data = {
  저라뎃: {
    games: 6, wins: 3, losses: 3,
    kills: 121, deaths: 117, assists: 258,
    players: {
      마두: { k: 17, d: 16, a: 66, dmg: 128152, gold: 64282, cs: 1314, champs: [{name: '암베사', id: 'Ambessa', wins: 1, losses: 1}, {name: '초가스', id: 'Chogath', wins: 1, losses: 0}, {name: '사이온', id: 'Sion', wins: 1, losses: 0}, {name: '아트록스', id: 'Aatrox', wins: 0, losses: 2}] },
      옥맨: { k: 27, d: 25, a: 46, dmg: 102672, gold: 62000, cs: 1171, champs: [{name: '바이', id: 'Vi', wins: 1, losses: 1}, {name: '케인', id: 'Kayn', wins: 2, losses: 0}, {name: '자르반 4세', id: 'JarvanIV', wins: 0, losses: 1}, {name: '신 짜오', id: 'XinZhao', wins: 0, losses: 1}] },
      김민교: { k: 36, d: 22, a: 35, dmg: 137910, gold: 72000, cs: 1430, champs: [{name: '사일러스', id: 'Sylas', wins: 1, losses: 1}, {name: '요네', id: 'Yone', wins: 1, losses: 1}, {name: '라이즈', id: 'Ryze', wins: 1, losses: 0}, {name: '카시오페아', id: 'Cassiopeia', wins: 0, losses: 1}] },
      이경민: { k: 30, d: 31, a: 47, dmg: 137793, gold: 75000, cs: 1404, champs: [{name: '세나', id: 'Senna', wins: 1, losses: 1}, {name: '시비르', id: 'Sivir', wins: 0, losses: 1}, {name: '애쉬', id: 'Ashe', wins: 1, losses: 0}, {name: '카이사', id: 'Kaisa', wins: 1, losses: 0}, {name: '잭스', id: 'Jax', wins: 0, losses: 1}] },
      한아밍: { k: 11, d: 23, a: 83, dmg: 49471, gold: 48000, cs: 201, champs: [{name: '브라움', id: 'Braum', wins: 1, losses: 1}, {name: '세라핀', id: 'Seraphine', wins: 1, losses: 0}, {name: '밀리오', id: 'Milio', wins: 0, losses: 1}, {name: '룰루', id: 'Lulu', wins: 1, losses: 0}, {name: '노틸러스', id: 'Nautilus', wins: 0, losses: 1}] },
    }
  },
  나는상윤: {
    games: 4, wins: 2, losses: 2,
    kills: 74, deaths: 66, assists: 145,
    players: {
      '04 rivenking': { k: 16, d: 14, a: 12, dmg: 96498, gold: 63520, cs: 971, champs: [{name: '베인', id: 'Vayne', wins: 1, losses: 0}, {name: '라이즈', id: 'Ryze', wins: 0, losses: 1}, {name: '잭스', id: 'Jax', wins: 1, losses: 0}] },
      '미움받을용기': { k: 16, d: 10, a: 33, dmg: 43987, gold: 43000, cs: 870, champs: [{name: '리 신', id: 'LeeSin', wins: 1, losses: 0}, {name: '녹턴', id: 'Nocturne', wins: 0, losses: 1}, {name: '세주아니', id: 'Sejuani', wins: 1, losses: 0}] },
      '잘생기면이레도됨': { k: 9, d: 13, a: 26, dmg: 68087, gold: 54300, cs: 1111, champs: [{name: '오로라', id: 'Aurora', wins: 0, losses: 1}, {name: '갈리오', id: 'Galio', wins: 1, losses: 0}, {name: '요네', id: 'Yone', wins: 1, losses: 0}] },
      '깐숙': { k: 24, d: 16, a: 25, dmg: 122194, gold: 76000, cs: 1204, champs: [{name: '자야', id: 'Xayah', wins: 0, losses: 1}, {name: '애쉬', id: 'Ashe', wins: 1, losses: 0}, {name: '케이틀린', id: 'Caitlyn', wins: 1, losses: 0}] },
      '서로 죽여라': { k: 5, d: 13, a: 49, dmg: 18120, gold: 35000, cs: 116, champs: [{name: '노틸러스', id: 'Nautilus', wins: 0, losses: 1}, {name: '밀리오', id: 'Milio', wins: 2, losses: 0}] },
    }
  },
  클리드: {
    games: 6, wins: 4, losses: 2,
    kills: 103, deaths: 83, assists: 139,
    players: {
      '난밸래곰팡이다': { k: 16, d: 15, a: 26, dmg: 82899, gold: 64288, cs: 1200, champs: [{name: '사이온', id: 'Sion', wins: 1, losses: 1}, {name: '요릭', id: 'Yorick', wins: 1, losses: 0}, {name: '스웨인', id: 'Swain', wins: 1, losses: 0}, {name: '일라오이', id: 'Illaoi', wins: 1, losses: 0}] },
      '동판지구독점yo': { k: 25, d: 15, a: 51, dmg: 68132, gold: 72000, cs: 1065, champs: [{name: '리 신', id: 'LeeSin', wins: 0, losses: 1}, {name: '트런들', id: 'Trundle', wins: 1, losses: 0}, {name: '자르반 4세', id: 'JarvanIV', wins: 1, losses: 0}, {name: '신 짜오', id: 'XinZhao', wins: 2, losses: 0}] },
      '캐 치': { k: 19, d: 16, a: 34, dmg: 95471, gold: 68628, cs: 1233, champs: [{name: '아칼리', id: 'Akali', wins: 0, losses: 1}, {name: '라이즈', id: 'Ryze', wins: 1, losses: 0}, {name: '카시오페아', id: 'Cassiopeia', wins: 1, losses: 0}, {name: '다이애나', id: 'Diana', wins: 1, losses: 0}] },
      '앱떡이': { k: 31, d: 23, a: 31, dmg: 114512, gold: 75000, cs: 1271, champs: [{name: '이즈리얼', id: 'Ezreal', wins: 0, losses: 1}, {name: '잭스', id: 'Jax', wins: 1, losses: 0}, {name: '애쉬', id: 'Ashe', wins: 1, losses: 0}, {name: '징크스', id: 'Jinx', wins: 1, losses: 0}] },
      '패껄룩': { k: 12, d: 14, a: 47, dmg: 40049, gold: 44251, cs: 149, champs: [{name: '세라핀', id: 'Seraphine', wins: 0, losses: 1}, {name: '카밀', id: 'Camille', wins: 1, losses: 0}, {name: '브라움', id: 'Braum', wins: 1, losses: 1}, {name: '룰루', id: 'Lulu', wins: 1, losses: 0}] },
    }
  },
  서도일: {
    games: 6, wins: 1, losses: 5,
    kills: 75, deaths: 104, assists: 139,
    players: {
      '눈길': { k: 9, d: 27, a: 28, dmg: 116555, gold: 65000, cs: 1197, champs: [{name: '트런들', id: 'Trundle', wins: 0, losses: 1}, {name: '자크', id: 'Zac', wins: 1, losses: 0}, {name: '일라오이', id: 'Illaoi', wins: 0, losses: 2}, {name: '요릭', id: 'Yorick', wins: 0, losses: 1}, {name: '요네', id: 'Yone', wins: 0, losses: 1}] },
      '라파엘ㅋ': { k: 27, d: 33, a: 24, dmg: 86357, gold: 72000, cs: 953, champs: [{name: '판테온', id: 'Pantheon', wins: 0, losses: 2}, {name: '오공', id: 'MonkeyKing', wins: 1, losses: 0}, {name: '스카너', id: 'Skarner', wins: 0, losses: 1}, {name: '나피리', id: 'Naafiri', wins: 0, losses: 1}, {name: '신 짜오', id: 'XinZhao', wins: 0, losses: 1}] },
      '김 진솔': { k: 14, d: 24, a: 30, dmg: 100200, gold: 71000, cs: 1226, champs: [{name: '라이즈', id: 'Ryze', wins: 0, losses: 2}, {name: '빅토르', id: 'Viktor', wins: 1, losses: 1}, {name: '사일러스', id: 'Sylas', wins: 0, losses: 1}, {name: '신드라', id: 'Syndra', wins: 0, losses: 1}, {name: '흐웨이', id: 'Hwei', wins: 0, losses: 1}] },
      '종탁이93': { k: 31, d: 22, a: 29, dmg: 135452, gold: 98000, cs: 1264, champs: [{name: '바루스', id: 'Varus', wins: 0, losses: 2}, {name: '칼리스타', id: 'Kalista', wins: 1, losses: 0}, {name: '진', id: 'Jhin', wins: 0, losses: 1}, {name: '세나', id: 'Senna', wins: 0, losses: 1}, {name: '애쉬', id: 'Ashe', wins: 0, losses: 1}] },
      'HEEMORING': { k: 8, d: 28, a: 50, dmg: 33765, gold: 48000, cs: 153, champs: [{name: '블리츠크랭크', id: 'Blitzcrank', wins: 0, losses: 2}, {name: '알리스타', id: 'Alistar', wins: 1, losses: 0}, {name: '노틸러스', id: 'Nautilus', wins: 0, losses: 2}, {name: '세라핀', id: 'Seraphine', wins: 0, losses: 1}] },
    }
  },
  스맵: {
    games: 6, wins: 4, losses: 2,
    kills: 121, deaths: 109, assists: 237,
    players: {
      '샤프박': { k: 18, d: 21, a: 23, dmg: 135823, gold: 75000, cs: 1308, champs: [{name: '럼블', id: 'Rumble', wins: 1, losses: 1}, {name: '그웬', id: 'Gwen', wins: 0, losses: 1}, {name: '레넥톤', id: 'Renekton', wins: 1, losses: 0}, {name: '나르', id: 'Gnar', wins: 2, losses: 0}] },
      '플진남': { k: 38, d: 16, a: 57, dmg: 89311, gold: 68000, cs: 1124, champs: [{name: '리 신', id: 'LeeSin', wins: 2, losses: 0}, {name: '자르반 4세', id: 'JarvanIV', wins: 0, losses: 2}, {name: '스카너', id: 'Skarner', wins: 1, losses: 0}, {name: '마오카이', id: 'Maokai', wins: 1, losses: 0}] },
      '포 이': { k: 31, d: 15, a: 37, dmg: 103890, gold: 72000, cs: 1461, champs: [{name: '카시오페아', id: 'Cassiopeia', wins: 2, losses: 0}, {name: '라이즈', id: 'Ryze', wins: 0, losses: 2}, {name: '신드라', id: 'Syndra', wins: 1, losses: 0}, {name: '요네', id: 'Yone', wins: 1, losses: 0}] },
      '붕어에몽': { k: 34, d: 23, a: 50, dmg: 154192, gold: 86000, cs: 1359, champs: [{name: '케이틀린', id: 'Caitlyn', wins: 1, losses: 0}, {name: '바루스', id: 'Varus', wins: 0, losses: 1}, {name: '이즈리얼', id: 'Ezreal', wins: 2, losses: 0}, {name: '루시안', id: 'Lucian', wins: 1, losses: 0}, {name: '진', id: 'Jhin', wins: 0, losses: 1}] },
      '히 영': { k: 8, d: 15, a: 70, dmg: 53511, gold: 52000, cs: 232, champs: [{name: '바드', id: 'Bard', wins: 1, losses: 0}, {name: '노틸러스', id: 'Nautilus', wins: 0, losses: 1}, {name: '카르마', id: 'Karma', wins: 1, losses: 1}, {name: '밀리오', id: 'Milio', wins: 1, losses: 0}, {name: '니코', id: 'Neeko', wins: 1, losses: 0}] },
    }
  },
  준밧드: {
    games: 4, wins: 2, losses: 2,
    kills: 62, deaths: 75, assists: 104,
    players: {
      '포 비': { k: 13, d: 12, a: 25, dmg: 93231, gold: 43000, cs: 942, champs: [{name: '갈리오', id: 'Galio', wins: 0, losses: 1}, {name: '사이온', id: 'Sion', wins: 1, losses: 0}, {name: '럼블', id: 'Rumble', wins: 0, losses: 1}, {name: '암베사', id: 'Ambessa', wins: 1, losses: 0}] },
      '이상호93': { k: 30, d: 16, a: 31, dmg: 86221, gold: 51000, cs: 832, champs: [{name: '오공', id: 'MonkeyKing', wins: 0, losses: 1}, {name: '판테온', id: 'Pantheon', wins: 1, losses: 0}, {name: '리 신', id: 'LeeSin', wins: 0, losses: 1}, {name: '트런들', id: 'Trundle', wins: 1, losses: 0}] },
      '명명민지': { k: 10, d: 13, a: 39, dmg: 116179, gold: 62000, cs: 1083, champs: [{name: '흐웨이', id: 'Hwei', wins: 0, losses: 1}, {name: '카르마', id: 'Karma', wins: 1, losses: 0}, {name: '아리', id: 'Ahri', wins: 0, losses: 1}, {name: '조이', id: 'Zoe', wins: 1, losses: 0}] },
      '한남맛종욱': { k: 25, d: 15, a: 42, dmg: 128549, gold: 75000, cs: 1165, champs: [{name: '애쉬', id: 'Ashe', wins: 0, losses: 1}, {name: '이즈리얼', id: 'Ezreal', wins: 1, losses: 0}, {name: '진', id: 'Jhin', wins: 0, losses: 1}, {name: '이즈리얼', id: 'Ezreal', wins: 1, losses: 0}] },
      '청사과': { k: 5, d: 24, a: 61, dmg: 43725, gold: 38000, cs: 159, champs: [{name: '세라핀', id: 'Seraphine', wins: 0, losses: 1}, {name: '브라움', id: 'Braum', wins: 1, losses: 0}, {name: '카르마', id: 'Karma', wins: 0, losses: 1}, {name: '바드', id: 'Bard', wins: 1, losses: 0}] },
    }
  }
};

export const initialTeams: Team[] = rawTeams.map(rt => {
  let tStats = { ...emptyTeamStats };
  let currentDur = 1;
  
  if (rt.name === 'TEAM 저라뎃') {
    tStats = { ...tStats, ...scrim_data.저라뎃 };
    currentDur = duration_total_t4;
  } else if (rt.name === 'TEAM 나는상윤') {
    tStats = { ...tStats, ...scrim_data.나는상윤 };
    currentDur = duration_m1_1 + 73.03; // M1-1 + M1-5
  } else if (rt.name === 'TEAM 클리드') {
    tStats = { ...tStats, ...scrim_data.클리드 };
    currentDur = duration_m1_4 + 46.87 + 58.53; // M1-4 + M1-3 + M1-8
  } else if (rt.name === 'TEAM 서도일') {
    tStats = { ...tStats, ...scrim_data.서도일 };
    currentDur = duration_m1_7 + 46.87 + 46.70; // M1-7 + M1-3 + M1-6
  } else if (rt.name === 'TEAM 스맵') {
    tStats = { ...tStats, ...scrim_data.스맵 };
    currentDur = 63.28 + 46.70 + 58.53; // M1-2 + M1-6 + M1-8
  } else if (rt.name === 'TEAM 준밧드') {
    tStats = { ...tStats, ...scrim_data.준밧드 };
    currentDur = 63.28 + 73.03; // M1-2 + M1-5
  }

  const tPlayers: Player[] = playersBase
    .filter(p => p.teamId === rt.id)
    .map((p, idx) => {
      let pStats = { ...emptyPlayerStats };
      
      const pSummonerName = (p as any).summonerName || p.name;
      const sData = 
          rt.name === 'TEAM 저라뎃' ? (scrim_data.저라뎃.players as any)[pSummonerName]
        : rt.name === 'TEAM 나는상윤' ? (scrim_data.나는상윤.players as any)[pSummonerName]
        : rt.name === 'TEAM 클리드' ? (scrim_data.클리드.players as any)[pSummonerName]
        : rt.name === 'TEAM 서도일' ? (scrim_data.서도일.players as any)[pSummonerName]
        : rt.name === 'TEAM 스맵' ? (scrim_data.스맵.players as any)[pSummonerName]
        : rt.name === 'TEAM 준밧드' ? (scrim_data.준밧드.players as any)[pSummonerName]
        : null;

      if (sData) {
        const teamPlayers = (scrim_data as any)[rt.name.replace('TEAM ', '')].players;
        const teamTotalDmg: number = (Object.values(teamPlayers).reduce((acc: number, curr: any) => acc + (curr.dmg || 0), 0) as number) || 1;
        pStats = {
          games: (tStats as any).games,
          wins: (tStats as any).wins,
          losses: (tStats as any).losses,
          kills: sData.k,
          deaths: sData.d,
          assists: sData.a,
          damage: sData.dmg,
          vision: 0,
          cs: sData.cs || 0,
          dpm: Math.floor(sData.dmg / currentDur),
          gpm: Math.floor((sData.gold || 0) / currentDur),
          csm: Number(((sData.cs || 0) / currentDur).toFixed(2)),
          dpg: Number(((sData.dmg || 0) / (sData.gold || 1)).toFixed(2)),
          damagePercent: Number(((sData.dmg / teamTotalDmg) * 100).toFixed(1)),
          mostPlayed: sData.champs
        };
      }

      return {
        id: `${rt.id}_p${idx}`,
        name: p.name,
        role: p.role as any,
        teamId: rt.id,
        tierScore: p.tierScore,
        stats: pStats,
      };
    });

  const headToHead: HeadToHeadRecord[] = rawTeams
    .filter(o => o.id !== rt.id)
    .map(o => {
      let wins = 0;
      let losses = 0;
      
      const checkResult = (t1: string, t2: string, matchT1: string, matchT2: string, t1Wins: number, t2Wins: number) => {
        if ((t1 === matchT1 && t2 === matchT2) || (t1 === matchT2 && t2 === matchT1)) {
          if (t1 === matchT1) { wins += t1Wins; losses += t2Wins; }
          else { wins += t2Wins; losses += t1Wins; }
        }
      };

      const myName = rt.name.replace('TEAM ', '');
      const oppName = o.name.replace('TEAM ', '');

      checkResult(myName, oppName, '저라뎃', '나는상윤', 1, 1);
      checkResult(myName, oppName, '저라뎃', '클리드', 1, 1);
      checkResult(myName, oppName, '저라뎃', '서도일', 1, 1);
      checkResult(myName, oppName, '준밧드', '스맵', 1, 1);
      checkResult(myName, oppName, '클리드', '서도일', 2, 0);
      checkResult(myName, oppName, '준밧드', '나는상윤', 1, 1);
      checkResult(myName, oppName, '스맵', '서도일', 2, 0);
      checkResult(myName, oppName, '클리드', '스맵', 1, 1);
      
      return {
        opponentId: o.id,
        opponentName: o.name,
        wins,
        losses,
      };
    });

  return {
    id: rt.id,
    name: rt.name,
    totalScore: rt.score,
    stats: tStats,
    players: tPlayers,
    headToHead,
  };
});
