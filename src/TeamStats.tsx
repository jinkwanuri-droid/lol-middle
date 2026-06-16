import { Team, Player, Role } from './types';
import { useState } from 'react';
import { X, Trophy } from 'lucide-react';

interface TeamStatsProps {
  teams: Team[];
}

interface MatchInfo {
  id: string;
  t1: string;
  t2: string;
  result: string;
}

const roleIconFallbacks = {
  TOP: [
    'https://s-lol-web.op.gg/images/icon/icon-position-top.svg',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/position_top.png',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/position-top.png',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/position-top.png'
  ],
  JGL: [
    'https://s-lol-web.op.gg/images/icon/icon-position-jng.svg',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/position_jungle.png',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/position-jungle.png',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/position-jungle.png'
  ],
  MID: [
    'https://s-lol-web.op.gg/images/icon/icon-position-mid.svg',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/position_mid.png',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/position-middle.png',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/position-middle.png'
  ],
  BOT: [
    'https://s-lol-web.op.gg/images/icon/icon-position-adc.svg',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/position_bottom.png',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/position-bottom.png',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/position-bottom.png'
  ],
  SUP: [
    'https://s-lol-web.op.gg/images/icon/icon-position-sup.svg',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/position_support.png',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/position-utility.png',
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/position-utility.png'
  ]
};

