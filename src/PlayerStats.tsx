import { Team, Player, Role } from './types';
import { useState, useMemo } from 'react';
import { LayoutList, PieChart, ShieldAlert } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface PlayerStatsProps {
  teams: Team[];
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

type ViewMode = 'CHART' | 'LIST';
type SortKey = 'name' | 'teamName' | 'kda' | 'kills' | 'deaths' | 'assists' | 'dpm' | 'gpm' | 'csm' | 'dpg' | 'damagePercent';

export function PlayerStatsView({ teams }: PlayerStatsProps) {
  const [activeRole, setActiveRole] = useState<Role | 'ALL'>('TOP');
  const [viewMode, setViewMode] = useState<ViewMode>('CHART');
  const [sortKey, setSortKey] = useState<SortKey>('kda');
  const [sortDesc, setSortDesc] = useState(true);
  const [chartSubMode, setChartSubMode] = useState<'INDIVIDUAL' | 'COMPARISON'>('INDIVIDUAL');
  
  // Flatten players
  const allPlayers = useMemo(() => teams.flatMap(t => 
    t.players.map(p => ({
      ...p,
      teamName: t.name,
      kda: Number(((p.stats.kills + p.stats.assists) / Math.max(1, p.stats.deaths)).toFixed(2))
    }))
  ), [teams]);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const rolePlayers = useMemo(() => activeRole === 'ALL' ? allPlayers : allPlayers.filter(p => p.role === activeRole), [allPlayers, activeRole]);

  // When active role changes, select the first player
  useMemo(() => {
    if (rolePlayers.length > 0 && (!selectedPlayerId || !rolePlayers.find(p => p.id === selectedPlayerId))) {
      setSelectedPlayerId(rolePlayers[0].id);
    }
  }, [activeRole, rolePlayers, selectedPlayerId]);

  const selectedPlayer = rolePlayers.find(p => p.id === selectedPlayerId) || rolePlayers[0];

  // Calculate role maximums for normalization
  const roleMax = useMemo(() => {
    const playersToCalculate = activeRole === 'ALL' 
      ? allPlayers 
      : allPlayers.filter(p => p.role === (selectedPlayer?.role || activeRole));
    
    if (playersToCalculate.length === 0) return null;
    return {
      kda: Math.max(...playersToCalculate.map(p => p.kda)),
      dpm: Math.max(...playersToCalculate.map(p => p.stats.dpm)),
      gpm: Math.max(...playersToCalculate.map(p => p.stats.gpm)),
      csm: Math.max(...playersToCalculate.map(p => p.stats.csm)),
      dpg: Math.max(...playersToCalculate.map(p => p.stats.dpg)),
      damagePercent: Math.max(...playersToCalculate.map(p => p.stats.damagePercent)),
    };
  }, [allPlayers, activeRole, selectedPlayer]);

  const roleAvg = useMemo(() => {
    const playersToCalculate = activeRole === 'ALL' 
      ? allPlayers 
      : allPlayers.filter(p => p.role === (selectedPlayer?.role || activeRole));

    if (playersToCalculate.length === 0) return null;
    return {
      kda: playersToCalculate.reduce((sum, p) => sum + p.kda, 0) / playersToCalculate.length,
      dpm: playersToCalculate.reduce((sum, p) => sum + p.stats.dpm, 0) / playersToCalculate.length,
      gpm: playersToCalculate.reduce((sum, p) => sum + p.stats.gpm, 0) / playersToCalculate.length,
      csm: playersToCalculate.reduce((sum, p) => sum + p.stats.csm, 0) / playersToCalculate.length,
      dpg: playersToCalculate.reduce((sum, p) => sum + p.stats.dpg, 0) / playersToCalculate.length,
      damagePercent: playersToCalculate.reduce((sum, p) => sum + p.stats.damagePercent, 0) / playersToCalculate.length,
    };
  }, [allPlayers, activeRole, selectedPlayer]);

  // Helper to generate radar chart data for any specified player
  const getRadarDataForPlayer = (player: typeof selectedPlayer) => {
    if (!player || !roleMax || !roleAvg) return [];
    
    const normalize = (val: number, max: number) => (val / Math.max(1, max)) * 100;

    return [
      {
        metric: 'KDA',
        player: normalize(player.kda, roleMax.kda),
        average: normalize(roleAvg.kda, roleMax.kda),
        playerRaw: player.kda,
        avgRaw: roleAvg.kda.toFixed(2),
        fullMark: 100,
      },
      {
        metric: 'DPM',
        player: normalize(player.stats.dpm, roleMax.dpm),
        average: normalize(roleAvg.dpm, roleMax.dpm),
        playerRaw: player.stats.dpm,
        avgRaw: roleAvg.dpm.toFixed(0),
        fullMark: 100,
      },
      {
        metric: 'GPM',
        player: normalize(player.stats.gpm, roleMax.gpm),
        average: normalize(roleAvg.gpm, roleMax.gpm),
        playerRaw: player.stats.gpm,
        avgRaw: roleAvg.gpm.toFixed(0),
        fullMark: 100,
      },
      {
        metric: 'CSM',
        player: normalize(player.stats.csm, roleMax.csm),
        average: normalize(roleAvg.csm, roleMax.csm),
        playerRaw: player.stats.csm,
        avgRaw: roleAvg.csm.toFixed(1),
        fullMark: 100,
      },
      {
        metric: 'DPG',
        player: normalize(player.stats.dpg, roleMax.dpg),
        average: normalize(roleAvg.dpg, roleMax.dpg),
        playerRaw: player.stats.dpg,
        avgRaw: roleAvg.dpg.toFixed(2),
        fullMark: 100,
      },
      {
        metric: 'DMG%',
        player: normalize(player.stats.damagePercent, roleMax.damagePercent),
        average: normalize(roleAvg.damagePercent, roleMax.damagePercent),
        playerRaw: player.stats.damagePercent,
        avgRaw: roleAvg.damagePercent.toFixed(1),
        fullMark: 100,
      }
    ];
  };

  const radarData = useMemo(() => {
    return getRadarDataForPlayer(selectedPlayer);
  }, [selectedPlayer, roleMax, roleAvg]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const sortedPlayers = useMemo(() => {
    return [...rolePlayers].sort((a, b) => {
      let valA: any = a[sortKey as keyof typeof a];
      let valB: any = b[sortKey as keyof typeof b];

      if (['kills', 'deaths', 'assists', 'dpm', 'gpm', 'csm', 'dpg', 'damagePercent'].includes(sortKey)) {
        valA = a.stats[sortKey as keyof typeof a.stats];
        valB = b.stats[sortKey as keyof typeof b.stats];
      }

      if (valA < valB) return sortDesc ? 1 : -1;
      if (valA > valB) return sortDesc ? -1 : 1;
      return 0;
    });
  }, [rolePlayers, sortKey, sortDesc]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#111111] border border-[#222222] p-3 rounded shadow-xl">
          <p className="font-bold text-[#E0E0E0] mb-2">{data.metric}</p>
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-[#00FF41]">Player: {data.playerRaw}</span>
            <span className="text-white/50">Avg: {data.avgRaw}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Extract all 6 matching role players for simultaneous comparison
  const sameRoleRepresentations = useMemo(() => {
    if (activeRole === 'ALL') return [];
    return allPlayers.filter(p => p.role === activeRole);
  }, [allPlayers, activeRole]);

  const isComparisonMode = chartSubMode === 'COMPARISON' && activeRole !== 'ALL';
  const panelHeightClass = isComparisonMode ? 'h-auto lg:h-[830px]' : 'h-[640px] lg:h-[720px]';

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      {/* Role Selector & View Toggle */}
      <div className="card-bg rounded-lg p-2 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {(['ALL', 'TOP', 'JGL', 'MID', 'BOT', 'SUP'] as ('ALL' | Role)[]).map(role => (
            <button
              key={role}
              onClick={() => {
                setActiveRole(role);
                if (role === 'ALL') setViewMode('LIST');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded font-bold tracking-widest text-xs transition-colors whitespace-nowrap ${
                activeRole === role 
                  ? 'bg-viper/10 text-viper border border-viper/30' 
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
              }`}
            >
              {role !== 'ALL' && <RoleIcon role={role as Role} />}
              {role}
            </button>
          ))}
        </div>
        <div className="flex bg-[#1A1A1A] rounded p-1 border border-[#222222]">
          <button
            onClick={() => setViewMode('LIST')}
            className={`px-4 py-1.5 rounded flex items-center gap-2 text-xs font-bold tracking-widest transition-colors ${
              viewMode === 'LIST' ? 'bg-[#333333] text-white shadow' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <LayoutList className="w-3 h-3" />
            LIST
          </button>
          <button
            onClick={() => {
              setViewMode('CHART');
              if (activeRole === 'ALL') setActiveRole('TOP');
            }}
            className={`px-4 py-1.5 rounded flex items-center gap-2 text-xs font-bold tracking-widest transition-colors ${
              viewMode === 'CHART' ? 'bg-[#333333] text-white shadow' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <PieChart className="w-3 h-3" />
            CHART
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'LIST' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="card-bg rounded-lg overflow-auto flex-grow relative bg-[#0A0A0A]"
          >
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-[#111111] z-10 shadow-md">
                <tr className="border-b border-[#222222] stat-label">
                  <th className="p-4 font-bold w-12 tracking-widest text-[#666666]">#</th>
                  <th className="p-4 font-bold tracking-widest text-[#666666] cursor-pointer hover:text-[#00FF41] transition-colors" onClick={() => handleSort('name')}>PLAYER</th>
                  <th className="p-4 font-bold tracking-widest text-[#666666] cursor-pointer hover:text-[#00FF41] transition-colors" onClick={() => handleSort('teamName')}>TEAM</th>
                  <th className="p-4 font-bold tracking-widest text-[#666666] cursor-pointer hover:text-[#00FF41] transition-colors" onClick={() => handleSort('kda')}>KDA</th>
                  <th className="p-4 font-bold tracking-widest text-[#666666] cursor-pointer hover:text-[#00FF41] transition-colors" onClick={() => handleSort('dpm')}>DPM</th>
                  <th className="p-4 font-bold tracking-widest text-[#666666] cursor-pointer hover:text-[#00FF41] transition-colors" onClick={() => handleSort('gpm')}>GPM</th>
                  <th className="p-4 font-bold tracking-widest text-[#666666] cursor-pointer hover:text-[#00FF41] transition-colors" onClick={() => handleSort('csm')}>CSM</th>
                  <th className="p-4 font-bold tracking-widest text-[#666666] cursor-pointer hover:text-[#00FF41] transition-colors" onClick={() => handleSort('dpg')}>DPG</th>
                  <th className="p-4 font-bold tracking-widest text-[#666666] cursor-pointer hover:text-[#00FF41] transition-colors" onClick={() => handleSort('damagePercent')}>DMG%</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((p, idx) => (
                  <tr 
                    key={p.id} 
                    onClick={() => {
                      setSelectedPlayerId(p.id);
                      setViewMode('CHART');
                      if (activeRole === 'ALL') setActiveRole(p.role);
                    }}
                    className="data-row hover:bg-viper/5 cursor-pointer transition-colors group border-b border-white/[0.03]"
                  >
                    <td className="p-4 text-white/30 text-xs">{idx + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-4 bg-white/20 group-hover:bg-[#00FF41] transition-colors"></div>
                        <span className="font-medium text-sm text-[#E0E0E0]">{p.name} {p.summonerName && <span className="text-[10px] text-white/40 ml-1 font-normal tracking-tight">({p.summonerName})</span>}</span>
                        {activeRole === 'ALL' && (
                          <span className="text-[10px] text-[#00FF41] font-bold border border-[#00FF41]/30 px-1 rounded-sm bg-[#00FF41]/10">{p.role}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-white/50">{p.teamName}</td>
                    <td className="p-4 font-medium text-[#00FF41]">{p.kda.toFixed(2)}</td>
                    <td className="p-4 text-sm text-white/80">{p.stats.dpm}</td>
                    <td className="p-4 text-sm text-white/80">{p.stats.gpm}</td>
                    <td className="p-4 text-sm text-white/80">{p.stats.csm}</td>
                    <td className="p-4 text-sm text-white/80">{p.stats.dpg}</td>
                    <td className="p-4 text-xs text-white/50">{p.stats.damagePercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedPlayers.length === 0 && (
              <div className="p-10 text-center text-white/40 text-sm tracking-widest uppercase font-bold">
                No players found.
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="chart"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 flex-grow overflow-y-auto custom-scrollbar h-full pr-1"
          >
            {/* Top Row: Left Player Selection List & Right Detail Dashboard */}
            <div className="flex flex-col lg:flex-row gap-4 shrink-0">
              {/* Player List Pane */}
              <div className={`card-bg rounded-lg flex flex-col w-full lg:w-1/4 flex-shrink-0 border border-[#222222] overflow-hidden ${panelHeightClass}`}>
                <div className="p-3 border-b border-[#222222] bg-[#1A1A1A]">
                  <h2 className="text-xs font-bold tracking-widest text-[#00FF41] uppercase">Select Player</h2>
                </div>
                <div className="overflow-y-auto flex-grow p-1.5 space-y-1 custom-scrollbar">
                  {rolePlayers.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedPlayerId(p.id)}
                      className={`p-2 rounded border cursor-pointer transition-all flex items-center justify-between ${
                        selectedPlayerId === p.id 
                          ? 'bg-viper/10 border-viper/50' 
                          : 'bg-transparent border-[#222222] hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className={`font-bold text-xs truncate ${selectedPlayerId === p.id ? 'text-viper' : 'text-[#E0E0E0]'}`}>
                          {p.name}
                        </span>
                        {p.summonerName && (
                          <span className="text-[9px] text-[#A0A0A0] truncate max-w-[120px] tracking-tight">
                            ({p.summonerName})
                          </span>
                        )}
                        <div className="flex items-center gap-1 uppercase text-[8px] font-bold mt-1">
                          <span className="text-viper/60 tracking-wider">TEAM</span>
                          <span className="text-white/40 truncate">{p.teamName.replace('TEAM ', '')}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 pl-1">
                        <span className="text-[10px] font-bold text-viper/90">{p.kda.toFixed(2)} KDA</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar Chart & Details Container (Now sized beautifully) */}
              <div className="flex-grow flex flex-col justify-between overflow-hidden">
                {selectedPlayer ? (
                  <div className={`card-bg rounded-lg flex flex-col overflow-hidden border border-[#222222] ${panelHeightClass}`}>
                    {/* 세련된 프로필 요약 카드 헤더 (원상 복구된 사이즈, 토글 버튼 추가) */}
                    <div className="p-5 border-b border-[#222222] flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#151515] shrink-0 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg border border-viper/30 bg-viper/5 flex items-center justify-center shadow-md shrink-0">
                          <RoleIcon role={selectedPlayer.role as Role} className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-black tracking-tight text-[#E0E0E0]">{selectedPlayer.name}</h2>
                            {selectedPlayer.summonerName && (
                              <span className="text-sm text-white/40 font-medium tracking-tight">({selectedPlayer.summonerName})</span>
                            )}
                            <span className="text-[10px] text-viper font-bold border border-viper/30 px-1.5 py-0.5 rounded bg-viper/5 uppercase tracking-widest ml-1">
                              {selectedPlayer.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 uppercase text-[10px] font-bold text-white/40 mt-1 flex-wrap">
                            <span>소속팀</span>
                            <span className="text-[#00FF41] font-black mr-2">{selectedPlayer.teamName.replace('TEAM ', '')}</span>
                            <span className="text-white/20">|</span>
                            <span>입찰 포인트</span>
                            <span className="text-viper font-black font-mono">{selectedPlayer.tierScore} P</span>
                          </div>
                        </div>
                      </div>

                      {/* 헤더 우측: 토글 스위치만 남기고 우측 정렬 */}
                      <div className="flex items-center justify-end shrink-0 ml-auto" id="header-right-toggle-wrapper">
                        {/* 개인 세부 스탯 vs 포지션별 비교 토글 버튼 (ALL이 아닐 때만 등장) */}
                        {activeRole !== 'ALL' && (
                          <div className="flex bg-[#0A0A0A] rounded p-1 border border-[#222222]" id="stats-view-toggle">
                            <button
                              onClick={() => setChartSubMode('INDIVIDUAL')}
                              className={`px-3 py-1.5 rounded text-[11px] font-black tracking-wider transition-all whitespace-nowrap uppercase cursor-pointer ${
                                chartSubMode === 'INDIVIDUAL' 
                                  ? 'bg-[#222222] text-viper border border-viper/20 shadow-sm' 
                                  : 'text-white/45 hover:text-white/80'
                              }`}
                            >
                              개인 분석
                            </button>
                            <button
                              onClick={() => setChartSubMode('COMPARISON')}
                              className={`px-3 py-1.5 rounded text-[11px] font-black tracking-wider transition-all whitespace-nowrap uppercase cursor-pointer ${
                                chartSubMode === 'COMPARISON' 
                                  ? 'bg-[#222222] text-viper border border-viper/20 shadow-sm' 
                                  : 'text-white/45 hover:text-white/80'
                              }`}
                            >
                              포지션별 비교
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 차트 상세 영역 컨텐츠 (모드별 분기) */}
                    {chartSubMode === 'INDIVIDUAL' || activeRole === 'ALL' ? (
                      <div className="flex-grow flex flex-col xl:flex-row relative bg-[#0A0A0A] overflow-hidden" id="individual-analysis-panel">
                        {/* Radar Chart Panel */}
                        <div className="w-full xl:w-5/12 h-64 xl:h-full p-8 flex flex-col justify-center items-center shrink-0 border-b xl:border-b-0 border-[#222222]">
                          <span className="text-xs text-white/50 font-black uppercase tracking-widest mb-6">주요 지표 비교</span>
                          
                          {/* 지표 약어 설명 레이어 추가 */}
                          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2.5 mb-6 px-4 py-3 border-y border-white/[0.05] w-full max-w-md">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-viper">KDA</span>
                              <span className="text-[10px] text-white/45 font-bold uppercase tracking-tight">Kill·Death·Assist</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-viper">DPM</span>
                              <span className="text-[10px] text-white/45 font-bold uppercase tracking-tight">Dmg per Min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-viper">GPM</span>
                              <span className="text-[10px] text-white/45 font-bold uppercase tracking-tight">Gold per Min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-viper">CSM</span>
                              <span className="text-[10px] text-white/45 font-bold uppercase tracking-tight">CS per Min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-viper">DPG</span>
                              <span className="text-[10px] text-white/45 font-bold uppercase tracking-tight">Dmg per Gold</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-viper">DMG%</span>
                              <span className="text-[10px] text-white/45 font-bold uppercase tracking-tight">Dmg Share</span>
                            </div>
                          </div>

                          <div className="w-full h-full min-h-[240px] overflow-hidden">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={selectedPlayer.id}
                                initial={{ opacity: 0, scale: 0.88 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                                className="w-full h-full"
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#444" />
                                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#E0E0E0', fontSize: 12, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Radar name="역할 평균" dataKey="average" stroke="#444" fill="#333" fillOpacity={0.15} isAnimationActive={true} animationDuration={600} />
                                    <Radar name={selectedPlayer.name} dataKey="player" stroke="#00FF41" fill="#00FF41" fillOpacity={0.4} isAnimationActive={true} animationDuration={900} />
                                  </RadarChart>
                                </ResponsiveContainer>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Stats Grid & Recent Champions Panel */}
                        <div className="w-full xl:w-7/12 p-8 flex flex-col justify-between xl:border-l border-[#222222] bg-[#0A0A0A] h-full overflow-y-auto custom-scrollbar gap-6">
                          {/* 모스트 챔피언 구역 (승률 연산 적용) */}
                          {selectedPlayer.stats.mostPlayed && selectedPlayer.stats.mostPlayed.length > 0 && (
                            <div className="shrink-0 mb-4">
                              <h3 className="text-xs text-white/50 font-black tracking-widest uppercase mb-4 text-center xl:text-left">최근 사용 챔피언 및 승률</h3>
                              <div className="flex flex-wrap gap-3.5 justify-center xl:justify-start">
                                {selectedPlayer.stats.mostPlayed.map(champ => {
                                  const totalGames = champ.wins + champ.losses;
                                  const winRate = totalGames > 0 ? Math.round((champ.wins / totalGames) * 100) : 0;
                                  const isHighWr = winRate >= 60;
                                  return (
                                    <div key={champ.name} className="bg-[#111111] border border-[#222222] p-3 rounded-lg flex items-center gap-4 pr-5 transition-all hover:border-viper/40 group shadow-md shadow-black/20">
                                      <img 
                                        src={`https://ddragon.leagueoflegends.com/cdn/14.22.1/img/champion/${champ.id}.png`} 
                                        alt={champ.name} 
                                        className="w-11 h-11 rounded-lg border border-white/15 object-cover"
                                        onError={(e) => { e.currentTarget.src = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png'; }}
                                      />
                                      <div className="flex flex-col">
                                        <span className="text-xs font-black text-white tracking-tight">{champ.name}</span>
                                        <div className="flex items-center gap-3 mt-1">
                                          <span className="text-[11px] font-mono text-white/40">{champ.wins}승 {champ.losses}패</span>
                                          <span className={`text-[11px] font-black font-mono ${isHighWr ? 'text-viper' : 'text-neutral-400'}`}>
                                            {winRate}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          
                          {/* 세부 상세 지표 (평균 대비 인디케이터 바 구성) */}
                          <div className="flex-grow">
                            <h3 className="text-xs text-white/50 font-black tracking-widest uppercase mb-4 text-center xl:text-left">역할 평균 대비 스탯 비교</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              {radarData.map(stat => {
                                const isAbove = stat.player >= stat.average;
                                return (
                                  <div key={stat.metric} className="bg-[#111111] border border-[#222222] p-4 rounded-lg flex flex-col gap-3 hover:bg-white/[0.01] transition-all shadow-md">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-black tracking-wider text-white/80">{stat.metric}</span>
                                      <div className="flex items-center gap-2.5">
                                        <span className="text-sm font-black text-viper">{stat.metric === 'DMG%' ? `${stat.playerRaw}%` : stat.playerRaw}</span>
                                        <span className="text-[11px] text-white/40 font-semibold">/ 평균 {stat.avgRaw}</span>
                                      </div>
                                    </div>
                                    
                                    {/* 게이지 바 비주얼 트랙 */}
                                    <div className="relative w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                                      <div 
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-viper/40 to-viper rounded-full"
                                        style={{ width: `${stat.player}%` }}
                                      ></div>
                                    </div>

                                    <div className="flex justify-between text-[11px] font-bold text-white/20 tracking-tighter items-center mt-0.5">
                                      <span className="text-[9px] font-mono uppercase">min</span>
                                      <span className="text-white/40 font-bold">
                                        {isAbove ? (
                                          <span className="text-viper font-black text-[11px]">평균 돌파 (+{Math.max(0, Number(stat.playerRaw) - Number(stat.avgRaw)).toFixed(1)})</span>
                                        ) : (
                                          <span className="text-red-400 font-bold text-[11px]">평균 대비 (-{Math.max(0, Number(stat.avgRaw) - Number(stat.playerRaw)).toFixed(1)})</span>
                                        )}
                                      </span>
                                      <span className="text-[9px] font-mono uppercase">max</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 6-Player Position-based Comparison (Spans 100% of horizontal width of the card body) */
                      <div className="flex-grow p-6 flex flex-col gap-5 w-full bg-[#0A0A0A] overflow-y-auto custom-scrollbar h-full" id="positional-comparison-panel">
                        <div className="flex justify-between items-center shrink-0">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-4 bg-viper rounded-xs"></div>
                            <h3 className="text-xs font-black tracking-widest text-[#E0E0E0] uppercase flex items-center gap-1.5">
                              {activeRole} 포지션별 비교
                            </h3>
                          </div>
                          <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Day 1 Scrim comparison</span>
                        </div>

                        {/* 6-Player Comparison Matrix with Larger Panels (3x2 Layout) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6 flex-grow overflow-visible">
                          {sameRoleRepresentations.map((player, index) => {
                            const playerKda = player.kda;
                            const pRadarData = getRadarDataForPlayer(player);
                            
                            return (
                              <motion.div
                                key={player.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.04 }}
                                className="p-5.5 rounded-lg flex flex-col justify-between border bg-viper/[0.02]/10 border-viper/40 shadow-lg shadow-viper/4 hover:border-viper/80 hover:bg-viper/5 transition-all duration-300"
                              >
                                {/* Header Card Area */}
                                <div className="flex justify-between items-start mb-2.5">
                                  <div className="flex flex-col min-w-0 pr-1 gap-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm font-black truncate leading-tight text-white group-hover:text-viper transition-colors">
                                        {player.name}
                                      </span>
                                      <span className="text-[10px] bg-viper/10 border border-viper/30 px-1.5 py-0.5 rounded text-viper font-mono font-bold">
                                        {player.tierScore} P
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-white/50 truncate uppercase tracking-tight font-bold">
                                      {player.teamName.replace('TEAM ', '')}
                                    </span>
                                  </div>
                                  <span className={`text-[10px] font-black font-mono self-start px-2 py-0.5 rounded-sm ${
                                    playerKda >= 4 ? 'text-viper bg-viper/5' : playerKda >= 2.5 ? 'text-yellow-400 bg-yellow-400/5' : 'text-neutral-400 bg-white/5'
                                  }`}>
                                    {playerKda.toFixed(2)} KDA
                                  </span>
                                </div>

                                {/* Expanded Micro Radar Chart Embedded in Grid Container */}
                                <div className="w-full h-36 flex items-center justify-center my-2.5 overflow-hidden">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={pRadarData}>
                                      <PolarGrid stroke="#444" />
                                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#aaa', fontSize: 10, fontWeight: 'bold' }} />
                                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                                      <Radar name={player.name} dataKey="player" stroke="#00FF41" fill="#00FF41" fillOpacity={0.35} isAnimationActive={true} animationDuration={700} />
                                    </RadarChart>
                                  </ResponsiveContainer>
                                </div>

                                {/* Footer Stats summary line */}
                                <div className="flex justify-between items-center text-[11px] font-mono font-bold text-white/40 pt-2 border-t border-[#222222] mt-1.5">
                                  <span>DPM: <span className="text-white/80">{player.stats.dpm}</span></span>
                                  <span>DMG%: <span className="text-[#00FF41]">{player.stats.damagePercent}%</span></span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`card-bg rounded-lg border border-[#222222] flex flex-col items-center justify-center text-white/20 font-bold tracking-widest gap-2 bg-black/40 ${panelHeightClass}`}>
                    <ShieldAlert className="w-8 h-8 text-white/10 animate-pulse" />
                    <span>SELECT A PLAYER</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

