/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { calculateStats } from './data';
import { rawMatchRecords, RawMatchRecord } from './matchData';
import { TeamStatsView } from './TeamStats';
import { PlayerStatsView } from './PlayerStats';
import { Trophy, Users, Activity, RefreshCcw } from 'lucide-react';
import { Team } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'TEAM' | 'PLAYER'>('TEAM');
  const [teams, setTeams] = useState<Team[]>([]);
  const [rawMatches, setRawMatches] = useState<RawMatchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoReason, setDemoReason] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    setErrorDetails(null);
    try {
      const response = await fetch('/api/matches');
      if (!response.ok) {
        const data = await response.json();
        setErrorDetails(data.details || null);
        throw new Error(data.error || '데이터를 가져오지 못했습니다.');
      }
      const matches = await response.json();
      if (Array.isArray(matches) && matches.length > 0) {
        setRawMatches(matches);
        setTeams(calculateStats(matches));
        setIsDemoMode(false);
        setDemoReason(null);
      } else if (matches && matches.warning) {
        setError(matches.warning);
        setErrorDetails(`[가져온 첫 3개 행 샘플]:\n${JSON.stringify(matches.sampleRows, null, 2)}`);
        setRawMatches(rawMatchRecords);
        setTeams(calculateStats(rawMatchRecords));
        setIsDemoMode(true);
        setDemoReason(matches.warning);
      } else {
        console.warn("Sheet is empty, falling back to local demo data.");
        setRawMatches(rawMatchRecords);
        setTeams(calculateStats(rawMatchRecords));
        setIsDemoMode(true);
        setDemoReason("구글 시트 연동 성공했으나 가져온 전적 데이터가 비어 있습니다.");
      }
    } catch (err: any) {
      console.error("Fetch error, falling back to local demo data:", err);
      setError(err.message);
      // Fallback to local raw match data when API fails
      setRawMatches(rawMatchRecords);
      setTeams(calculateStats(rawMatchRecords));
      setIsDemoMode(true);
      setDemoReason(err.message || "구글 시트로부터 데이터를 연동하지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Create flying glowing sparks/flame particles
  const particles = Array.from({ length: 65 }).map((_, i) => {
    const top = `${10 + (i * 13) % 80}%`;
    const durationNum = 3.5 + (i * 0.8) % 4.5;
    const duration = `${durationNum.toFixed(2)}s`;
    const delay = `-${((i * 1.9) % durationNum).toFixed(2)}s`;
    const size = `${(0.8 + (i * 0.5) % 1.6).toFixed(1)}px`; // 좀 더 작게 해달라고 하셨으므로 (0.8 ~ 2.4px 사이)
    const endY = `${(-15 - (i * 7) % 35)}px`;
    const scaleEnd = (0.2 + (i * 0.08) % 0.5).toFixed(2);
    const rot = `${120 + (i * 27) % 240}deg`;
    const opMax = (0.4 + (i * 0.15) % 0.55).toFixed(2);
    const colors = [
      'bg-[#00FF41]',
      'bg-[#39FF14]',
      'bg-viper',
      'bg-[#CCFF00]',
      'bg-[#059669]'
    ];
    const color = colors[i % colors.length];
    
    return { top, delay, duration, size, endY, scaleEnd, rot, opMax, color };
  });

  return (
    <div className="h-screen w-full flex flex-col p-4 md:p-6 pb-2 md:pb-3 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full overflow-hidden gap-4 md:gap-5">
        {/* Header */}
        <header className="relative flex flex-col md:flex-row md:justify-between md:items-end border border-white/[0.04] bg-neutral-950/35 rounded-2xl p-5 gap-4 flex-shrink-0 overflow-hidden">
          {/* Breathing ambient green background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-viper/0 via-viper/[0.12] to-viper/0 animate-header-breath" style={{ animationDuration: '6s' }} />
            <div className="absolute -left-1/4 -right-1/4 -top-1/2 bottom-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,65,0.16)_0%,transparent_55%)] animate-header-breath" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
          </div>

          {/* Flying spark particles (left-to-right) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {particles.map((p, idx) => (
              <div
                key={idx}
                className={`absolute rounded-full animate-particle-fly ${p.color}`}
                style={{
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  boxShadow: '0 0 8px rgba(0, 255, 65, 0.5)',
                  '--dur': p.duration,
                  '--end-y': p.endY,
                  '--scale-end': p.scaleEnd,
                  '--rot': p.rot,
                  '--op-max': p.opMax,
                  animationDelay: p.delay,
                } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex flex-col">
              <span className="text-viper text-[10px] md:text-xs font-bold tracking-[0.3em] mb-1.5 uppercase drop-shadow-[0_0_8px_rgba(0,255,65,0.3)]">SOOP LOL MIDDLE-EARTH TOURNAMENT</span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter">VIPER SCRIM <span className="text-viper font-black drop-shadow-[0_0_12px_rgba(0,255,65,0.45)]">DASHBOARD</span></h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-1">
              <button 
                onClick={loadData}
                disabled={isLoading}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-[10px] font-bold tracking-wider uppercase group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                {isLoading ? 'Syncing...' : 'Sync Sheet'}
              </button>

              {isDemoMode && (
                <div 
                  className="text-[11px] text-red-400 font-bold bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-500/25 max-w-[320px] truncate cursor-help" 
                  title={`구글 시트 연동 에러 상세 내용:\n${error}\n\n[조치방안]\n1. 구글 스프레드시트의 파일 -> 공유 -> 웹에 게시를 완료했는지 확인하세요.\n2. VITE_GOOGLE_SHEET_ID 환경변수가 올바른지 확인하세요.`}
                >
                  에러 안내: {error}
                </div>
              )}
            </div>
          </div>
          
          <nav className="relative z-10 flex gap-8 text-xs font-bold tracking-widest uppercase">
            <span 
              onClick={() => setActiveTab('TEAM')}
              className={`cursor-pointer transition-all duration-300 pb-1 ${activeTab === 'TEAM' ? 'text-viper border-b-2 border-viper drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]' : 'text-white/60 hover:text-white'}`}
            >
              Team Board
            </span>
            <span 
              onClick={() => setActiveTab('PLAYER')}
              className={`cursor-pointer transition-all duration-300 pb-1 ${activeTab === 'PLAYER' ? 'text-viper border-b-2 border-viper drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]' : 'text-white/60 hover:text-white'}`}
            >
              Participants
            </span>
          </nav>
        </header>

        {/* 구글 시트 웹에 게시 가이드 배너 */}
        {isDemoMode && errorDetails && (
          <div className="relative z-10 mx-6 md:mx-10 mt-4 px-5 py-4 rounded-xl border border-amber-500/35 bg-amber-500/5 text-amber-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-[0_4px_25px_rgba(245,158,11,0.05)] text-xs md:text-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex-grow">
              <div className="flex items-center gap-2 text-amber-400 font-black mb-1.5 text-xs tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>[중요] 실시간 구글 시트 연동을 위한 필수 설정 가이드</span>
              </div>
              <p className="text-white/80 leading-relaxed font-semibold">
                보내주신 스크린샷의 <strong className="text-amber-300">"링크가 있는 모든 사용자에게 공유"</strong> 설정은 아주 잘 되어 있습니다! <br />
                다만 외부 서버에서 구글 로그인을 거치지 않고 직접 로데이터(CSV)를 수집하려면 스프레드시트 내에서 <strong className="text-amber-300">"웹에 게시"</strong>를 한 번 활성화하셔야 합니다.
              </p>
              <div className="mt-3 text-white/60 space-y-1.5 pl-3 border-l-2 border-amber-500/30 text-[11px] md:text-xs">
                <div>① 구글 스프레드시트 화면 좌측 상단 [파일] ➔ [공유] ➔ <strong className="text-amber-100 font-bold">[웹에 게시]</strong> 클릭</div>
                <div>② 팝업창에서 파란색 <strong className="text-amber-100 font-bold">[게시(Publish)]</strong> 버튼 클릭 후 확인</div>
                <div>③ 완료 후 아래의 <strong className="text-viper font-bold">[Sync Sheet]</strong> 버튼을 다시 누르거나, 웹을 새로고침하시면 연동 완료!</div>
              </div>
            </div>
            <button 
              onClick={loadData}
              disabled={isLoading}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 text-[11px] font-black tracking-wider uppercase bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50 transition-all rounded-lg shadow-lg hover:shadow-amber-500/10 active:scale-95"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              다시 동기화 시도
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-grow overflow-hidden pb-0">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both h-full">
            {activeTab === 'TEAM' && <TeamStatsView teams={teams} rawMatches={rawMatches} />}
            {activeTab === 'PLAYER' && <PlayerStatsView teams={teams} />}
          </div>
        </main>
      </div>
    </div>
  );
}