const RoleIcon = ({ role, className = "w-4 h-4" }: { role: Role; className?: string }) => {
  const [errorCount, setErrorCount] = useState(0);
  const fallbacks = roleIconFallbacks[role];
  const src = fallbacks[Math.min(errorCount, fallbacks.length - 1)];

  return (
    <div className={`relative ${className} shrink-0 flex items-center justify-center`}>
      <div 
        className="absolute inset-0 bg-current transition-colors duration-300"
        style={{
          WebkitMaskImage: `url(${src})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url(${src})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      />
      <img 
        src={src} 
        alt={role} 
        className="opacity-0 w-full h-full object-contain" 
        onError={(e) => { 
          if (errorCount < fallbacks.length - 1) {
            setErrorCount(prev => prev + 1);
          } else {
            e.currentTarget.style.display = 'none';
          }
        }}
      />
    </div>
  );
};

const matchCSData: Record<string, Record<Role, { p1: number[]; p2: number[] }>> = {
  'M1-1': {
    TOP: { p1: [205, 243], p2: [213, 241] },
    JGL: { p1: [226, 240], p2: [183, 215] },
    MID: { p1: [240, 264], p2: [263, 247] },
    BOT: { p1: [227, 256], p2: [232, 280] },
    SUP: { p1: [35, 45], p2: [34, 18] }
  },
  'M1-2': {
    TOP: { p1: [230, 227], p2: [245, 261] },
    JGL: { p1: [199, 197], p2: [225, 218] },
    MID: { p1: [263, 204], p2: [291, 293] },
    BOT: { p1: [269, 282], p2: [259, 244] },
    SUP: { p1: [45, 44], p2: [44, 38] }
  },
  'M1-3': {
    TOP: { p1: [145, 175], p2: [195, 192] },
    JGL: { p1: [159, 155], p2: [147, 141] },
    MID: { p1: [189, 193], p2: [147, 187] },
    BOT: { p1: [190, 187], p2: [203, 176] },
    SUP: { p1: [23, 24], p2: [27, 24] }
  },
  'M1-4': {
    TOP: { p1: [206, 202], p2: [188, 219] },
    JGL: { p1: [147, 184], p2: [160, 169] },
    MID: { p1: [180, 261], p2: [163, 252] },
    BOT: { p1: [154, 249], p2: [215, 191] },
    SUP: { p1: [30, 28], p2: [24, 18] }
  },
  'M1-5': {
    TOP: { p1: [266, 219], p2: [248, 269] },
    JGL: { p1: [214, 222], p2: [238, 234] },
    MID: { p1: [319, 297], p2: [298, 303] },
    BOT: { p1: [298, 316], p2: [293, 399] },
    SUP: { p1: [37, 33], p2: [34, 30] }
  },
  'M1-6': {
    TOP: { p1: [128, 266], p2: [148, 267] },
    JGL: { p1: [124, 189], p2: [99, 179] },
    MID: { p1: [168, 276], p2: [155, 254] },
    BOT: { p1: [140, 245], p2: [132, 245] },
    SUP: { p1: [22, 34], p2: [24, 25] }
  },
  'M1-7': {
    TOP: { p1: [241, 217], p2: [238, 157] },
    JGL: { p1: [202, 172], p2: [194, 193] },
    MID: { p1: [297, 188], p2: [265, 218] },
    BOT: { p1: [275, 243], p2: [286, 222] },
    SUP: { p1: [39, 24], p2: [31, 22] }
  },
  'M1-8': {
    TOP: { p1: [242, 231], p2: [144, 264] },
    JGL: { p1: [150, 272], p2: [151, 217] },
    MID: { p1: [151, 285], p2: [190, 243] },
    BOT: { p1: [229, 259], p2: [179, 292] },
    SUP: { p1: [29, 31], p2: [29, 65] }
  }
};

export function TeamStatsView({ teams }: TeamStatsProps) {
  const [selectedMatch, setSelectedMatch] = useState<MatchInfo | null>(null);

  // Sort teams by wins, then by KDA
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.stats.wins !== a.stats.wins) return b.stats.wins - a.stats.wins;
    const aKda = (a.stats.kills + a.stats.assists) / Math.max(1, a.stats.deaths);
    const bKda = (b.stats.kills + b.stats.assists) / Math.max(1, b.stats.deaths);
    return bKda - aKda;
  });

  const getPlayerDetailedStats = (player: Player) => {
    const kills = player.stats.kills;
    const deaths = player.stats.deaths;
    const assists = player.stats.assists;
    const kdaNum = (kills + assists) / Math.max(1, deaths);
    const kdaStr = kdaNum.toFixed(2);
    const dpm = player.stats.dpm;
    const gpm = player.stats.gpm;
    const dmgPct = player.stats.damagePercent;
    const tierScore = player.tierScore;
    
    // Calculate Damage Per Gold (DPG)
    const dpgVal = player.stats.dpg || (dpm / Math.max(1, gpm));
    const dpgStr = dpgVal.toFixed(2);
    
    return {
      kills,
      deaths,
      assists,
      kdaNum,
      kdaStr,
      dpm,
      gpm,
      dmgPct,
      tierScore,
      dpgNum: dpgVal,
      dpgStr
    };
  };

  const getTeamFromShortName = (shortName: string) => {
    return teams.find(t => t.name.includes(shortName)) || null;
  };

  const selectedTeam1 = selectedMatch ? getTeamFromShortName(selectedMatch.t1) : null;
  const selectedTeam2 = selectedMatch ? getTeamFromShortName(selectedMatch.t2) : null;
  const roles: Role[] = ['TOP', 'JGL', 'MID', 'BOT', 'SUP'];

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      {/* Scrim Schedule Section - Balanced Grid for All Screens */}
      <div className="bg-gradient-to-r from-[#0E1E11]/90 via-[#061007]/95 to-[#040804]/90 border border-[#1b3d20]/50 rounded-xl p-4.5 shrink-0 shadow-[0_4px_30px_rgba(0,255,65,0.02)]">
        <h2 className="text-[10px] font-black tracking-[0.2em] text-viper uppercase mb-3 drop-shadow-[0_0_8px_rgba(0,255,65,0.25)]">Day 1 Scrim Schedule</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          {[
            { id: 'M1-1', t1: '저라뎃', t2: '나는상윤', result: '1:1' },
            { id: 'M1-2', t1: '준밧드', t2: '스맵', result: '1:1' },
            { id: 'M1-3', t1: '클리드', t2: '서도일', result: '2:0' },
            { id: 'M1-4', t1: '저라뎃', t2: '클리드', result: '1:1' },
            { id: 'M1-5', t1: '준밧드', t2: '나는상윤', result: '1:1' },
            { id: 'M1-6', t1: '스맵', t2: '서도일', result: '2:0' },
            { id: 'M1-7', t1: '저라뎃', t2: '서도일', result: '1:1' },
            { id: 'M1-8', t1: '클리드', t2: '스맵', result: '1:1' },
          ].map((match) => (
            <div 
              key={match.id} 
              onClick={() => setSelectedMatch(match)}
              className="bg-[#030603]/85 border border-[#1B3F21]/30 p-2.5 rounded-lg flex flex-col gap-1.5 transition-all duration-300 hover:bg-[#071308] hover:border-viper/45 group shadow-md hover:shadow-[0_4px_12px_rgba(0,255,65,0.08)] cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-viper/55 group-hover:text-viper transition-colors">{match.id}</span>
                <span className="text-[10px] font-bold text-white/35">{match.result}</span>
              </div>
              <div className="flex flex-col text-[11px] font-bold text-white/70">
                <div className="flex justify-between items-center h-4">
                  <span className="truncate group-hover:text-white transition-colors">{match.t1}</span>
                  {match.result !== '-' && <span className={match.result.startsWith('2') ? 'text-viper font-black' : 'text-white/40 font-semibold'}>{match.result.split(':')[0]}</span>}
                </div>
                <div className="flex justify-between items-center h-4">
                  <span className="truncate group-hover:text-white transition-colors">{match.t2}</span>
                  {match.result !== '-' && <span className={match.result.endsWith('2') ? 'text-viper font-black' : 'text-white/40 font-semibold'}>{match.result.split(':')[1]}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Stats Scrollable Area - Clear Team Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-4 pr-2 custom-scrollbar animate-fade-in">
        {sortedTeams.map((team, index) => {
          const kda = ((team.stats.kills + team.stats.assists) / Math.max(1, team.stats.deaths)).toFixed(2);
          const winRate = Math.round((team.stats.wins / Math.max(1, team.stats.games)) * 100);

          return (
            <div 
              key={team.id} 
              className="bg-gradient-to-b from-[#161616] to-[#0A0A0A] border border-white/[0.05] rounded-xl p-4 flex flex-col gap-1.5 transition-all duration-300 group shadow-xl hover:shadow-[0_12px_32px_rgba(0,0,0,0.7)] hover:border-viper/25 hover:z-30 relative"
            >
              {/* Dynamic glowing bar at top of card */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-xl bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-viper transition-all duration-500 ease-out" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-7.5 h-7.5 rounded bg-viper/10 text-viper font-black text-[12px] border border-viper/20 shadow-[0_0_10px_rgba(0,255,65,0.05)] transition-all group-hover:scale-105 duration-300">
                      #{index + 1}
                    </div>
                    <h2 className="text-[13px] font-black tracking-widest text-[#E0E0E0] uppercase group-hover:text-white transition-colors duration-200">
                      {team.name}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gradient-to-b from-[#1C1C1C] to-[#121212] p-2 rounded-lg border border-white/[0.03] flex flex-col justify-center transition-all group-hover:border-white/[0.06] duration-300">
                    <span className="stat-label mb-0.5 text-[9.5px] tracking-widest text-white/40 font-extrabold uppercase">Record</span>
                    <span className="text-[13.5px] font-black text-white">{team.stats.wins}W {team.stats.losses}L</span>
                    <span className="text-[10.5px] font-black text-viper mt-0.5">{winRate}% WR</span>
                  </div>
                  <div className="bg-gradient-to-b from-[#1C1C1C] to-[#121212] p-2 rounded-lg border border-white/[0.03] flex flex-col justify-center transition-all group-hover:border-white/[0.06] duration-300">
                    <span className="stat-label mb-0.5 text-[9.5px] tracking-widest text-white/40 font-extrabold uppercase">K/D/A</span>
                    <span className="text-[12px] font-black tracking-tight text-white/90 leading-tight">{team.stats.kills}/{team.stats.deaths}/{team.stats.assists}</span>
                    <span className="text-[9.5px] text-white/30 font-bold mt-1">TOTAL</span>
                  </div>
                  <div className="bg-gradient-to-b from-[#1C1C1C] to-[#121212] p-2 rounded-lg border border-white/[0.03] flex flex-col justify-center transition-all group-hover:border-white/[0.06] duration-300">
                    <span className="stat-label mb-0.5 text-[9.5px] tracking-widest text-white/40 font-extrabold uppercase">KDA</span>
                    <span className="text-[15px] font-black text-viper leading-none">{kda}</span>
                    <span className="text-[9.5px] text-white/30 font-bold mt-1">AVERAGE</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col border-t border-white/[0.05] pt-2 mt-1.5 relative z-10 w-full">
                <div className="text-[10px] font-black tracking-widest text-viper uppercase mb-1.5 drop-shadow-[0_0_6px_rgba(0,255,65,0.3)] flex items-center gap-1">
                  <span>상대전적 :</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {team.headToHead.map((h2h) => {
                    return (
                      <div key={h2h.opponentId} className="flex justify-between items-center bg-[#101010]/50 border border-white/[0.02] py-1 px-1.5 rounded-lg hover:border-viper/20 hover:bg-[#0d130e]/30 transition-all duration-200 group/h2h">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-[3px] h-2 bg-white/10 rounded-full shrink-0 group-hover/h2h:bg-viper transition-all" />
                          <span className="text-[11px] font-bold text-white/60 group-hover/h2h:text-white transition-colors truncate">vs {h2h.opponentName}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 font-mono text-[10px] font-bold">
                          <span className={h2h.wins > 0 ? 'text-viper font-black' : 'text-white/30'}>{h2h.wins}W</span>
                          <span className="text-white/20">-</span>
                          <span className={h2h.losses > 0 ? 'text-red-400 font-extrabold' : 'text-white/30'}>{h2h.losses}L</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrim Setup Details Modal */}
      {selectedMatch && selectedTeam1 && selectedTeam2 && (() => {
        const team1H2H = selectedTeam1.headToHead.find(h => h.opponentId === selectedTeam2.id);
        const team2H2H = selectedTeam2.headToHead.find(h => h.opponentId === selectedTeam1.id);

        return (
          <div 
            id="match-details-overlay"
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
            onClick={() => setSelectedMatch(null)}
          >
            <div 
              id="match-details-container"
              className="relative w-full max-w-3xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-white/[0.08] rounded-2xl shadow-[0_0_80px_rgba(0,255,65,0.08)] overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header section with scoreboard */}
              <div className="p-6 border-b border-white/[0.06] bg-[#0F0F0F] shrink-0 relative">
                <button 
                  onClick={() => setSelectedMatch(null)}
                  className="absolute top-5 right-5 text-white/50 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black tracking-[0.3em] text-viper mb-1 uppercase">
                    MATCH PREVIEW &amp; ANALYSIS • {selectedMatch.id}
                  </span>
                  
                  {/* Scoreboard line */}
                  <div className="flex items-center justify-between w-full mt-4 px-2">
                    {/* Left Team block */}
                    <div className="flex-1 text-right flex flex-col items-end pr-3">
                      <span className="text-base font-black text-[#E0E0E0] uppercase tracking-wide">
                        {selectedTeam1.name}
                      </span>
                      <div className="flex flex-col text-[11px] mt-1.5 text-white/40 leading-tight">
                        <div>
                          총전적: <span className="text-white/80 font-bold">{selectedTeam1.stats.wins}승 {selectedTeam1.stats.losses}패</span>
                          <span className="text-viper font-black ml-1">({Math.round((selectedTeam1.stats.wins / Math.max(1, selectedTeam1.stats.games)) * 100)}%)</span>
                        </div>
                        <div className="mt-0.5">
                          상대전적: <span className="text-viper font-black">{team1H2H ? `${team1H2H.wins}승 ${team1H2H.losses}패` : '0승 0패'}</span>
                        </div>
                      </div>
                    </div>

                    {/* SCORE DIVIDER */}
                    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] py-2 px-5 rounded-2xl shrink-0">
                      <span className="text-xl font-black text-white px-1">
                        {selectedMatch.result.split(':')[0]}
                      </span>
                      <span className="text-white/20 font-black text-base">:</span>
                      <span className="text-xl font-black text-white px-1">
                        {selectedMatch.result.split(':')[1]}
                      </span>
                    </div>

                    {/* Right Team block */}
                    <div className="flex-1 text-left flex flex-col items-start pl-3">
                      <span className="text-base font-black text-[#E0E0E0] uppercase tracking-wide">
                        {selectedTeam2.name}
                      </span>
                      <div className="flex flex-col text-[11px] mt-1.5 text-white/40 leading-tight">
                        <div>
                          총전적: <span className="text-white/80 font-bold">{selectedTeam2.stats.wins}승 {selectedTeam2.stats.losses}패</span>
                          <span className="text-viper font-black ml-1">({Math.round((selectedTeam2.stats.wins / Math.max(1, selectedTeam2.stats.games)) * 100)}%)</span>
                        </div>
                        <div className="mt-0.5">
                          상대전적: <span className="text-viper font-black">{team2H2H ? `${team2H2H.wins}승 ${team2H2H.losses}패` : '0승 0패'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Position line comparison scrollable body */}
              <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4 custom-scrollbar bg-[#0C0C0C]/50">
                {roles.map((role) => {
                  const p1 = selectedTeam1.players.find(p => p.role === role);
                  const p2 = selectedTeam2.players.find(p => p.role === role);

                  if (!p1 || !p2) return null;

                  const csRecord = matchCSData[selectedMatch.id]?.[role];
                  const p1AvgCs = csRecord ? Number((csRecord.p1.reduce((sum, val) => sum + val, 0) / csRecord.p1.length).toFixed(1)) : 0;
                  const p2AvgCs = csRecord ? Number((csRecord.p2.reduce((sum, val) => sum + val, 0) / csRecord.p2.length).toFixed(1)) : 0;

                  const p1Stats = getPlayerDetailedStats(p1);
                  const p2Stats = getPlayerDetailedStats(p2);

                  // Highlight winner criteria (higher is better)
                  const isP1TierBetter = p1Stats.tierScore > p2Stats.tierScore;
                  const isP2TierBetter = p2Stats.tierScore > p1Stats.tierScore;
                  const isP1KdaBetter = p1Stats.kdaNum > p2Stats.kdaNum;
                  const isP2KdaBetter = p2Stats.kdaNum > p1Stats.kdaNum;
                  const isP1DpmBetter = p1Stats.dpm > p2Stats.dpm;
                  const isP2DpmBetter = p2Stats.dpm > p1Stats.dpm;
                  const isP1GpmBetter = p1Stats.gpm > p2Stats.gpm;
                  const isP2GpmBetter = p2Stats.gpm > p1Stats.gpm;
                  const isP1DmgBetter = p1Stats.dmgPct > p2Stats.dmgPct;
                  const isP2DmgBetter = p2Stats.dmgPct > p1Stats.dmgPct;
                  const isP1DpgBetter = p1Stats.dpgNum > p2Stats.dpgNum;
                  const isP2DpgBetter = p2Stats.dpgNum > p1Stats.dpgNum;
                  const isP1CsBetter = csRecord ? p1AvgCs > p2AvgCs : false;
                  const isP2CsBetter = csRecord ? p2AvgCs > p1AvgCs : false;

                  // Overall matchup power score
                  const p1Score = (isP1KdaBetter ? 1 : 0) + 
                                  (isP1DpmBetter ? 1 : 0) + 
                                  (isP1GpmBetter ? 1 : 0) + 
                                  (isP1DmgBetter ? 1 : 0) + 
                                  (isP1TierBetter ? 1 : 0) + 
                                  (isP1DpgBetter ? 1 : 0) +
                                  (isP1CsBetter ? 1 : 0);

                  const p2Score = (isP2KdaBetter ? 1 : 0) + 
                                  (isP2DpmBetter ? 1 : 0) + 
                                  (isP2GpmBetter ? 1 : 0) + 
                                  (isP2DmgBetter ? 1 : 0) + 
                                  (isP2TierBetter ? 1 : 0) + 
                                  (isP2DpgBetter ? 1 : 0) +
                                  (isP2CsBetter ? 1 : 0);

                  return (
                    <div 
                      key={role} 
                      className={`relative border rounded-xl px-4 py-2.5 transition-all duration-300 overflow-hidden ${
                        p1Score > p2Score 
                          ? 'border-viper/15 bg-gradient-to-r from-viper/[0.03] via-zinc-900/95 to-zinc-950/70 shadow-[0_0_20px_rgba(0,255,65,0.03)]'
                          : p2Score > p1Score
                            ? 'border-viper/15 bg-gradient-to-l from-viper/[0.03] via-zinc-900/95 to-zinc-950/70 shadow-[0_0_20px_rgba(0,255,65,0.03)]'
                            : 'border-white/[0.04] bg-[#121212]/70'
                      }`}
                    >
                      {/* Aura Ambient Background Glow for superior player */}
                      {p1Score > p2Score && (
                        <>
                          <div className="absolute top-0 bottom-0 left-0 w-[45%] bg-gradient-to-r from-viper/[0.04] to-transparent pointer-events-none blur-[6px]" />
                          <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-viper via-viper/50 to-transparent shadow-[0_0_12px_rgba(0,255,65,0.8)]" />
                        </>
                      )}
                      {p2Score > p1Score && (
                        <>
                          <div className="absolute top-0 bottom-0 right-0 w-[45%] bg-gradient-to-l from-viper/[0.04] to-transparent pointer-events-none blur-[6px]" />
                          <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-viper via-viper/50 to-transparent shadow-[0_0_12px_rgba(0,255,65,0.8)]" />
                        </>
                      )}

                      {/* Single Compact Container */}
                      <div id={`match-role-${role}-row`} className="relative z-10 flex items-center justify-between gap-1 sm:gap-1.5 md:gap-3">
                        {/* 1. Left Player (Width fixed for alignment, made responsive to prevent clipping) */}
                        <div className="w-[85px] xs:w-[105px] sm:w-[125px] text-left flex flex-col shrink-0">
                          <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
                            <span className={`text-[11.5px] xs:text-[12px] sm:text-xs font-black transition-colors truncate max-w-[55px] xs:max-w-[75px] sm:max-w-none ${p1Score > p2Score ? 'text-viper drop-shadow-[0_0_6px_rgba(0,255,65,0.4)]' : 'text-white'}`}>
                              {p1.name}
                            </span>
                            {p1Score > p2Score && (
                              <span className="text-[6.5px] sm:text-[7px] font-black tracking-tighter bg-viper/20 text-viper py-0.5 px-0.5 sm:px-1 rounded border border-viper/40 animate-pulse uppercase scale-90 origin-left">
                                ADV
                              </span>
                            )}
                          </div>
                          <span className="text-[8.5px] sm:text-[9px] text-white/40 font-semibold truncate mt-0.5 max-w-[80px] xs:max-w-[100px] sm:max-w-[120px]">
                            {selectedMatch.t1} • {p1.summonerName || p1.name}
                          </span>
                        </div>

                        {/* 2. Left Player Stats Area (Responsive gaps to prevent clutter) */}
                        <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2 px-0.5 sm:px-1 text-right select-none min-w-0">
                          {/* KDA */}
                          <div className={`flex flex-col items-end py-0.5 px-1 sm:px-1.5 rounded transition-all ${isP1KdaBetter ? 'bg-viper/[0.04] border border-viper/10' : ''}`}>
                            <span className="text-[6.5px] sm:text-[7.5px] font-bold text-white/25 uppercase tracking-wider leading-none">KDA</span>
                            <span className={`font-mono text-[9.5px] sm:text-[11px] leading-tight ${isP1KdaBetter ? 'text-viper font-black drop-shadow-[0_0_4px_rgba(0,255,65,0.2)]' : 'text-white/50 font-medium'}`}>
                              {p1Stats.kdaStr}
                            </span>
                          </div>
                          
                          {/* DPM */}
                          <div className={`flex flex-col items-end py-0.5 px-1 sm:px-1.5 rounded transition-all ${isP1DpmBetter ? 'bg-viper/[0.04] border border-viper/10' : ''}`}>
                            <span className="text-[6.5px] sm:text-[7.5px] font-bold text-white/25 uppercase tracking-wider leading-none">DPM</span>
                            <span className={`font-mono text-[9.5px] sm:text-[11px] leading-tight ${isP1DpmBetter ? 'text-viper font-black drop-shadow-[0_0_4px_rgba(0,255,65,0.2)]' : 'text-white/50 font-medium'}`}>
                              {p1Stats.dpm}
                            </span>
                          </div>

                          {/* DPG */}
                          <div className={`flex flex-col items-end py-0.5 px-1 sm:px-1.5 rounded transition-all ${isP1DpgBetter ? 'bg-viper/[0.04] border border-viper/10' : ''}`}>
                            <span className="text-[6.5px] sm:text-[7.5px] font-bold text-white/25 uppercase tracking-wider leading-none">DPG</span>
                            <span className={`font-mono text-[9.5px] sm:text-[11px] leading-tight ${isP1DpgBetter ? 'text-viper font-black drop-shadow-[0_0_4px_rgba(0,255,65,0.2)]' : 'text-white/50 font-medium'}`}>
                              {p1Stats.dpgStr}
                            </span>
                          </div>

                          {/* DMG% */}
                          <div className={`flex flex-col items-end py-0.5 px-1 sm:px-1.5 rounded transition-all ${isP1DmgBetter ? 'bg-viper/[0.04] border border-viper/10' : ''}`}>
                            <span className="text-[6.5px] sm:text-[7.5px] font-bold text-white/25 uppercase tracking-wider leading-none">DMG%</span>
                            <span className={`font-mono text-[9.5px] sm:text-[11px] leading-tight ${isP1DmgBetter ? 'text-viper font-black drop-shadow-[0_0_4px_rgba(0,255,65,0.2)]' : 'text-white/50 font-medium'}`}>
                              {p1Stats.dmgPct}%
                            </span>
                          </div>

                          {/* CS - Match Average CS */}
                          {csRecord && (
                            <div className={`flex flex-col items-end py-0.5 px-1 sm:px-1.5 rounded transition-all ${isP1CsBetter ? 'bg-viper/[0.04] border border-viper/10' : ''}`}>
                              <span className="text-[6.5px] sm:text-[7.5px] font-bold text-white/25 uppercase tracking-wider leading-none">CS</span>
                              <span className={`font-mono text-[9.5px] sm:text-[11px] leading-tight ${isP1CsBetter ? 'text-viper font-black drop-shadow-[0_0_4px_rgba(0,255,65,0.2)]' : 'text-white/50 font-medium'}`}>
                                {p1AvgCs}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 3. Center Position Icon */}
                        <div id={`match-role-${role}-badge`} className="flex flex-col items-center shrink-0 mx-0.5 sm:mx-1 select-none">
                          <div className="w-7 sm:w-8.5 h-7 sm:h-8.5 rounded-full bg-gradient-to-b from-[#2C2C2C] to-[#121212] border border-white/[0.08] flex items-center justify-center text-white shadow-md">
                            <RoleIcon role={role} className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
                          </div>
                          <span className="text-[6.5px] sm:text-[7.5px] font-black text-viper/50 tracking-widest uppercase mt-0.5">
                            {role}
                          </span>
                        </div>

                        {/* 4. Right Player Stats Area (Responsive gaps to prevent clutter) */}
                        <div className="flex-1 flex justify-start items-center gap-1 sm:gap-2 px-0.5 sm:px-1 text-left select-none min-w-0">
                          {/* KDA */}
                          <div className={`flex flex-col items-start py-0.5 px-1 sm:px-1.5 rounded transition-all ${isP2KdaBetter ? 'bg-viper/[0.04] border border-viper/10' : ''}`}>
                            <span className="text-[6.5px] sm:text-[7.5px] font-bold text-white/25 uppercase tracking-wider leading-none">KDA</span>
                            <span className={`font-mono text-[9.5px] sm:text-[11px] leading-tight ${isP2KdaBetter ? 'text-viper font-black drop-shadow-[0_0_4px_rgba(0,255,65,0.2)]' : 'text-white/50 font-medium'}`}>
                              {p2Stats.kdaStr}
                            </span>
                          </div>

                          {/* DPM */}
                          <div className={`flex flex-col items-start py-0.5 px-1 sm:px-1.5 rounded transition-all ${isP2DpmBetter ? 'bg-viper/[0.04] border border-viper/10' : ''}`}>
                            <span className="text-[6.5px] sm:text-[7.5px] font-bold text-white/25 uppercase tracking-wider leading-none">DPM</span>
                            <span className={`font-mono text-[9.5px] sm:text-[11px] leading-tight ${isP2DpmBetter ? 'text-viper font-black drop-shadow-[0_0_4px_rgba(0,255,65,0.2)]' : 'text-white/50 font-medium'}`}>
                              {p2Stats.dpm}
                            </span>
                          </div>

                          {/* DPG */}
                          <div className={`flex flex-col items-start py-0.5 px-1 sm:px-1.5 rounded transition-all ${isP2DpgBetter ? 'bg-viper/[0.04] border border-viper/10' : ''}`}>
                            <span className="text-[6.5px] sm:text-[7.5px] font-bold text-white/25 uppercase tracking-wider leading-none">DPG</span>
                            <span className={`font-mono text-[9.5px] sm:text-[11px] leading-tight ${isP2DpgBetter ? 'text-viper font-black drop-shadow-[0_0_4px_rgba(0,255,65,0.2)]' : 'text-white/50 font-medium'}`}>
                              {p2Stats.dpgStr}
                            </span>
                          </div>

                          {/* DMG% */}
                          <div className={`flex flex-col items-start py-0.5 px-1 sm:px-1.5 rounded transition-all ${isP2DmgBetter ? 'bg-viper/[0.04] border border-viper/10' : ''}`}>
                            <span className="text-[6.5px] sm:text-[7.5px] font-bold text-white/25 uppercase tracking-wider leading-none">DMG%</span>
                            <span className={`font-mono text-[9.5px] sm:text-[11px] leading-tight ${isP2DmgBetter ? 'text-viper font-black drop-shadow-[0_0_4px_rgba(0,255,65,0.2)]' : 'text-white/50 font-medium'}`}>
                              {p2Stats.dmgPct}%
                            </span>
                          </div>

                          {/* CS - Match Average CS */}
                          {csRecord && (
                            <div className={`flex flex-col items-start py-0.5 px-1 sm:px-1.5 rounded transition-all ${isP2CsBetter ? 'bg-viper/[0.04] border border-viper/10' : ''}`}>
                              <span className="text-[6.5px] sm:text-[7.5px] font-bold text-white/25 uppercase tracking-wider leading-none">CS</span>
                              <span className={`font-mono text-[9.5px] sm:text-[11px] leading-tight ${isP2CsBetter ? 'text-viper font-black drop-shadow-[0_0_4px_rgba(0,255,65,0.2)]' : 'text-white/50 font-medium'}`}>
                                {p2AvgCs}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 5. Right Player (Width fixed for alignment, made responsive to prevent clipping) */}
                        <div className="w-[85px] xs:w-[105px] sm:w-[125px] text-right flex flex-col items-end shrink-0">
                          <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap justify-end">
                            {p2Score > p1Score && (
                              <span className="text-[6.5px] sm:text-[7px] font-black tracking-tighter bg-viper/40 text-viper py-0.5 px-0.5 sm:px-1 rounded border border-viper/40 animate-pulse uppercase scale-90 origin-right">
                                ADV
                              </span>
                            )}
                            <span className={`text-[11.5px] xs:text-[12px] sm:text-xs font-black transition-colors truncate max-w-[55px] xs:max-w-[75px] sm:max-w-none ${p2Score > p1Score ? 'text-viper drop-shadow-[0_0_6px_rgba(0,255,65,0.4)]' : 'text-white'}`}>
                              {p2.name}
                            </span>
                          </div>
                          <span className="text-[8.5px] sm:text-[9px] text-white/40 font-semibold truncate mt-0.5 max-w-[80px] xs:max-w-[100px] sm:max-w-[120px]">
                            {selectedMatch.t2} • {p2.summonerName || p2.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom action frame */}
              <div className="p-4 border-t border-white/[0.06] bg-[#0E0E0E] flex justify-end shrink-0">
                <button 
                  onClick={() => setSelectedMatch(null)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-2 px-5 rounded-lg transition-colors duration-200"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
