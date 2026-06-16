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

  return (
    <div className="h-screen w-full flex flex-col p-4 md:p-6 overflow-hidden gap-6 bg-background">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-[#222222] pb-4 gap-4 flex-shrink-0">
        <div className="flex flex-col">
          <span className="text-viper text-xs font-bold tracking-[0.3em] mb-1 uppercase">SOOP LOL MIDDLE-EARTH TOURNAMENT</span>
          <h1 className="text-3xl font-black tracking-tighter">VIPER SCRIM <span className="text-viper">DASHBOARD</span></h1>
        </div>
        
        <nav className="flex gap-8 text-xs font-bold tracking-widest uppercase">
          <span 
            onClick={() => setActiveTab('TEAM')}
            className={`cursor-pointer transition-colors pb-1 ${activeTab === 'TEAM' ? 'text-viper border-b border-viper' : 'hover:text-viper'}`}
          >
            Team Board
          </span>
          <span 
            onClick={() => setActiveTab('PLAYER')}
            className={`cursor-pointer transition-colors pb-1 ${activeTab === 'PLAYER' ? 'text-viper border-b border-viper' : 'hover:text-viper'}`}
          >
            Participants
          </span>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-hidden pb-4">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both h-full">
          {activeTab === 'TEAM' ? (
            <TeamStatsView teams={teams} />
          ) : (
            <PlayerStatsView teams={teams} />
          )}
        </div>
      </main>

      <footer className="flex-shrink-0 mt-auto flex flex-col md:flex-row justify-between md:items-center text-[10px] text-white/20 gap-2 border-t border-[#222222] pt-4">
        <div className="flex gap-4">
          <span>SCRIM_ENGINE_V2.0.4</span>
          <span>LAST_UPDATE: {new Date().toISOString().split('T')[0]}</span>
        </div>
        <div className="text-viper opacity-50 font-bold uppercase tracking-widest">AUTHORIZED ACCESS ONLY</div>
      </footer>
    </div>
  );
}
