import { Team, Player, Role } from './types';
import { RawMatchRecord } from './matchData';

// 한글 챔피언 이름을 영문 ID로 변환 (이미지 API용)
const CHAMPION_MAP: Record<string, string> = {
  '가렌': 'Garen',
  '갈리오': 'Galio',
  '갱플랭크': 'Gangplank',
  '그라가스': 'Gragas',
  '그레이브즈': 'Graves',
  '나르': 'Gnar',
  '나미': 'Nami',
  '나수스': 'Nasus',
  '노틸러스': 'Nautilus',
  '녹턴': 'Nocturne',
  '누누와 윌럼프': 'Nunu',
  '니달리': 'Nidalee',
  '니코': 'Neeko',
  '닐라': 'Nilah',
  '다리우스': 'Darius',
  '다이애나': 'Diana',
  '드레이븐': 'Draven',
  '라이즈': 'Ryze',
  '라칸': 'Rakan',
  '람머스': 'Ramus',
  '럭스': 'Lux',
  '럼블': 'Rumble',
  '레나타 글라스크': 'Renata',
  '레넥톤': 'Renekton',
  '레오나': 'Leona',
  '렉사이': 'RekSai',
  '렐': 'Rell',
  '렝가': 'Rengar',
  '루시안': 'Lucian',
  '룰루': 'Lulu',
  '르블랑': 'Leblanc',
  '리 신': 'LeeSin',
  '리븐': 'Riven',
  '리산드라': 'Lissandra',
  '릴리아': 'Lillia',
  '마스터 이': 'MasterYi',
  '마오카이': 'Maokai',
  '말자하': 'Malzahar',
  '말파이트': 'Malphite',
  '모데카이저': 'Mordekaiser',
  '모르가나': 'Morgana',
  '문도 박사': 'DrMundo',
  '미스 포츈': 'MissFortune',
  '밀리오': 'Milio',
  '바드': 'Bard',
  '바루스': 'Varus',
  '바이': 'Vi',
  '베이가': 'Veigar',
  '베인': 'Vayne',
  '벨베스': 'Belveth',
  '벨코즈': 'Velkoz',
  '볼리베어': 'Volibear',
  '브라이어': 'Briar',
  '브랜드': 'Brand',
  '브라움': 'Braum',
  '블라디미르': 'Vladimir',
  '블리츠크랭크': 'Blitzcrank',
  '비에고': 'Viego',
  '빅토르': 'Viktor',
  '뽀삐': 'Poppy',
  '사미라': 'Samira',
  '사이온': 'Sion',
  '사일러스': 'Sylas',
  '샤코': 'Shaco',
  '세나': 'Senna',
  '세라핀': 'Seraphine',
  '세주아니': 'Sejuani',
  '세트': 'Sett',
  '소나': 'Sona',
  '소라카': 'Soraka',
  '쉔': 'Shen',
  '쉬바나': 'Shivana',
  '스웨인': 'Swain',
  '스카너': 'Skarner',
  '스몰더': 'Smolder',
  '시비르': 'Sivir',
  '신 짜오': 'XinZhao',
  '신드라': 'Syndra',
  '싱드': 'Singed',
  '아리': 'Ahri',
  '아무무': 'Amumu',
  '아우렐리온 솔': 'AurelionSol',
  '아이번': 'Ivern',
  '아지르': 'Azir',
  '아칼리': 'Akali',
  '아크샨': 'Akshan',
  '아트록스': 'Aatrox',
  '아펠리오스': 'Aphelios',
  '알리스타': 'Alistar',
  '암베사': 'Ambessa',
  '애니': 'Annie',
  '애니비아': 'Anivia',
  '애쉬': 'Ashe',
  '야스오': 'Yasuo',
  '에코': 'Ekko',
  '엘리스': 'Elise',
  '오공': 'MonkeyKing',
  '오로라': 'Aurora',
  '오리아나': 'Orianna',
  '오른': 'Ornn',
  '올라프': 'Olaf',
  '요네': 'Yone',
  '요릭': 'Yorick',
  '우디르': 'Udir',
  '우르곳': 'Urgot',
  '워윅': 'Warwick',
  '유미': 'Yuumi',
  '이블린': 'Evelynn',
  '이즈리얼': 'Ezreal',
  '일라오이': 'Illaoi',
  '자르반 4세': 'JarvanIV',
  '자야': 'Xayah',
  '자이라': 'Zyra',
  '자크': 'Zac',
  '잔나': 'Janna',
  '잭스': 'Jax',
  '제드': 'Zed',
  '제라스': 'Xerath',
  '제리': 'Zeri',
  '제이스': 'Jayce',
  '조이': 'Zoe',
  '직스': 'Ziggs',
  '진': 'Jhin',
  '질리언': 'Zilean',
  '징크스': 'Jinx',
  '초가스': 'ChoGath',
  '카르마': 'Karma',
  '카밀': 'Camille',
  '카사딘': 'Kassadin',
  '카서스': 'Karthus',
  '카시오페아': 'Cassiopeia',
  '카이사': 'Kaisa',
  '카타리나': 'Katarina',
  '칼리스타': 'Kalista',
  '케넨': 'Kennen',
  '케이틀린': 'Caitlyn',
  '케일': 'Kayle',
  '케인': 'Kayn',
  '코그모': 'KogMaw',
  '코르키': 'Corki',
  '퀸': 'Quinn',
  '크산테': 'KSante',
  '클레드': 'Kled',
  '키아나': 'Qiyana',
  '킨드레드': 'Kindred',
  '타릭': 'Taric',
  '탈론': 'Talon',
  '탈리야': 'Taliyah',
  '탐 켄치': 'TahmKench',
  '트런들': 'Trundle',
  '트리스타나': 'Tristana',
  '트린다미어': 'Tryndamere',
  '트위스티드 페이트': 'TwistedFate',
  '트위치': 'Twitch',
  '티모': 'Teemo',
  '파이크': 'Pyke',
  '판테온': 'Pantheon',
  '피들스틱': 'Fiddlesticks',
  '피오라': 'Fiora',
  '피즈': 'Fizz',
  '하이머딩거': 'Heimerdinger',
  '헤카림': 'Hecarim',
  '흐웨이': 'Hwei'
};

