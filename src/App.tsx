/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { initialTeams } from './data';
import { TeamStatsView } from './TeamStats';
import { PlayerStatsView } from './PlayerStats';
import { Trophy, Users, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'TEAM' | 'PLAYER'>('TEAM');
  const teams = initialTeams; // In a real app, this would be fetched or managed via state

  // Create flying glowing sparks/flame particles
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const top = `${15 + (i * 17) % 70}%`;
    const durationNum = 4.0 + (i * 1.3) % 4.0;
    const duration = `${durationNum.toFixed(2)}s`;
    const delay = `-${((i * 2.7) % durationNum).toFixed(2)}s`;
    const size = `${(1.0 + (i * 0.7) % 1.5).toFixed(1)}px`;
    const endY = `${(-10 - (i * 5) % 30)}px`;
    const scaleEnd = (0.3 + (i * 0.1) % 0.6).toFixed(2);
    const rot = `${180 + (i * 33) % 180}deg`;
    const opMax = (0.5 + (i * 0.2) % 0.5).toFixed(2);
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
    <div className="h-screen w-full flex flex-col p-4 md:p-6 pb-2 md:pb-3 overflow-hidden gap-4 md:gap-5 bg-background">
      {/* Header */}
      <header className="relative flex flex-col md:flex-row md:justify-between md:items-end border border-white/[0.04] bg-neutral-950/35 rounded-2xl p-5 gap-4 flex-shrink-0 overflow-hidden">
        {/* Breathing ambient green background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-viper/0 via-viper/[0.04] to-viper/0 animate-header-breath" style={{ animationDuration: '6s' }} />
          <div className="absolute -left-1/4 -right-1/4 -top-1/2 bottom-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,65,0.08)_0%,transparent_60%)] animate-header-breath" style={{ animationDuration: '4s', animationDelay: '1s' }} />
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

        {/* Header Content */}
        <div className="relative z-10 flex flex-col">
          <span className="text-viper text-[10px] md:text-xs font-bold tracking-[0.3em] mb-1.5 uppercase drop-shadow-[0_0_8px_rgba(0,255,65,0.3)]">SOOP LOL MIDDLE-EARTH TOURNAMENT</span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter">VIPER SCRIM <span className="text-viper font-black drop-shadow-[0_0_12px_rgba(0,255,65,0.45)]">DASHBOARD</span></h1>
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

      {/* Main Content */}
      <main className="flex-grow overflow-hidden pb-0">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both h-full">
          {activeTab === 'TEAM' ? (
            <TeamStatsView teams={teams} />
          ) : (
            <PlayerStatsView teams={teams} />
          )}
        </div>
      </main>
    </div>
  );
}
