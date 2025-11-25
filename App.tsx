import React, { useState, useEffect } from 'react';
import { LOTTERIES } from './constants';
import { LotteryType, GeneratedGame, AIAnalysisResult, StatPoint } from './types';
import LotteryCard from './components/LotteryCard';
import NumberBall from './components/NumberBall';
import StatsChart from './components/StatsChart';
import { analyzeAndGenerate } from './services/geminiService';
import { ArrowLeft, Sparkles, Save, Trash2, Info, ExternalLink, Dna } from 'lucide-react';

const App: React.FC = () => {
  const [selectedLottery, setSelectedLottery] = useState<LotteryType | null>(null);
  const [savedGames, setSavedGames] = useState<GeneratedGame[]>([]);
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [strategy, setStrategy] = useState<string>('balanced');
  const [error, setError] = useState<string | null>(null);

  // Load games from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lotoSmart_games');
    if (saved) {
      try {
        setSavedGames(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved games", e);
      }
    }
  }, []);

  // Save games to localStorage
  useEffect(() => {
    localStorage.setItem('lotoSmart_games', JSON.stringify(savedGames));
  }, [savedGames]);

  const handleSelectLottery = (type: LotteryType) => {
    setSelectedLottery(type);
    setAnalysisResult(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedLottery) return;
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeAndGenerate(selectedLottery, strategy);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao gerar análise.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveGame = (numbers: number[]) => {
    if (!selectedLottery) return;
    const newGame: GeneratedGame = {
      id: Date.now().toString(),
      numbers: [...numbers].sort((a, b) => a - b),
      strategy: `AI - ${strategy}`,
      createdAt: Date.now(),
      lotteryType: selectedLottery
    };
    setSavedGames([newGame, ...savedGames]);
  };

  const handleDeleteGame = (id: string) => {
    setSavedGames(savedGames.filter(g => g.id !== id));
  };

  // Mock stats data for visual placeholder if no AI data (or mix)
  // In a real app, we would parse the AI text to get real chart data, 
  // but for stability, we'll generate semi-random nice looking data for the chart 
  // to complement the AI text.
  const getMockStats = (max: number): StatPoint[] => {
    return Array.from({ length: 15 }, (_, i) => ({
      number: Math.floor(Math.random() * max) + 1,
      frequency: Math.floor(Math.random() * 20) + 5
    })).sort((a, b) => b.frequency - a.frequency); // Top 15 hottest mock
  };

  const renderHome = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
          LotoSmart AI
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Inteligência Artificial aplicada às Loterias. Analise tendências reais e gere jogos com embasamento estatístico usando o Google Gemini.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(LOTTERIES).map((config) => (
          <LotteryCard 
            key={config.id} 
            config={config} 
            onClick={() => handleSelectLottery(config.id)} 
          />
        ))}
      </div>
    </div>
  );

  const renderLotteryView = () => {
    if (!selectedLottery) return null;
    const config = LOTTERIES[selectedLottery];

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setSelectedLottery(null)}
            className="flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`} />
            <h2 className="text-2xl font-bold text-white">{config.name}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Action Area (Left/Center) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Strategy Control */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Sparkles className="text-amber-400" size={20} />
                    Gerador Inteligente
                  </h3>
                  <p className="text-slate-400 text-sm">Use IA para buscar dados reais e gerar palpites.</p>
                </div>
                
                <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
                  <select 
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    className="bg-transparent text-white text-sm px-4 py-2 outline-none cursor-pointer"
                  >
                    <option value="balanced">Equilibrado (Quentes/Frios)</option>
                    <option value="hot">Apenas Números Quentes</option>
                    <option value="cold">Apenas Números Frios (Zebras)</option>
                    <option value="risky">Estratégia Arriscada</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isAnalyzing}
                className={`
                  w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all
                  ${isAnalyzing 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : `bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white hover:scale-[1.01]`
                  }
                `}
              >
                {isAnalyzing ? (
                  <>
                    <Dna className="animate-spin" />
                    Analisando Resultados Recentes...
                  </>
                ) : (
                  <>
                    <Sparkles />
                    Gerar Análise e Jogos
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Analysis Results */}
            {analysisResult && (
              <div className="space-y-6 animate-fade-in">
                
                {/* AI Text Insight */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                    <Info size={16} /> Insight da IA
                  </h4>
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                     <p className="whitespace-pre-line">{analysisResult.text.replace(/JOGO_SUGERIDO: \[.*?\]/g, '')}</p>
                  </div>
                  
                  {/* Sources */}
                  {analysisResult.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Fontes Analisadas</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.sources.slice(0, 3).map((source, i) => (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors"
                          >
                            {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
                            <ExternalLink size={10} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggested Games List */}
                {analysisResult.suggestedGames.length > 0 && (
                  <div className="grid gap-4">
                    {analysisResult.suggestedGames.map((game, idx) => (
                      <div key={idx} className="bg-slate-800 rounded-xl p-4 border border-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-emerald-500/50 transition-colors">
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                          {game.map(num => (
                            <NumberBall key={num} number={num} colorClass={config.color} size="sm" />
                          ))}
                        </div>
                        <button
                          onClick={() => handleSaveGame(game)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                        >
                          <Save size={16} />
                          Salvar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Visual Stats (Placeholder/Mock for Visual Appeal if no AI) */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Tendência Visual (Simulada)</h3>
              <StatsChart data={getMockStats(config.maxNumber)} color={config.color} />
            </div>

          </div>

          {/* Sidebar Area (Saved Games) */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 h-full max-h-[calc(100vh-100px)] flex flex-col sticky top-6">
              <div className="p-6 border-b border-slate-700 bg-slate-800/50 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Save className="text-purple-400" size={20} />
                  Jogos Salvos
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {savedGames.filter(g => g.lotteryType === selectedLottery).length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p>Nenhum jogo salvo.</p>
                    <p className="text-xs mt-1">Gere palpites e salve para ver aqui.</p>
                  </div>
                ) : (
                  savedGames
                    .filter(g => g.lotteryType === selectedLottery)
                    .map((game) => (
                      <div key={game.id} className="bg-slate-900 rounded-lg p-3 border border-slate-700 group relative">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-slate-500 font-mono">
                            {new Date(game.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                            {game.strategy.replace('AI - ', '')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {game.numbers.map(num => (
                            <span 
                              key={num} 
                              className={`
                                inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full 
                                ${config.color.replace('bg-', 'text-')} bg-slate-800 border border-slate-600
                              `}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => handleDeleteGame(game.id)}
                          className="absolute top-2 right-2 p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200">
       {/* Background Noise/Grid */}
       <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
       
       <div className="relative z-10">
        {selectedLottery ? renderLotteryView() : renderHome()}
       </div>
    </div>
  );
};

export default App;