export const getChampionId = (name: string) => CHAMPION_MAP[name] || name;

export const rawTeams = [
  { id: 't1', name: '클리드', score: 980 },
  { id: 't2', name: '나는상윤', score: 1000 },
  { id: 't3', name: '스맵', score: 1000 },
  { id: 't4', name: '저라뎃', score: 1000 },
  { id: 't5', name: '준밧드', score: 860 },
  { id: 't6', name: '서도일', score: 1000 },
];

export const playersBase = [
  // TEAM 클리드
  { teamId: 't1', name: '클템', summonerName: '난밸래곰팡이다', role: 'TOP' as Role, tierScore: 100 },
  { teamId: 't1', name: '아뚱', summonerName: '동판지구독점yo', role: 'JGL' as Role, tierScore: 500 },
  { teamId: 't1', name: '서건우', summonerName: '캐 치', role: 'MID' as Role, tierScore: 290 },
  { teamId: 't1', name: '엽둥이', summonerName: '앱떡이', role: 'BOT' as Role, tierScore: 10 },
  { teamId: 't1', name: '뿌리', summonerName: '패껄룩', role: 'SUP' as Role, tierScore: 80 },
  // TEAM 나는상윤
  { teamId: 't2', name: '꿀탱탱', summonerName: '04 rivenking', role: 'TOP' as Role, tierScore: 200 },
  { teamId: 't2', name: '구스범스', summonerName: '미움받을용기', role: 'JGL' as Role, tierScore: 0 },
  { teamId: 't2', name: '민찬기', summonerName: '잘생기면이레도됨', role: 'MID' as Role, tierScore: 170 },
  { teamId: 't2', name: '깐숙', summonerName: '깐숙', role: 'BOT' as Role, tierScore: 470 },
  { teamId: 't2', name: '김유나', summonerName: '서로 죽여라', role: 'SUP' as Role, tierScore: 160 },
  // TEAM 스맵
  { teamId: 't3', name: '박사장', summonerName: '샤프박', role: 'TOP' as Role, tierScore: 0 },
  { teamId: 't3', name: '호진LEE', summonerName: '플진남', role: 'JGL' as Role, tierScore: 150 },
  { teamId: 't3', name: '쪼이', summonerName: '포 이', role: 'MID' as Role, tierScore: 320 },
  { teamId: 't3', name: '감블러', summonerName: '붕어에몽', role: 'BOT' as Role, tierScore: 390 },
  { teamId: 't3', name: '히엉', summonerName: '히 영', role: 'SUP' as Role, tierScore: 140 },
  // TEAM 저라뎃
  { teamId: 't4', name: '마두', summonerName: '마두', role: 'TOP' as Role, tierScore: 100 },
  { teamId: 't4', name: '옥맨', summonerName: '옥맨', role: 'JGL' as Role, tierScore: 210 },
  { teamId: 't4', name: '김민교', summonerName: '김민교', role: 'MID' as Role, tierScore: 500 },
  { teamId: 't4', name: '이경민', summonerName: '이경민', role: 'BOT' as Role, tierScore: 140 },
  { teamId: 't4', name: '한아밍', summonerName: '한아밍', role: 'SUP' as Role, tierScore: 0 },
  // TEAM 준밧드
  { teamId: 't5', name: '한포비', summonerName: '포 비', role: 'TOP' as Role, tierScore: 10 },
  { teamId: 't5', name: '이상호', summonerName: '이상호93', role: 'JGL' as Role, tierScore: 530 },
  { teamId: 't5', name: '야옹민지', summonerName: '명명민지', role: 'MID' as Role, tierScore: 0 },
  { teamId: 't5', name: '한남맛종욱', summonerName: '한남맛종욱', role: 'BOT' as Role, tierScore: 0 },
  { teamId: 't5', name: '안녕수야', summonerName: '청사과', role: 'SUP' as Role, tierScore: 330 },
  // TEAM 서도일
  { teamId: 't6', name: '눈길', summonerName: '눈길', role: 'TOP' as Role, tierScore: 440 },
  { teamId: 't6', name: '라파엘', summonerName: '라파엘', role: 'JGL' as Role, tierScore: 10 },
  { teamId: 't6', name: '김진솔', summonerName: '김 진솔', role: 'MID' as Role, tierScore: 40 },
  { teamId: 't6', name: '종탁이', summonerName: '종탁이93', role: 'BOT' as Role, tierScore: 400 },
  { teamId: 't6', name: '희진이라구', summonerName: 'HEEMORING', role: 'SUP' as Role, tierScore: 110 },
];

