import { Team, Player, Role } from "./types";
import { useState, useMemo } from "react";
import { X, Trophy, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RawMatchRecord } from "./matchData";

interface TeamStatsProps {
  teams: Team[];
  rawMatches?: RawMatchRecord[];
}

interface MatchInfo {
  id: string;
  t1: string;
  t2: string;
  result: string;
}

const roleIconFallbacks = {
  TOP: [
    "https://s-lol-web.op.gg/images/icon/icon-position-top.svg",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/position_top.png",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/position-top.png",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/position-top.png",
  ],
  JGL: [
    "https://s-lol-web.op.gg/images/icon/icon-position-jng.svg",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/position_jungle.png",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/position-jungle.png",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/position-jungle.png",
  ],
  MID: [
    "https://s-lol-web.op.gg/images/icon/icon-position-mid.svg",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/position_mid.png",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/position-middle.png",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/position-middle.png",
  ],
  BOT: [
    "https://s-lol-web.op.gg/images/icon/icon-position-adc.svg",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/position_bottom.png",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/position-bottom.png",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/position-bottom.png",
  ],
  SUP: [
    "https://s-lol-web.op.gg/images/icon/icon-position-sup.svg",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/position_support.png",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/position-utility.png",
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/position-utility.png",
  ],
};

const RoleIcon = ({
  role,
  className = "w-4 h-4",
}: {
  role: Role;
  className?: string;
}) => {
  const [errorCount, setErrorCount] = useState(0);
  const fallbacks = roleIconFallbacks[role];
  const src = fallbacks[Math.min(errorCount, fallbacks.length - 1)];

  return (
    <div
      className={`relative ${className} shrink-0 flex items-center justify-center`}
    >
      <div
        className="absolute inset-0 bg-current transition-colors duration-300"
        style={{
          WebkitMaskImage: `url(${src})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskImage: `url(${src})`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
        }}
      />
      <img
        src={src}
        alt={role}
        className="opacity-0 w-full h-full object-contain"
        onError={(e) => {
          if (errorCount < fallbacks.length - 1) {
            setErrorCount((prev) => prev + 1);
          } else {
            e.currentTarget.style.display = "none";
          }
        }}
      />
    </div>
  );
};

const matchCSData: Record<
  string,
  Record<Role, { p1: number[]; p2: number[] }>
> = {
  "M1-1": {
    TOP: { p1: [205, 243], p2: [213, 241] },
    JGL: { p1: [226, 240], p2: [183, 215] },
    MID: { p1: [240, 264], p2: [263, 247] },
    BOT: { p1: [227, 256], p2: [232, 280] },
    SUP: { p1: [35, 45], p2: [34, 18] },
  },
  "M1-2": {
    TOP: { p1: [230, 227], p2: [245, 261] },
    JGL: { p1: [199, 197], p2: [225, 218] },
    MID: { p1: [263, 204], p2: [291, 293] },
    BOT: { p1: [269, 282], p2: [259, 244] },
    SUP: { p1: [45, 44], p2: [44, 38] },
  },
  "M1-3": {
    TOP: { p1: [145, 175], p2: [195, 192] },
    JGL: { p1: [159, 155], p2: [147, 141] },
    MID: { p1: [189, 193], p2: [147, 187] },
    BOT: { p1: [190, 187], p2: [203, 176] },
    SUP: { p1: [23, 24], p2: [27, 24] },
  },
  "M1-4": {
    TOP: { p1: [206, 202], p2: [188, 219] },
    JGL: { p1: [147, 184], p2: [160, 169] },
    MID: { p1: [180, 261], p2: [163, 252] },
    BOT: { p1: [154, 249], p2: [215, 191] },
    SUP: { p1: [30, 28], p2: [24, 18] },
  },
  "M1-5": {
    TOP: { p1: [266, 219], p2: [248, 269] },
    JGL: { p1: [214, 222], p2: [238, 234] },
    MID: { p1: [319, 297], p2: [298, 303] },
    BOT: { p1: [298, 316], p2: [293, 399] },
    SUP: { p1: [37, 33], p2: [34, 30] },
  },
  "M1-6": {
    TOP: { p1: [128, 266], p2: [148, 267] },
    JGL: { p1: [124, 189], p2: [99, 179] },
    MID: { p1: [168, 276], p2: [155, 254] },
    BOT: { p1: [140, 245], p2: [132, 245] },
    SUP: { p1: [22, 34], p2: [24, 25] },
  },
  "M1-7": {
    TOP: { p1: [241, 217], p2: [238, 157] },
    JGL: { p1: [202, 172], p2: [194, 193] },
    MID: { p1: [297, 188], p2: [265, 218] },
    BOT: { p1: [275, 243], p2: [286, 222] },
    SUP: { p1: [39, 24], p2: [31, 22] },
  },
  "M1-8": {
    TOP: { p1: [242, 231], p2: [144, 264] },
    JGL: { p1: [150, 272], p2: [151, 217] },
    MID: { p1: [151, 285], p2: [190, 243] },
    BOT: { p1: [229, 259], p2: [179, 292] },
    SUP: { p1: [29, 31], p2: [29, 65] },
  },
  // Day 2
  "M2-1": {
    TOP: { p1: [245, 173], p2: [256, 188] },
    JGL: { p1: [255, 148], p2: [295, 149] },
    MID: { p1: [351, 162], p2: [286, 193] },
    BOT: { p1: [312, 228], p2: [295, 236] },
    SUP: { p1: [31, 23], p2: [39, 21] },
  },
  "M2-2": {
    TOP: { p1: [263, 229], p2: [225, 188] },
    JGL: { p1: [204, 197], p2: [241, 195] },
    MID: { p1: [272, 259], p2: [222, 278] },
    BOT: { p1: [203, 266], p2: [263, 253] },
    SUP: { p1: [37, 30], p2: [23, 53] },
  },
  "M2-3": {
    TOP: { p1: [192, 270], p2: [232, 252] },
    JGL: { p1: [209, 234], p2: [185, 197] },
    MID: { p1: [272, 281], p2: [239, 266] },
    BOT: { p1: [239, 291], p2: [204, 284] },
    SUP: { p1: [22, 34], p2: [32, 51] },
  },
  "M2-4": {
    TOP: { p1: [195, 106], p2: [227, 130] },
    JGL: { p1: [201, 130], p2: [158, 103] },
    MID: { p1: [207, 144], p2: [179, 129] },
    BOT: { p1: [214, 145], p2: [241, 134] },
    SUP: { p1: [32, 25], p2: [15, 23] },
  },
  "M2-5": {
    TOP: { p1: [219, 197], p2: [210, 174] },
    JGL: { p1: [211, 151], p2: [214, 108] },
    MID: { p1: [246, 201], p2: [203, 186] },
    BOT: { p1: [279, 166], p2: [270, 169] },
    SUP: { p1: [44, 26], p2: [40, 26] },
  },
  "M2-6": {
    TOP: { p1: [240, 239], p2: [223, 259] },
    JGL: { p1: [236, 248], p2: [226, 241] },
    MID: { p1: [234, 302], p2: [219, 305] },
    BOT: { p1: [279, 290], p2: [303, 238] },
    SUP: { p1: [27, 29], p2: [38, 49] },
  },
  "M2-7": {
    TOP: { p1: [167, 260], p2: [179, 283] },
    JGL: { p1: [142, 216], p2: [131, 243] },
    MID: { p1: [167, 253], p2: [170, 237] },
    BOT: { p1: [165, 327], p2: [188, 317] },
    SUP: { p1: [21, 43], p2: [24, 37] },
  },
  "M2-8": {
    TOP: { p1: [169, 278], p2: [141, 256] },
    JGL: { p1: [148, 211], p2: [136, 262] },
    MID: { p1: [136, 250], p2: [151, 306] },
    BOT: { p1: [174, 237], p2: [176, 248] },
    SUP: { p1: [28, 33], p2: [21, 28] },
  },
  "M2-9": {
    TOP: { p1: [299, 253], p2: [401, 255] },
    JGL: { p1: [342, 238], p2: [197, 216] },
    MID: { p1: [400, 307], p2: [406, 323] },
    BOT: { p1: [334, 340], p2: [405, 399] },
    SUP: { p1: [43, 47], p2: [33, 26] },
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export function TeamStatsView({ teams, rawMatches }: TeamStatsProps) {
  const [selectedMatch, setSelectedMatch] = useState<MatchInfo | null>(null);
  const [selectedDay, setSelectedDay] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<number>(1);
  const [showAllSchedules, setShowAllSchedules] = useState(false);
  const [highlightTeam, setHighlightTeam] = useState<string>("ALL");

  const dayMatches = useMemo(() => {
    const result: Record<1 | 2 | 3, MatchInfo[]> = { 1: [], 2: [], 3: [] };
    if (!rawMatches || rawMatches.length === 0) return result;

    const matchWins: Record<string, Record<string, number>> = {};
    const matchTeams: Record<string, Set<string>> = {};

    rawMatches.forEach((match) => {
      if (!matchWins[match.matchId]) {
        matchWins[match.matchId] = {};
        matchTeams[match.matchId] = new Set();
      }
      matchTeams[match.matchId].add(match.teamName.replace("TEAM ", ""));
    });

    const matchWinners = new Set<string>();
    rawMatches.forEach((match) => {
      if (match.isWin) {
        matchWinners.add(
          `${match.matchId}_G${match.gameNum}_${match.teamName.replace("TEAM ", "")}`,
        );
      }
    });

    matchWinners.forEach((winKey) => {
      const [matchId, , teamName] = winKey.split("_");
      if (!matchWins[matchId][teamName]) matchWins[matchId][teamName] = 0;
      matchWins[matchId][teamName]++;
    });

    Object.keys(matchTeams).forEach((matchId) => {
      const teamNames = Array.from(matchTeams[matchId]);
      if (teamNames.length >= 2) {
        const t1 = teamNames[0];
        const t2 = teamNames[1];
        const t1Wins = matchWins[matchId][t1] || 0;
        const t2Wins = matchWins[matchId][t2] || 0;
        const matchInfo: MatchInfo = {
          id: matchId,
          t1,
          t2,
          result: `${t1Wins}:${t2Wins}`,
        };

        if (
          matchId.includes("1일차") ||
          matchId.startsWith("M1") ||
          matchId.includes("Day 1")
        )
          result[1].push(matchInfo);
        else if (
          matchId.includes("2일차") ||
          matchId.startsWith("M2") ||
          matchId.includes("Day 2")
        )
          result[2].push(matchInfo);
        else if (
          matchId.includes("3일차") ||
          matchId.startsWith("M3") ||
          matchId.includes("Day 3")
        )
          result[3].push(matchInfo);
        else {
          // Default to Day 1 if format is entirely unknown
          result[1].push(matchInfo);
        }
      }
    });

    result[1].sort((a, b) =>
      a.id.localeCompare(b.id, undefined, { numeric: true }),
    );
    result[2].sort((a, b) =>
      a.id.localeCompare(b.id, undefined, { numeric: true }),
    );
    result[3].sort((a, b) =>
      a.id.localeCompare(b.id, undefined, { numeric: true }),
    );

    return result;
  }, [rawMatches]);

  const handleDayChange = (newDay: 1 | 2 | 3) => {
    setDirection(newDay > selectedDay ? 1 : -1);
    setSelectedDay(newDay);
  };

  // Sort teams by wins, then by KDA
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.stats.wins !== a.stats.wins) return b.stats.wins - a.stats.wins;
    const aKda =
      (a.stats.kills + a.stats.assists) / Math.max(1, a.stats.deaths);
    const bKda =
      (b.stats.kills + b.stats.assists) / Math.max(1, b.stats.deaths);
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
    const dpgVal = player.stats.dpg || dpm / Math.max(1, gpm);
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
      dpgStr,
    };
  };

  const getTeamFromShortName = (shortName: string) => {
    return teams.find((t) => t.name.includes(shortName)) || null;
  };

  const selectedTeam1 = selectedMatch
    ? getTeamFromShortName(selectedMatch.t1)
    : null;
  const selectedTeam2 = selectedMatch
    ? getTeamFromShortName(selectedMatch.t2)
    : null;
  const roles: Role[] = ["TOP", "JGL", "MID", "BOT", "SUP"];
  const [selectedTeamForDetails, setSelectedTeamForDetails] =
    useState<Team | null>(null);

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      {/* Scrim Schedule Section - Balanced Grid with tabs & slide animations */}
      <div className="bg-gradient-to-r from-[#0E1E11]/90 via-[#061007]/95 to-[#040804]/90 border border-[#1b3d20]/50 rounded-xl p-4.5 shrink-0 shadow-[0_4px_30px_rgba(0,255,65,0.02)] flex flex-col gap-3.5 relative overflow-hidden">
        {/* Header containing title and Compacter Day Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10 p-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[12px] sm:text-[13px] font-black tracking-[0.2em] text-viper uppercase drop-shadow-[0_0_8px_rgba(0,255,65,0.25)]">
              Day {selectedDay} Scrim Schedule
            </h2>
            <button
              onClick={() => {
                setHighlightTeam("ALL");
                setShowAllSchedules(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10.5px] sm:text-[11px] font-bold text-viper/90 border border-viper/30 rounded bg-viper/5 hover:bg-viper/20 hover:border-viper/60 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,65,0.05)] cursor-pointer shrink-0"
              title="전체 일정 한눈에 보기"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>전체일정</span>
            </button>
          </div>

          {/* Custom Tabs */}
          <div className="flex items-center gap-1.5 bg-[#030603] border border-[#1B3F21]/45 p-1 rounded-lg">
            {([1, 2, 3] as const).map((day) => (
              <button
                key={day}
                onClick={() => handleDayChange(day)}
                className={`relative px-4 sm:px-5 py-1.5 text-[12px] font-black tracking-wider uppercase rounded-md transition-all duration-300 ${
                  selectedDay === day
                    ? "text-white"
                    : "text-white/50 hover:text-white/90"
                }`}
              >
                {selectedDay === day && (
                  <motion.div
                    layoutId="activeDayTab"
                    className="absolute inset-0 bg-gradient-to-r from-[#1E4D27] to-[#123118] border border-[#2e6e39]/60 rounded-md -z-10 shadow-[0_0_12px_rgba(0,255,65,0.12)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {day}일차
              </button>
            ))}
          </div>
        </div>

        {/* Sliding Area */}
        <div className="overflow-hidden relative min-h-[480px] md:min-h-[290px] xl:min-h-[90px] w-full">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={selectedDay}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="w-full relative z-10"
            >
              {dayMatches[selectedDay].length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-9 gap-2.5 sm:gap-3">
                  {dayMatches[selectedDay].map((match) => (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className="bg-[#030603]/85 border border-[#1B3F21]/30 p-3 rounded-xl flex flex-col gap-2 transition-all duration-300 hover:bg-[#071308] hover:border-viper/60 group shadow-md hover:shadow-[0_4px_12px_rgba(0,255,65,0.12)] cursor-pointer"
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[11px] font-black text-viper/60 group-hover:text-viper transition-colors">
                          {match.id}
                        </span>
                        <span className="text-[11px] font-bold text-white/50">
                          {match.result}
                        </span>
                      </div>
                      <div className="flex flex-col text-[13px] font-bold text-white/80 gap-1">
                        <div className="flex justify-between items-center h-4">
                          <span className="truncate group-hover:text-white transition-colors">
                            {match.t1}
                          </span>
                          {match.result !== "-" && (
                            <span
                              className={
                                match.result.split(":")[0] >
                                match.result.split(":")[1]
                                  ? "text-viper font-black"
                                  : "text-white/70 font-bold"
                              }
                            >
                              {match.result.split(":")[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center h-4">
                          <span className="truncate group-hover:text-white transition-colors">
                            {match.t2}
                          </span>
                          {match.result !== "-" && (
                            <span
                              className={
                                match.result.split(":")[1] >
                                match.result.split(":")[0]
                                  ? "text-viper font-black"
                                  : "text-white/70 font-bold"
                              }
                            >
                              {match.result.split(":")[1]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[480px] md:min-h-[290px] xl:min-h-[90px] py-5 sm:py-6 text-center border border-dashed border-[#1B3F21]/35 rounded-xl bg-gradient-to-b from-[#030603] to-[#081208]/20 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.03)_0%,transparent_70%)]" />
                  <span className="text-[9px] font-black text-viper/70 drop-shadow-[0_0_8px_rgba(0,255,65,0.3)] tracking-[0.25em] mb-1 uppercase">
                    Day {selectedDay} Scrims Preparing
                  </span>
                  <span className="text-[11px] text-white/40 font-semibold">
                    {selectedDay}일차 스크림 일정이 아직 등록되지 않았습니다
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Stats Scrollable Area - Clear Team Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-4 pr-2 custom-scrollbar animate-fade-in">
        {sortedTeams.map((team, index) => {
          const kda = (
            (team.stats.kills + team.stats.assists) /
            Math.max(1, team.stats.deaths)
          ).toFixed(2);
          const winRate = Math.round(
            (team.stats.wins / Math.max(1, team.stats.games)) * 100,
          );

          return (
            <div
              key={team.id}
              onClick={() => setSelectedTeamForDetails(team)}
              className="bg-gradient-to-b from-[#161616] to-[#0A0A0A] border border-white/[0.05] rounded-xl p-4 flex flex-col gap-1.5 transition-all duration-300 group shadow-xl hover:shadow-[0_12px_32px_rgba(0,0,0,0.7)] hover:border-viper/25 hover:z-30 relative cursor-pointer"
            >
              {/* Dynamic glowing bar at top of card */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-xl bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-viper transition-all duration-500 ease-out" />

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-viper/10 text-viper font-black text-[13px] border border-viper/20 shadow-[0_0_10px_rgba(0,255,65,0.05)] transition-all group-hover:scale-105 duration-300">
                      #{index + 1}
                    </div>
                    <h2 className="text-[15px] font-black tracking-widest text-[#E0E0E0] uppercase group-hover:text-white transition-colors duration-200">
                      {team.name}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-gradient-to-b from-[#1C1C1C] to-[#121212] p-2.5 rounded-xl border border-white/[0.03] flex flex-col justify-center transition-all group-hover:border-white/[0.06] duration-300">
                    <span className="stat-label mb-1 text-[10px] tracking-widest text-white/50 font-bold uppercase">
                      Record
                    </span>
                    <span className="text-[15px] font-black text-white">
                      {team.stats.wins}W {team.stats.losses}L
                    </span>
                    <span className="text-[11px] font-black text-viper mt-0.5">
                      {winRate}% WR
                    </span>
                  </div>
                  <div className="bg-gradient-to-b from-[#1C1C1C] to-[#121212] p-2.5 rounded-xl border border-white/[0.03] flex flex-col justify-center transition-all group-hover:border-white/[0.06] duration-300">
                    <span className="stat-label mb-1 text-[10px] tracking-widest text-white/50 font-bold uppercase">
                      K/D/A
                    </span>
                    <span className="text-[13px] font-black tracking-tight text-white/90 leading-tight">
                      {team.stats.kills}/{team.stats.deaths}/
                      {team.stats.assists}
                    </span>
                    <span className="text-[10px] text-white/40 font-bold mt-1">
                      TOTAL
                    </span>
                  </div>
                  <div className="bg-gradient-to-b from-[#1C1C1C] to-[#121212] p-2.5 rounded-xl border border-white/[0.03] flex flex-col justify-center transition-all group-hover:border-white/[0.06] duration-300">
                    <span className="stat-label mb-1 text-[10px] tracking-widest text-white/50 font-bold uppercase">
                      KDA
                    </span>
                    <span className="text-[17px] font-black text-viper leading-none">
                      {kda}
                    </span>
                    <span className="text-[10px] text-white/40 font-bold mt-1">
                      AVERAGE
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col border-t border-white/[0.05] pt-3 mt-2 relative z-10 w-full">
                <div className="text-[11px] font-black tracking-widest text-viper uppercase mb-2 drop-shadow-[0_0_6px_rgba(0,255,65,0.3)] flex items-center gap-1">
                  <span>상대전적 :</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5">
                  {team.headToHead.map((h2h) => {
                    return (
                      <div
                        key={h2h.opponentId}
                        className="flex justify-between items-center bg-[#101010]/60 border border-white/[0.03] py-1.5 px-2 rounded-lg hover:border-viper/30 hover:bg-[#0d130e]/40 transition-all duration-200 group/h2h"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-[3px] h-2.5 bg-white/20 rounded-full shrink-0 group-hover/h2h:bg-viper transition-all" />
                          <span className="text-[12px] font-bold text-white/70 group-hover/h2h:text-white transition-colors truncate">
                            vs {h2h.opponentName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] font-bold">
                          <span
                            className={
                              h2h.wins > 0
                                ? "text-viper font-black"
                                : "text-white/40"
                            }
                          >
                            {h2h.wins}W
                          </span>
                          <span className="text-white/30">-</span>
                          <span
                            className={
                              h2h.losses > 0
                                ? "text-red-400 font-extrabold"
                                : "text-white/40"
                            }
                          >
                            {h2h.losses}L
                          </span>
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
      {selectedMatch &&
        selectedTeam1 &&
        selectedTeam2 &&
        (() => {
          const team1H2H = selectedTeam1.headToHead.find(
            (h) => h.opponentId === selectedTeam2.id,
          );
          const team2H2H = selectedTeam2.headToHead.find(
            (h) => h.opponentId === selectedTeam1.id,
          );

          const matchSpecificRecords = rawMatches?.filter(m => m.matchId === selectedMatch.id) || [];
          const t1SpecificRecords = matchSpecificRecords.filter(m => m.teamName.includes(selectedMatch.t1));
          const t2SpecificRecords = matchSpecificRecords.filter(m => m.teamName.includes(selectedMatch.t2));

          const t1TotalKills = t1SpecificRecords.reduce((sum, r) => sum + r.kills, 0);
          const t1TotalDeaths = t1SpecificRecords.reduce((sum, r) => sum + r.deaths, 0);
          const t1TotalAssists = t1SpecificRecords.reduce((sum, r) => sum + r.assists, 0);
          const t1TotalGold = t1SpecificRecords.reduce((sum, r) => sum + r.gold, 0);

          const t2TotalKills = t2SpecificRecords.reduce((sum, r) => sum + r.kills, 0);
          const t2TotalDeaths = t2SpecificRecords.reduce((sum, r) => sum + r.deaths, 0);
          const t2TotalAssists = t2SpecificRecords.reduce((sum, r) => sum + r.assists, 0);
          const t2TotalGold = t2SpecificRecords.reduce((sum, r) => sum + r.gold, 0);

          const t1KdaRes = ((t1TotalKills + t1TotalAssists) / Math.max(1, t1TotalDeaths)).toFixed(2);
          const t2KdaRes = ((t2TotalKills + t2TotalAssists) / Math.max(1, t2TotalDeaths)).toFixed(2);
          const t1GoldK = (t1TotalGold / 1000).toFixed(0) + 'K';
          const t2GoldK = (t2TotalGold / 1000).toFixed(0) + 'K';

          return (
            <div
              id="match-details-overlay"
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
              onClick={() => setSelectedMatch(null)}
            >
              <div
                id="match-details-container"
                className="relative w-full max-w-4xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-white/[0.08] rounded-2xl shadow-[0_0_80px_rgba(0,255,65,0.08)] overflow-hidden flex flex-col max-h-[90vh]"
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
                      MATCH REVIEW &amp; ANALYSIS • {selectedMatch.id}
                    </span>

                    {/* Scoreboard line */}
                    <div className="flex items-center justify-between w-full mt-4 px-2">
                      {/* Left Team block */}
                      <div className="flex-1 flex items-center justify-end gap-x-4">
                        <div className="hidden sm:flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl px-4 py-2 bg-white/[0.015] min-w-[90px] backdrop-blur-[1px]">
                           <span className="text-[9px] font-black text-viper/50 uppercase tracking-tighter mb-0.5">TEAM KDA</span>
                           <span className="text-[13px] font-mono font-black text-white">{t1KdaRes}</span>
                           <div className="w-full h-[1px] bg-white/5 my-1.5"></div>
                           <span className="text-[9px] font-black text-viper/50 uppercase tracking-tighter mb-0.5">TEAM GOLD</span>
                           <span className="text-[13px] font-mono font-black text-white">{t1GoldK}</span>
                        </div>
                        <div className="text-right flex flex-col items-end pr-3">
                          <span className="text-base font-black text-[#E0E0E0] uppercase tracking-wide">
                            {selectedTeam1.name}
                          </span>
                          <div className="flex flex-col text-[11px] mt-1.5 text-white/40 leading-tight">
                            <div>
                              총전적:{" "}
                              <span className="text-white/80 font-bold">
                                {selectedTeam1.stats.wins}승{" "}
                                {selectedTeam1.stats.losses}패
                              </span>
                              <span className="text-viper font-black ml-1">
                                (
                                {Math.round(
                                  (selectedTeam1.stats.wins /
                                    Math.max(1, selectedTeam1.stats.games)) *
                                    100,
                                )}
                                %)
                              </span>
                            </div>
                            <div className="mt-0.5">
                              상대전적:{" "}
                              <span className="text-viper font-black">
                                {team1H2H
                                  ? `${team1H2H.wins}승 ${team1H2H.losses}패`
                                  : "0승 0패"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SCORE DIVIDER */}
                      <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] py-2 px-5 rounded-2xl shrink-0">
                        <span className="text-2xl font-black text-white px-1">
                          {selectedMatch.result.split(":")[0]}
                        </span>
                        <span className="text-white/20 font-black text-lg">
                          :
                        </span>
                        <span className="text-2xl font-black text-white px-1">
                          {selectedMatch.result.split(":")[1]}
                        </span>
                      </div>

                      {/* Right Team block */}
                      <div className="flex-1 flex items-center justify-start gap-x-4">
                        <div className="text-left flex flex-col items-start pl-3">
                          <span className="text-lg font-black text-[#E0E0E0] uppercase tracking-wide">
                            {selectedTeam2.name}
                          </span>
                          <div className="flex flex-col text-xs mt-1.5 text-white/40 leading-tight">
                            <div>
                              총전적:{" "}
                              <span className="text-white/80 font-bold">
                                {selectedTeam2.stats.wins}승{" "}
                                {selectedTeam2.stats.losses}패
                              </span>
                              <span className="text-viper font-black ml-1">
                                (
                                {Math.round(
                                  (selectedTeam2.stats.wins /
                                    Math.max(1, selectedTeam2.stats.games)) *
                                    100,
                                )}
                                %)
                              </span>
                            </div>
                            <div className="mt-0.5">
                              상대전적:{" "}
                              <span className="text-viper font-black">
                                {team2H2H
                                  ? `${team2H2H.wins}승 ${team2H2H.losses}패`
                                  : "0승 0패"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl px-4 py-2 bg-white/[0.015] min-w-[90px] backdrop-blur-[1px]">
                           <span className="text-[9px] font-black text-viper/50 uppercase tracking-tighter mb-0.5">TEAM KDA</span>
                           <span className="text-[13px] font-mono font-black text-white">{t2KdaRes}</span>
                           <div className="w-full h-[1px] bg-white/5 my-1.5"></div>
                           <span className="text-[9px] font-black text-viper/50 uppercase tracking-tighter mb-0.5">TEAM GOLD</span>
                           <span className="text-[13px] font-mono font-black text-white">{t2GoldK}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Position line comparison scrollable body */}
                <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4 custom-scrollbar bg-[#0C0C0C]/50">
                  {roles.map((role) => {
                    const p1 = selectedTeam1.players.find(
                      (p) => p.role === role,
                    );
                    const p2 = selectedTeam2.players.find(
                      (p) => p.role === role,
                    );

                    if (!p1 || !p2) return null;

                    const csRecord = matchCSData[selectedMatch.id]?.[role];
                    const p1AvgCs = csRecord
                      ? Number(
                          (
                            csRecord.p1.reduce((sum, val) => sum + val, 0) /
                            csRecord.p1.length
                          ).toFixed(1),
                        )
                      : 0;
                    const p2AvgCs = csRecord
                      ? Number(
                          (
                            csRecord.p2.reduce((sum, val) => sum + val, 0) /
                            csRecord.p2.length
                          ).toFixed(1),
                        )
                      : 0;

                    const p1Stats = getPlayerDetailedStats(p1);
                    const p2Stats = getPlayerDetailedStats(p2);

                    // Highlight winner criteria (higher is better)
                    const isP1TierBetter =
                      p1Stats.tierScore > p2Stats.tierScore;
                    const isP2TierBetter =
                      p2Stats.tierScore > p1Stats.tierScore;
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
                    const p1Score =
                      (isP1KdaBetter ? 1 : 0) +
                      (isP1DpmBetter ? 1 : 0) +
                      (isP1GpmBetter ? 1 : 0) +
                      (isP1DmgBetter ? 1 : 0) +
                      (isP1TierBetter ? 1 : 0) +
                      (isP1DpgBetter ? 1 : 0) +
                      (isP1CsBetter ? 1 : 0);

                    const p2Score =
                      (isP2KdaBetter ? 1 : 0) +
                      (isP2DpmBetter ? 1 : 0) +
                      (isP2GpmBetter ? 1 : 0) +
                      (isP2DmgBetter ? 1 : 0) +
                      (isP2TierBetter ? 1 : 0) +
                      (isP2DpgBetter ? 1 : 0) +
                      (isP2CsBetter ? 1 : 0);

                    const renderStatCard = (
                      label: string,
                      value: string | number,
                      isBetter: boolean,
                    ) => (
                      <div
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded border transition-all duration-300 ${
                          isBetter
                            ? "bg-gradient-to-b from-[#113117] to-[#0A1F0E] border-viper/40 shadow-[0_0_12px_rgba(0,255,65,0.15)] bg-opacity-95"
                            : "bg-[#101010]/80 border-white/[0.04]"
                        }`}
                      >
                        <span
                          className={`text-[8px] sm:text-[9px] font-light uppercase tracking-widest leading-none mb-1.5 ${
                            isBetter ? "text-viper/70" : "text-white/30"
                          }`}
                        >
                          {label}
                        </span>
                        <span
                          className={`font-mono text-[11px] sm:text-[13px] font-bold leading-none ${
                            isBetter
                              ? "text-white drop-shadow-[0_0_4px_rgba(0,255,65,0.3)]"
                              : "text-white/45"
                          }`}
                        >
                          {value}
                        </span>
                      </div>
                    );

                    return (
                      <div
                        key={role}
                        className={`relative border rounded-xl px-4 py-3 transition-all duration-300 overflow-hidden ${
                          p1Score > p2Score
                            ? "border-viper/15 bg-gradient-to-r from-viper/[0.03] via-[#101010]/95 to-[#0b0c0b]/70 shadow-[0_0_20px_rgba(0,255,65,0.03)]"
                            : p2Score > p1Score
                              ? "border-viper/15 bg-gradient-to-l from-viper/[0.03] via-[#101010]/95 to-[#0b0c0b]/70 shadow-[0_0_20px_rgba(0,255,65,0.03)]"
                              : "border-white/[0.04] bg-[#121212]/70"
                        }`}
                      >
                        {/* Aura Ambient Background Glow for superior player */}
                        {p1Score > p2Score && (
                          <>
                            <div className="absolute top-0 bottom-0 left-0 w-[45%] advantage-highlight pointer-events-none blur-[2px]" />
                            <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-viper via-viper/50 to-transparent shadow-[0_0_12px_rgba(0,255,65,0.8)]" />
                          </>
                        )}
                        {p2Score > p1Score && (
                          <>
                            <div className="absolute top-0 bottom-0 right-0 w-[45%] advantage-highlight pointer-events-none blur-[2px]" />
                            <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-viper via-viper/50 to-transparent shadow-[0_0_12px_rgba(0,255,65,0.8)]" />
                          </>
                        )}

                        {/* Single Compact Container - Grid based to prevent overlap entirely */}
                        <div
                          id={`match-role-${role}-row`}
                          className="relative z-10 grid grid-cols-[75px_1fr_44px_1fr_75px] sm:grid-cols-[100px_1fr_60px_1fr_100px] justify-between items-center gap-3 sm:gap-6 w-full"
                        >
                          {/* 1. Left Player */}
                          <div className="text-left flex items-center min-w-0 pr-1">
                            <span
                              className={`text-[13px] sm:text-[15px] font-black tracking-wide transition-colors truncate max-w-full block ${p1Score > p2Score ? "text-viper drop-shadow-[0_0_6px_rgba(0,255,65,0.4)]" : "text-[#E0E0E0]"}`}
                            >
                              {p1.name}
                            </span>
                          </div>

                          {/* 2. Left Player Stats Area */}
                          <div className="grid grid-cols-6 gap-1 sm:gap-1.5 text-center min-w-0 select-none">
                            {renderStatCard(
                              "KDA",
                              p1Stats.kdaStr,
                              isP1KdaBetter,
                            )}
                            {renderStatCard("DPM", p1Stats.dpm.toString(), isP1DpmBetter)}
                            {renderStatCard(
                              "GPM",
                              Math.round(p1Stats.gpm).toString(),
                              isP1GpmBetter,
                            )}
                            {renderStatCard(
                              "DPG",
                              p1Stats.dpgStr,
                              isP1DpgBetter,
                            )}
                            {renderStatCard(
                              "DMG%",
                              `${p1Stats.dmgPct}%`,
                              isP1DmgBetter,
                            )}
                            {renderStatCard(
                              "CS",
                              csRecord ? p1AvgCs.toString() : "-",
                              isP1CsBetter,
                            )}
                          </div>

                          {/* 3. Center Position Icon with Role name */}
                          <div
                            id={`match-role-${role}-badge`}
                            className="flex flex-col items-center justify-center shrink-0 select-none"
                          >
                            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-b from-[#252525] to-[#0a0a0a] border border-white/[0.08] flex items-center justify-center text-white shadow-md">
                              <RoleIcon
                                role={role}
                                className="w-4 sm:w-4.5 h-4 sm:h-4.5 text-white/90"
                              />
                            </div>
                            <span className="text-[9px] sm:text-[10.5px] font-black text-viper/85 tracking-wider uppercase mt-1.5 drop-shadow-[0_0_4px_rgba(0,255,65,0.25)]">
                              {role}
                            </span>
                          </div>

                          {/* 4. Right Player Stats Area */}
                          <div className="grid grid-cols-6 gap-1 sm:gap-1.5 text-center min-w-0 select-none">
                            {renderStatCard(
                              "KDA",
                              p2Stats.kdaStr,
                              isP2KdaBetter,
                            )}
                            {renderStatCard("DPM", p2Stats.dpm.toString(), isP2DpmBetter)}
                            {renderStatCard(
                              "GPM",
                              Math.round(p2Stats.gpm).toString(),
                              isP2GpmBetter,
                            )}
                            {renderStatCard(
                              "DPG",
                              p2Stats.dpgStr,
                              isP2DpgBetter,
                            )}
                            {renderStatCard(
                              "DMG%",
                              `${p2Stats.dmgPct}%`,
                              isP2DmgBetter,
                            )}
                            {renderStatCard(
                              "CS",
                              csRecord ? p2AvgCs.toString() : "-",
                              isP2CsBetter,
                            )}
                          </div>

                          {/* 5. Right Player */}
                          <div className="text-right flex items-center justify-end min-w-0 pl-1">
                            <span
                              className={`text-[13px] sm:text-[15px] font-black tracking-wide transition-colors truncate max-w-full block ${p2Score > p1Score ? "text-viper drop-shadow-[0_0_6px_rgba(0,255,65,0.4)]" : "text-[#E0E0E0]"}`}
                            >
                              {p2.name}
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

      {/* Full Scrim Schedules Overlay Modal */}
      {showAllSchedules && (
        <div
          id="all-schedules-overlay"
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => setShowAllSchedules(false)}
        >
          <div
            id="all-schedules-container"
            className="relative w-full max-w-5xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-white/[0.08] rounded-2xl shadow-[0_0_85px_rgba(0,255,65,0.12)] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-white/[0.05] bg-[#0c0c0c]/80 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-viper drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]" />
                <h3 className="text-[13.5px] sm:text-[15px] font-black tracking-widest text-[#E0E0E0] uppercase">
                  전체 스크림 일정 한눈에 보기
                </h3>
              </div>

              {/* Filter Area & Close button */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#030603] border border-[#1b3d20]/40 rounded-lg px-2.5 py-1.5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)]">
                  <span className="text-[11px] text-viper/70 font-extrabold uppercase tracking-wider hidden sm:inline">
                    팀 필터:
                  </span>
                  <select
                    value={highlightTeam}
                    onChange={(e) => setHighlightTeam(e.target.value)}
                    className="bg-transparent text-[11.5px] font-black text-white outline-none cursor-pointer pr-1 focus:ring-0 select-none uppercase tracking-wide"
                  >
                    <option value="ALL" className="bg-[#0c0c0c] text-white">
                      전체 팀 보기
                    </option>
                    {teams.map((t) => {
                      const cleanName = t.name.replace("TEAM ", "").trim();
                      return (
                        <option
                          key={t.id}
                          value={cleanName}
                          className="bg-[#0c0c0c] text-white"
                        >
                          {t.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <button
                  onClick={() => setShowAllSchedules(false)}
                  className="p-1.5 text-white/40 hover:text-white/80 hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {([1, 2, 3] as const).map((day) => {
                  const matches = dayMatches[day];
                  return (
                    <div
                      key={day}
                      className="flex flex-col gap-4 bg-[#0a0f0a]/30 border border-[#1b3d20]/15 p-4 rounded-xl min-h-[300px]"
                    >
                      {/* Day Header */}
                      <div className="flex items-center justify-between border-b border-[#1b3d20]/30 pb-2.5">
                        <span className="text-[11.5px] font-black text-viper tracking-[0.15em] uppercase drop-shadow-[0_0_6px_rgba(0,255,65,0.2)]">
                          DAY {day} SCHEDULE
                        </span>
                        <span className="text-[11px] text-white/40 font-bold">
                          {matches.length} matches
                        </span>
                      </div>

                      {/* Day Match List */}
                      <div className="flex flex-col gap-2.5">
                        {matches.length > 0 ? (
                          matches.map((match) => {
                            // 필터링 시 팀의 이름과 매치에 기록된 텍스트가 정확히 일치하는지 확인 (공백 제거 포함)
                            const isSelectedTeamInMatch =
                              highlightTeam !== "ALL" &&
                              (match.t1.trim() === highlightTeam.trim() ||
                                match.t2.trim() === highlightTeam.trim());
                            const isDimmed =
                              highlightTeam !== "ALL" && !isSelectedTeamInMatch;

                            return (
                              <div
                                key={match.id}
                                onClick={() => {
                                  setSelectedMatch(match);
                                }}
                                className={`p-3 rounded-lg flex flex-col gap-2 border transition-all duration-300 cursor-pointer ${
                                  isSelectedTeamInMatch
                                    ? "bg-gradient-to-b from-[#113117] to-[#0A1F0E] border-viper shadow-[0_0_15px_rgba(0,255,65,0.25)] scale-[1.02] ring-1 ring-viper/50 z-10"
                                    : isDimmed
                                      ? "bg-[#030603]/10 border-[#1B3F21]/10 opacity-20 scale-[0.98]"
                                      : "bg-[#030603]/85 border-[#1B3F21]/30 hover:bg-[#071308] hover:border-viper/60"
                                }`}
                              >
                                <div className="flex justify-between items-center mb-0.5">
                                  <span
                                    className={`text-[11px] font-black transition-colors ${
                                      isSelectedTeamInMatch
                                        ? "text-viper drop-shadow-[0_0_4px_rgba(0,255,65,0.3)]"
                                        : "text-viper/60"
                                    }`}
                                  >
                                    {match.id}
                                  </span>
                                  <span
                                    className={`text-[11px] font-bold ${
                                      isSelectedTeamInMatch
                                        ? "text-white/80"
                                        : "text-white/50"
                                    }`}
                                  >
                                    {match.result}
                                  </span>
                                </div>

                                <div
                                  className={`flex flex-col text-[13px] font-bold gap-1 transition-colors ${
                                    isSelectedTeamInMatch
                                      ? "text-white"
                                      : "text-white/80"
                                  }`}
                                >
                                  <div className="flex justify-between items-center h-4">
                                    <span
                                      className={`truncate transition-all ${
                                        highlightTeam !== "ALL" &&
                                        match.t1 === highlightTeam
                                          ? "text-viper font-black pl-1"
                                          : ""
                                      }`}
                                    >
                                      {match.t1}
                                    </span>
                                    {match.result !== "-" && (
                                      <span
                                        className={
                                          match.result.split(":")[0] >
                                          match.result.split(":")[1]
                                            ? "text-viper font-black"
                                            : "text-white/60 font-medium"
                                        }
                                      >
                                        {match.result.split(":")[0]}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex justify-between items-center h-4">
                                    <span
                                      className={`truncate transition-all ${
                                        highlightTeam !== "ALL" &&
                                        match.t2 === highlightTeam
                                          ? "text-viper font-black pl-1"
                                          : ""
                                      }`}
                                    >
                                      {match.t2}
                                    </span>
                                    {match.result !== "-" && (
                                      <span
                                        className={
                                          match.result.split(":")[1] >
                                          match.result.split(":")[0]
                                            ? "text-viper font-black"
                                            : "text-white/60 font-medium"
                                        }
                                      >
                                        {match.result.split(":")[1]}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-12 px-4 text-center border border-dashed border-[#1B3F21]/20 rounded-xl bg-[#030603]/45 flex flex-col items-center justify-center gap-1.5 mt-2">
                            <span className="text-[10px] font-black text-viper/50 drop-shadow-[0_0_4px_rgba(0,255,65,0.15)] tracking-widest uppercase">
                              DAY 3 SCRIMS PREPARING
                            </span>
                            <span className="text-[11px] text-white/35 font-medium">
                              스크림 일정이 아직 등록되지 않았습니다
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Details Modal */}
      {selectedTeamForDetails &&
        (() => {
          const team = selectedTeamForDetails;
          const rank = sortedTeams.findIndex((t) => t.id === team.id) + 1;
          const kda = (
            (team.stats.kills + team.stats.assists) /
            Math.max(1, team.stats.deaths)
          ).toFixed(2);
          const winRate = Math.round(
            (team.stats.wins / Math.max(1, team.stats.games)) * 100,
          );

          const topDmgPlayer = [...team.players].sort(
            (a, b) => b.stats.damagePercent - a.stats.damagePercent,
          )[0];
          const topGoldPlayer = [...team.players].sort(
            (a, b) => b.stats.gpm - a.stats.gpm,
          )[0];

          const teamGpm = team.players.reduce((sum, p) => sum + p.stats.gpm, 0);
          const allTeamsGpm = teams.map((t) =>
            t.players.reduce((sum, p) => sum + p.stats.gpm, 0),
          );
          const avgOverallGpm =
            allTeamsGpm.reduce((sum, val) => sum + val, 0) / allTeamsGpm.length;
          const avgGoldDiff = Math.round((teamGpm - avgOverallGpm) * 30);
          const isGoldAdv = avgGoldDiff >= 0;

          const getLineDomRate = (player: Player) => {
            const sameRolePlayers = teams
              .flatMap((t) => t.players)
              .filter((p) => p.role === player.role);
            if (sameRolePlayers.length === 0) return 50;
            const avgKda =
              sameRolePlayers.reduce(
                (sum, p) =>
                  sum +
                  (p.stats.kills + p.stats.assists) /
                    Math.max(1, p.stats.deaths),
                0,
              ) / sameRolePlayers.length;
            const avgDpm =
              sameRolePlayers.reduce((sum, p) => sum + p.stats.dpm, 0) /
              sameRolePlayers.length;
            const avgCsm =
              sameRolePlayers.reduce((sum, p) => sum + p.stats.csm, 0) /
              sameRolePlayers.length;

            const pKda =
              (player.stats.kills + player.stats.assists) /
              Math.max(1, player.stats.deaths);
            const score =
              pKda / avgKda +
              player.stats.dpm / avgDpm +
              player.stats.csm / Math.max(0.1, avgCsm);
            return Math.max(10, Math.min(95, Math.round((score / 3) * 50)));
          };

          return (
            <div
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
              onClick={() => setSelectedTeamForDetails(null)}
            >
              <div
                className="bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-white/[0.08] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[0_0_80px_rgba(0,255,65,0.08)] relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/[0.06] bg-[#0F0F0F]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-black bg-viper/10 text-viper border border-viper/30 tracking-wider">
                      RANK #{rank}
                    </div>
                    <div>
                      <h2 className="text-[17px] font-black text-white uppercase tracking-wider m-0 leading-none">
                        {team.name.replace("TEAM", "").trim()}{" "}
                        <span className="text-white/30 text-[13px]">
                          TEAM SQUAD
                        </span>
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTeamForDetails(null)}
                    className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-5 bg-[#0C0C0C]/50">
                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[#111111]/80 border border-white/[0.04] p-3 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black text-white/40 tracking-wider uppercase mb-0.5">
                        매치 승패
                      </span>
                      <span className="text-[15px] sm:text-[17px] font-black text-[#E5E5E5]">
                        {team.stats.wins}W {team.stats.losses}L
                      </span>
                    </div>
                    <div className="bg-[#111111]/80 border border-white/[0.04] p-3 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black text-white/40 tracking-wider uppercase mb-0.5">
                        세트 승률
                      </span>
                      <span className="text-[15px] sm:text-[17px] font-black text-viper">
                        {winRate}%
                      </span>
                    </div>
                    <div className="bg-[#111111]/80 border border-white/[0.04] p-3 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black text-white/40 tracking-wider uppercase mb-0.5">
                        팀 평균 KDA
                      </span>
                      <span className="text-[15px] sm:text-[17px] font-black text-[#E5E5E5]">
                        {kda}
                      </span>
                    </div>
                    <div className="bg-[#111111]/80 border border-white/[0.04] p-3 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
                      <span className="text-[10px] font-black text-white/40 tracking-wider uppercase mb-0.5 text-center leading-none">
                        평균 골드 격차
                      </span>
                      <span
                        className={`text-[15px] sm:text-[17px] font-black ${isGoldAdv ? "text-viper" : "text-red-400"}`}
                      >
                        {isGoldAdv ? "+" : ""}
                        {avgGoldDiff.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Team Leaders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-[#101010]/90 border border-viper/10 px-4 py-2.5 rounded-xl flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-viper tracking-wider uppercase mb-0.5">
                          팀내 데미지 비중 1위
                        </span>
                        <span className="text-[13px] font-bold text-white/90">
                          {topDmgPlayer.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[19px] font-black text-[#E5E5E5]">
                          {topDmgPlayer.stats.damagePercent}%
                        </span>
                        <span className="block text-[9px] text-[#A0A0A0] font-bold uppercase leading-none">
                          비중
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#101010]/90 border border-[#d4af37]/20 px-4 py-2.5 rounded-xl flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#d4af37] tracking-wider uppercase mb-0.5">
                          팀내 획득골드 1위
                        </span>
                        <span className="text-[13px] font-bold text-white/90">
                          {topGoldPlayer.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[19px] font-black text-[#e8c85c]">
                          {topGoldPlayer.stats.gpm}
                        </span>
                        <span className="block text-[9px] text-[#A0A0A0] font-bold uppercase leading-none">
                          GPM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Player Breakdown Table */}
                  <div className="mt-1">
                    <h3 className="text-[11px] font-black text-white/50 tracking-wider uppercase mb-2.5 pl-1">
                      라인별 핵심 통계
                    </h3>
                    <div className="bg-[#111111]/40 border border-white/[0.04] rounded-xl overflow-hidden">
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="border-b border-white/[0.06] text-[11px] font-black text-white/40 tracking-wider uppercase bg-[#141414]/80">
                              <th className="py-2.5 px-4 w-[75px]">포지션</th>
                              <th className="py-2.5 px-4 w-[95px]">
                                참가자명
                              </th>
                              <th className="py-2.5 px-4 w-[105px]">
                                세트우위 비율
                              </th>
                              <th className="py-2.5 px-4">챔피언픽 (승/패)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.03]">
                            {roles.map((role) => {
                              const player = team.players.find(
                                (p) => p.role === role,
                              );
                              if (!player) return null;
                              const domRate = getLineDomRate(player);
                              const topChamps = [
                                ...(player.stats.mostPlayed || []),
                              ]
                                .sort((a, b) => {
                                  const totalA =
                                    (a.wins || 0) + (a.losses || 0);
                                  const totalB =
                                    (b.wins || 0) + (b.losses || 0);
                                  if (totalB !== totalA) return totalB - totalA;
                                  return (b.wins || 0) - (a.wins || 0);
                                })
                                .slice(0, 5);

                              return (
                                <tr
                                  key={role}
                                  className="hover:bg-white/[0.01] transition-colors"
                                >
                                  <td className="py-2 px-4 align-middle">
                                    <div className="flex items-center gap-1.5">
                                      <RoleIcon
                                        role={role}
                                        className="w-4 h-4 text-viper"
                                      />
                                      <span className="text-[11px] font-black text-white/60 tracking-wider uppercase">
                                        {role}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-4 align-middle text-[13px] font-bold text-white/90">
                                    {player.name}
                                  </td>
                                  <td className="py-2 px-4 align-middle">
                                    <div className="flex items-center gap-0.5 whitespace-nowrap min-w-[70px]">
                                      <span className="text-[13px] font-black text-viper">
                                        {domRate}
                                      </span>
                                      <span className="text-[10px] text-viper/50 font-bold">
                                        %
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-4 align-middle">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {topChamps.length > 0 ? (
                                        topChamps
                                          .slice(0, 5)
                                          .map((champ, idx) => (
                                              <div
                                                key={idx}
                                                className="flex items-center gap-1.5 bg-[#161616] border border-white/[0.05] py-0.5 px-1.5 rounded text-[10px] select-none hover:border-viper/30 hover:bg-[#1a1a1a] transition-all group/champ"
                                                title={champ.name}
                                              >
                                              <img
                                                src={
                                                  champ.id === "Unknown"
                                                    ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1zaXplPSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPj88L3RleHQ+PC9zdmc+"
                                                    : `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${champ.id}.png`
                                                }
                                                alt={champ.name}
                                                className="w-6 h-6 rounded-sm object-cover border border-white/5 group-hover/champ:scale-110 transition-transform"
                                                loading="lazy"
                                                decoding="async"
                                                crossOrigin="anonymous"
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                  if (champ.id !== "Unknown") {
                                                    (
                                                      e.target as HTMLImageElement
                                                    ).src =
                                                      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1zaXplPSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPj88L3RleHQ+PC9zdmc+";
                                                  }
                                                }}
                                              />
                                              <span className="text-white/60 font-mono font-bold leading-none">
                                                {champ.wins}W {champ.losses}L
                                              </span>
                                            </div>
                                          ))
                                      ) : (
                                        <span className="text-[11px] text-white/20 font-medium">
                                          기록 없음
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