export function calculateStats(matchRecords: RawMatchRecord[]): Team[] {
  // 플레이어 통계 맵 생성
  const playerStatsMap = matchRecords.reduce((acc, match) => {
    const { playerName, isWin, kills, deaths, assists, damage, gold, cs, duration, championId, championName } = match;
    
    if (!acc[playerName]) {
      acc[playerName] = {
        games: 0, wins: 0, losses: 0, kills: 0, deaths: 0, assists: 0, 
        damage: 0, gold: 0, cs: 0, totalDuration: 0, champions: {}
      };
    }

    const p = acc[playerName];
    p.games += 1;
    if (isWin) p.wins += 1; else p.losses += 1;
    p.kills += kills;
    p.deaths += deaths;
    p.assists += assists;
    p.damage += damage;
    p.gold += gold;
    p.cs += cs;
    p.totalDuration += duration;
    
    const champId = getChampionId(championName);
    if (!p.champions[champId]) {
      p.champions[champId] = { id: champId, name: championName, games: 0, wins: 0, losses: 0 };
    }
    p.champions[champId].games += 1;
    if (isWin) p.champions[champId].wins += 1;
    else p.champions[champId].losses += 1;

    return acc;
  }, {} as Record<string, any>);

  return rawTeams.map(team => {
    const teamRecords = matchRecords.filter(m => m.teamName === `TEAM ${team.name}`);
    const gameIds = Array.from(new Set(teamRecords.map(r => `${r.matchId}#${r.gameNum}`)));
    
    let teamWins = 0;
    let teamLosses = 0;
    let teamKills = 0;
    let teamDeaths = 0;
    let teamAssists = 0;
    
    gameIds.forEach(gameId => {
      const [matchId, gameNumStr] = gameId.split('#');
      const gameNum = parseInt(gameNumStr);
      const gameRecords = teamRecords.filter(r => r.matchId === matchId && r.gameNum === gameNum);
      if (gameRecords.length > 0 && gameRecords[0].isWin) teamWins++;
      else if (gameRecords.length > 0) teamLosses++;
      
      gameRecords.forEach(r => {
        teamKills += r.kills;
        teamDeaths += r.deaths;
        teamAssists += r.assists;
      });
    });

    return {
      id: team.id,
      name: `TEAM ${team.name}`,
      totalScore: team.score,
      stats: {
        games: teamWins + teamLosses,
        wins: teamWins,
        losses: teamLosses,
        kills: teamKills,
        deaths: teamDeaths,
        assists: teamAssists,
        towers: 0,
        dragons: 0,
        barons: 0
      },
      players: playersBase.filter(p => p.teamId === team.id).map((pBase, idx) => {
        const stats = playerStatsMap[pBase.name] || {
          games: 0, wins: 0, losses: 0, kills: 0, deaths: 0, assists: 0,
          damage: 0, gold: 0, cs: 0, totalDuration: 0, champions: {}
        };
        
        const totalMin = stats.totalDuration / 60;
        
        // 팀 전체 데미지 계산 (비중 산출용)
        const teamPlayers = playersBase.filter(pb => pb.teamId === team.id);
        const teamTotalDamage = teamPlayers.reduce((sum, tp) => {
          const pStats = playerStatsMap[tp.name];
          return sum + (pStats ? pStats.damage : 0);
        }, 0);

        const damagePercent = teamTotalDamage > 0 
          ? parseFloat(((stats.damage / teamTotalDamage) * 100).toFixed(1)) 
          : 0;

        const topChamps = Object.entries(stats.champions)
          .sort((a: any, b: any) => b[1].games - a[1].games)
          .slice(0, 5)
          .map(([id, info]: [string, any]) => ({
            id,
            name: info.name,
            wins: info.wins,
            losses: info.losses
          }));

        return {
          id: `${team.id}-p${idx}`,
          name: pBase.name,
          summonerName: pBase.summonerName,
          role: pBase.role,
          teamId: team.id,
          tierScore: pBase.tierScore,
          stats: {
            games: stats.games,
            wins: stats.wins,
            losses: stats.losses,
            kills: stats.kills,
            deaths: stats.deaths,
            assists: stats.assists,
            damage: stats.damage,
            vision: 0,
            cs: stats.cs,
            dpm: totalMin > 0 ? Math.round(stats.damage / totalMin) : 0,
            gpm: totalMin > 0 ? Math.round(stats.gold / totalMin) : 0,
            csm: totalMin > 0 ? parseFloat((stats.cs / totalMin).toFixed(1)) : 0,
            dpg: stats.gold > 0 ? parseFloat((stats.damage / stats.gold).toFixed(2)) : 0,
            winRate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0,
            damagePercent: damagePercent,
            mostPlayed: topChamps
          }
        } as Player;
      }),
      headToHead: rawTeams.filter(t => t.id !== team.id).map(opponent => {
        const h2hMatches = matchRecords.filter(m => 
          m.teamName === `TEAM ${team.name}` && 
          matchRecords.some(om => om.teamName === `TEAM ${opponent.name}` && om.matchId === m.matchId && om.gameNum === m.gameNum)
        );
        
        const h2hGameIds = Array.from(new Set(h2hMatches.map(r => `${r.matchId}#${r.gameNum}`)));
        let wins = 0;
        let losses = 0;
        
        h2hGameIds.forEach(gameId => {
          const [matchId, gameNumStr] = gameId.split('#');
          const gameNum = parseInt(gameNumStr);
          const sample = h2hMatches.find(r => r.matchId === matchId && r.gameNum === gameNum);
          if (sample?.isWin) wins++;
          else if (sample) losses++;
        });

        return {
          opponentId: opponent.id,
          opponentName: `TEAM ${opponent.name}`,
          wins,
          losses
        };
      })
    };
  });
}
