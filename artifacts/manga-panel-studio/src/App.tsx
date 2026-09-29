import { type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Aperture,
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clapperboard,
  Copy,
  Dices,
  Download,
  FileText,
  FolderOpen,
  Grid2X2,
  ImagePlus,
  Layers3,
  Lightbulb,
  LoaderCircle,
  Menu,
  MessageSquare,
  MoreHorizontal,
  PanelTop,
  PenLine,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Share2,
  Sparkles,
  Shuffle,
  Trash2,
  UserRound,
  WandSparkles,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  type Panel = { id: number; shot: string; scene: string; dialogue: string; caption: string; art: string; tone: string };
  type Character = {
    name: string;
    role: string;
    silhouette: string;
    hair: string;
    eyes: string;
    outfit: string;
    energy: string;
  };
  const directions = [
    { id: 'ink', name: 'Ink & grit', note: 'Bold linework', className: 'direction-ink' },
    { id: 'wash', name: 'Quiet wash', note: 'Soft atmosphere', className: 'direction-wash' },
    { id: 'pastel', name: 'Paper pastel', note: 'Warm memory', className: 'direction-pastel' },
    { id: 'noir', name: 'Noir cut', note: 'Hard contrast', className: 'direction-noir' },
  ];
  const characterOptions: Record<keyof Omit<Character, 'name'>, readonly string[]> = {
    role: ['protagonist', 'rival', 'mentor', 'mystery'],
    silhouette: ['slender', 'angular', 'compact', 'towering'],
    hair: ['cropped', 'bob', 'wild', 'long'],
    eyes: ['soft', 'sharp', 'tired', 'bright'],
    outfit: ['station coat', 'school uniform', 'workwear', 'ceremonial'],
    energy: ['reserved', 'electric', 'haunted', 'playful'],
  };
  const initialPanels: Panel[] = [
    { id: 1, shot: '01', scene: 'EXT. FLOODED STATION', dialogue: '', caption: 'The last train left three hours ago.', art: 'art-one', tone: 'establishing' },
    { id: 2, shot: '02', scene: 'MARA / PLATFORM 4', dialogue: 'You came back.', caption: '', art: 'art-two', tone: 'close' },
    { id: 3, shot: '03', scene: 'THE SIGNAL', dialogue: 'I never really left.', caption: 'A red light blinks under the water.', art: 'art-three', tone: 'insert' },
    { id: 4, shot: '04', scene: 'MARA TURNS', dialogue: 'Then why are you whispering?', caption: '', art: 'art-four', tone: 'reaction' },
    { id: 5, shot: '05', scene: 'TUNNEL MOUTH', dialogue: '', caption: 'Somewhere below, metal remembers its shape.', art: 'art-five', tone: 'wide' },
    { id: 6, shot: '06', scene: 'THE FIGURE', dialogue: 'Don’t follow the light.', caption: '', art: 'art-six', tone: 'cliffhanger' },
  ];
  const [inputMode, setInputMode] = useState<'idea' | 'script'>('idea');
  const [prompt, setPrompt] = useState('A girl returns to the flooded metro station where her brother vanished. The last train is still waiting.');
  const [direction, setDirection] = useState('wash');
  const [panels, setPanels] = useState<Panel[]>(initialPanels);
  const [selectedId, setSelectedId] = useState(2);
  const [character, setCharacter] = useState<Character>({
    name: 'Mara',
    role: 'protagonist',
    silhouette: 'slender',
    hair: 'bob',
    eyes: 'tired',
    outfit: 'station coat',
    energy: 'haunted',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [mobileInputOpen, setMobileInputOpen] = useState(true);
  const [zoom, setZoom] = useState(100);
  const selectedPanel = panels.find((panel) => panel.id === selectedId) ?? panels[0];
  const currentDirection = useMemo(() => directions.find((item) => item.id === direction) ?? directions[1], [direction]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2800);
  };
  const updateSelected = (key: 'dialogue' | 'caption', value: string) => {
    setPanels((items) => items.map((panel) => panel.id === selectedId ? { ...panel, [key]: value } : panel));
  };
  const updateCharacter = (key: keyof Omit<Character, 'name'>, value: string) => {
    setCharacter((current) => ({ ...current, [key]: value }));
  };
  const randomizeCharacter = () => {
    setCharacter((current) => {
      const next = { ...current };
      (Object.keys(characterOptions) as Array<keyof Omit<Character, 'name'>>).forEach((key) => {
        const options = characterOptions[key];
        next[key] = options[Math.floor(Math.random() * options.length)] ?? next[key];
      });
      return next;
    });
    flash(`${character.name || 'Character'} got a new look`);
  };
  const generate = () => {
    if (!prompt.trim()) {
      setError('Give the sequence a spark first — even one sentence is enough.');
      return;
    }
    setError('');
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      setSelectedId(2);
      flash('Sequence generated · 6 panels ready to edit');
    }, 1500);
  };
  const clearSequence = () => {
    setPanels([]);
    setSelectedId(0);
    setError('');
    flash('Canvas cleared');
  };
  const restoreDemo = () => {
    setPanels(initialPanels);
    setSelectedId(2);
    setPrompt('A girl returns to the flooded metro station where her brother vanished. The last train is still waiting.');
    flash('Demo sequence restored');
  };
  const exportStoryboard = () => {
    const body = [
      `MANGA PANEL STUDIO / ${prompt}`,
      `Visual direction: ${currentDirection.name}`,
      `Character: ${character.name || 'Unnamed'} — ${character.role}, ${character.silhouette} silhouette, ${character.hair} hair, ${character.eyes} eyes, ${character.outfit}, ${character.energy} energy`,
      '',
      ...panels.map((panel) => `PANEL ${panel.shot} — ${panel.scene}\n${panel.dialogue ? `DIALOGUE: ${panel.dialogue}\n` : ''}${panel.caption ? `CAPTION: ${panel.caption}\n` : ''}`),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'mara-flooded-station-storyboard.txt'; link.click();
    URL.revokeObjectURL(url);
    flash('Storyboard exported as a text script');
    setShareOpen(false);
  };
  const share = async () => {
    const shareData = { title: 'The Last Train — Manga Panel Studio', text: `A ${currentDirection.name.toLowerCase()} storyboard: ${prompt}` };
    const hasNativeShare = typeof navigator.share === 'function';
    try {
      if (hasNativeShare) await navigator.share(shareData);
      else if (navigator.clipboard) await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
      flash(hasNativeShare ? 'Share sheet opened' : 'Storyboard link copied to clipboard');
    } catch {
      flash('Share cancelled');
    }
    setShareOpen(false);
  };

  return (
    <div className="studio-shell flex min-h-[100dvh] text-[#282724]">
      <aside className="studio-rail flex w-[74px] shrink-0 flex-col items-center py-5">
        <button className="rail-mark" aria-label="Manga Panel Studio home" data-testid="button-studio-home"><Aperture size={21} strokeWidth={1.7} /></button>
        <div className="rail-divider my-7 h-px w-7 bg-[#625d52]" />
        <nav className="flex flex-col items-center gap-3">
          <button className="rail-button is-active" aria-label="Storyboard studio" data-testid="button-nav-studio"><Clapperboard size={19} /></button>
          <button className="rail-button" aria-label="Projects" data-testid="button-nav-projects"><FolderOpen size={19} /></button>
          <button className="rail-button" aria-label="Panel library" data-testid="button-nav-library"><Layers3 size={19} /></button>
          <button className="rail-button" aria-label="Reference images" data-testid="button-nav-references"><ImagePlus size={19} /></button>
        </nav>
        <div className="rail-bottom mt-auto flex flex-col items-center gap-3">
          <button className="rail-button" aria-label="Help" data-testid="button-help"><CircleHelp size={19} /></button>
          <div className="grid h-8 w-8 place-items-center rounded-full border border-[#766f62] bg-[#302f2a] text-xs font-bold text-[#e7d9bf]" data-testid="avatar-creator">AR</div>
        </div>
      </aside>
      <main className="mobile-bottom-space min-w-0 flex-1">
        <header className="flex h-[72px] items-center justify-between border-b border-[#d4c9b7] px-5 md:px-9">
          <div className="flex items-center gap-3">
            <button className="quiet-button grid h-9 w-9 place-items-center rounded-lg md:hidden" onClick={() => setMobileInputOpen((open) => !open)} aria-label="Toggle script panel" data-testid="button-toggle-input"><Menu size={18} /></button>
            <div className="hidden items-center gap-2 text-xs text-[#716b60] sm:flex"><span>WORKSPACE</span><ChevronDown size={13} /><span className="font-semibold text-[#302f2a]">The Last Train</span></div>
            <div className="flex items-center gap-2 sm:hidden"><Aperture size={17} className="text-[#ed4f31]" /><span className="font-semibold">The Last Train</span></div>
            <span className="hidden rounded-full bg-[#ded6c7] px-2 py-1 text-[10px] font-semibold text-[#756d60] sm:inline">DRAFT</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-2 text-[10px] text-[#81786a] md:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#6fa474]" /> SAVED JUST NOW</div>
            <button className="quiet-button flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold" onClick={() => setShareOpen((open) => !open)} data-testid="button-open-share"><Share2 size={15} /> <span className="hidden sm:inline">Share</span></button>
            <button className="primary-button flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-bold" onClick={exportStoryboard} disabled={!panels.length} data-testid="button-export-header"><Download size={15} /> Export</button>
          </div>
          {shareOpen && <div className="paper-card toast-note absolute right-5 top-[61px] z-20 w-56 rounded-xl p-2 md:right-9" data-testid="menu-share"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold hover:bg-[#eee8dd]" onClick={share} data-testid="button-copy-share"><Copy size={15} /> Copy share note</button><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold hover:bg-[#eee8dd]" onClick={exportStoryboard} data-testid="button-export-share"><ArrowDownToLine size={15} /> Download .txt script</button></div>}
        </header>
        <div className="grid min-w-0 lg:grid-cols-[350px_minmax(0,1fr)]">
          <section className={`${mobileInputOpen ? 'block' : 'hidden'} border-b border-[#d4c9b7] bg-[#eee8dd]/60 lg:block lg:min-h-[calc(100dvh-72px)] lg:border-b-0 lg:border-r`} data-testid="section-script-input">
            <div className="p-5 md:p-7">
              <div className="mb-8 flex items-start justify-between">
                <div><p className="eyebrow mb-2 text-[#ed4f31]">01 / SOURCE</p><h1 className="display-font text-[29px] leading-[1.05]">Start with a<br /><em>spark.</em></h1></div>
                <button className="quiet-button grid h-8 w-8 place-items-center rounded-md" onClick={clearSequence} aria-label="Clear storyboard" data-testid="button-clear-sequence"><RotateCcw size={15} /></button>
              </div>
              <div className="mb-5 flex border-b border-[#cec3b0]">
                <button className={`tab-button pb-3 pr-5 text-xs font-bold ${inputMode === 'idea' ? 'is-active' : ''}`} onClick={() => setInputMode('idea')} data-testid="tab-idea"><Lightbulb size={14} className="mr-1.5 inline" /> Idea</button>
                <button className={`tab-button pb-3 px-5 text-xs font-bold ${inputMode === 'script' ? 'is-active' : ''}`} onClick={() => setInputMode('script')} data-testid="tab-script"><FileText size={14} className="mr-1.5 inline" /> Script</button>
              </div>
              <label className="mb-2 block text-xs font-bold text-[#45423c]" htmlFor="story-input">{inputMode === 'idea' ? 'What are we making?' : 'Paste a scene or script beat'}</label>
              <textarea id="story-input" value={prompt} onChange={(event) => { setPrompt(event.target.value); setError(''); }} className="mb-2 min-h-[150px] w-full resize-none rounded-lg border border-[#d5c9b6] bg-[#f7f3eb] p-3.5 text-[13px] leading-6 outline-none transition-colors focus:border-[#ed4f31] focus:ring-2 focus:ring-[#ed4f31]/10" data-testid="input-story-prompt" />
              <div className="mb-7 flex justify-between text-[10px] text-[#8a8071]"><span>{prompt.length} / 600</span><span className="flex items-center gap-1"><Save size={11} /> autosaved</span></div>
              <div className="mb-3 flex items-center justify-between"><label className="text-xs font-bold">Visual direction</label><button className="text-[#ed4f31]" aria-label="Add visual direction" onClick={() => flash('Custom directions arrive in the next pass')} data-testid="button-add-direction"><Plus size={15} /></button></div>
              <div className="grid grid-cols-2 gap-2" data-testid="group-visual-directions">{directions.map((item) => <button key={item.id} className={`direction-option flex items-center gap-2 rounded-lg p-2 text-left ${direction === item.id ? 'is-selected' : ''}`} onClick={() => setDirection(item.id)} data-testid={`button-direction-${item.id}`}><span className={`direction-swatch shrink-0 ${item.className}`} /> <span><span className="block text-[11px] font-bold">{item.name}</span><span className="block text-[9px] text-[#867c6d]">{item.note}</span></span>{direction === item.id && <Check size={13} className="ml-auto self-start text-[#ed4f31]" />}</button>)}</div>
               <section className="character-card mt-7 rounded-xl p-3.5" data-testid="section-character-builder">
                 <div className="mb-3 flex items-start justify-between gap-3">
                   <div>
                     <p className="eyebrow mb-1 text-[#ed4f31]">CHARACTER LAB</p>
                     <h2 className="display-font text-[21px] leading-none">Make them <em>real.</em></h2>
                   </div>
                   <button className="character-random-button flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-2 text-[10px] font-bold" onClick={randomizeCharacter} data-testid="button-random-character"><Shuffle size={12} /> Randomize</button>
                 </div>
                 <div className="grid gap-3 sm:grid-cols-[104px_1fr]">
                   <div className={`character-portrait ${character.hair} ${character.energy}`} aria-label={`${character.name || 'Unnamed'} character preview`} data-testid="character-preview">
                     <span className="portrait-face" />
                     <span className={`portrait-hair hair-${character.hair}`} />
                     <span className="portrait-body" />
                     <UserRound className="portrait-mark" size={17} />
                   </div>
                   <div className="min-w-0">
                     <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-[#81786a]" htmlFor="character-name">Character name</label>
                     <input id="character-name" value={character.name} onChange={(event) => setCharacter((current) => ({ ...current, name: event.target.value }))} placeholder="Name your character…" className="character-name-input mb-2 w-full pb-1.5 text-sm font-semibold" data-testid="input-character-name" />
                     <p className="text-[10px] leading-4 text-[#827869]">This design will travel with the storyboard when you export it.</p>
                   </div>
                 </div>
                 <div className="mt-3 grid grid-cols-2 gap-2">
                   {(Object.keys(characterOptions) as Array<keyof Omit<Character, 'name'>>).map((key) => (
                     <label key={key} className="feature-field">
                       <span>{key}</span>
                       <select value={character[key]} onChange={(event) => updateCharacter(key, event.target.value)} data-testid={`select-character-${key}`}>
                         {characterOptions[key].map((option) => <option key={option} value={option}>{option}</option>)}
                       </select>
                     </label>
                   ))}
                 </div>
                 <div className="character-summary mt-3 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px]" data-testid="character-summary">
                   <Dices size={13} className="shrink-0 text-[#ed4f31]" />
                   <span><strong>{character.name || 'Unnamed'}</strong> · {character.role} · {character.energy} energy</span>
                 </div>
               </section>
              {error && <div className="mt-5 flex items-start gap-2 rounded-lg border border-[#e0a497] bg-[#fae5df] p-3 text-xs leading-5 text-[#9e3e2c]" data-testid="status-generation-error"><CircleHelp size={15} className="mt-0.5 shrink-0" /> <span>{error}<button className="ml-1 font-bold underline" onClick={() => setError('')} data-testid="button-dismiss-error">Dismiss</button></span></div>}
              <button className="primary-button mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold" onClick={generate} disabled={isGenerating} data-testid="button-generate-storyboard">{isGenerating ? <><LoaderCircle size={17} className="animate-spin" /> Finding the rhythm…</> : <><WandSparkles size={17} /> Generate storyboard</>}</button>
              <p className="mt-3 text-center text-[10px] leading-4 text-[#8a8071]">You stay in control. Every panel is a starting point,<br />not a final answer.</p>
              <div className="mt-9 border-t border-[#d4c9b7] pt-5"><p className="eyebrow mb-3 text-[#8a8071]">WORKSPACE NOTES</p><div className="flex gap-2 text-[11px] leading-5 text-[#6f685c]"><PenLine size={14} className="mt-0.5 shrink-0 text-[#ed4f31]" /><p>Try changing the direction after generating. The rhythm stays; the mood shifts.</p></div></div>
            </div>
          </section>
          <section className="min-w-0 p-4 md:p-7 lg:p-9" data-testid="section-storyboard-workspace">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div><p className="eyebrow mb-2 text-[#ed4f31]">02 / SEQUENCE</p><div className="flex items-baseline gap-3"><h2 className="display-font text-[31px] leading-none">The last train</h2><span className="mono text-[10px] text-[#8a8071]">v.03</span></div><p className="mt-2 text-xs text-[#7f7668]">A six-beat study in absence, water, and the things that wait.</p></div>
              <div className="flex items-center gap-2"><button className="quiet-button grid h-8 w-8 place-items-center rounded-md" onClick={() => setZoom((value) => Math.max(80, value - 10))} aria-label="Zoom out storyboard" data-testid="button-zoom-out">−</button><span className="mono w-9 text-center text-[10px] text-[#81786a]" data-testid="text-zoom-level">{zoom}%</span><button className="quiet-button grid h-8 w-8 place-items-center rounded-md" onClick={() => setZoom((value) => Math.min(120, value + 10))} aria-label="Zoom in storyboard" data-testid="button-zoom-in">+</button><button className="quiet-button ml-1 grid h-8 w-8 place-items-center rounded-md" onClick={() => flash('Presentation mode is ready')} aria-label="Open presentation mode" data-testid="button-presentation"><ArrowUpRight size={15} /></button></div>
            </div>
            <div className={`board-wrap rounded-xl p-4 md:p-6 ${isGenerating ? 'generating' : ''}`} data-testid="storyboard-canvas">
              <div className="board-inner">
                <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-md bg-[#292826] text-[#f5eee0]"><Grid2X2 size={14} /></span><span className="eyebrow text-[#6f675a]">THUMBNAIL PASS</span></div><span className="mono text-[10px] text-[#7f766a]" data-testid="status-panel-count">{panels.length ? `${panels.length.toString().padStart(2, '0')} PANELS` : 'NO PANELS'}</span></div>
                {isGenerating ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[1,2,3,4,5,6].map((item) => <div key={item} className="panel-card overflow-hidden rounded-lg"><div className="h-[170px] bg-[#d5cec1]"><div className="h-full w-2/3 animate-pulse bg-[#e4ddd0]" /></div><div className="h-16 bg-[#f1ece2] p-3"><div className="mb-2 h-2 w-1/3 animate-pulse rounded bg-[#d7cdbd]" /><div className="h-2 w-2/3 animate-pulse rounded bg-[#ded5c6]" /></div></div>)}</div> : panels.length === 0 ? <div className="empty-grid flex min-h-[425px] flex-col items-center justify-center rounded-lg border border-dashed border-[#c4b8a6] px-6 text-center" data-testid="empty-storyboard"><span className="mb-4 grid h-14 w-14 place-items-center rounded-full border border-[#c7bba9] bg-[#f4eee3] text-[#ed4f31]"><PanelTop size={23} /></span><h3 className="display-font text-2xl">A blank page has its own pulse.</h3><p className="mt-2 max-w-xs text-xs leading-5 text-[#7d7467]">Your next sequence is waiting for a first beat. Restore the example or generate from your idea.</p><button className="quiet-button mt-5 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold" onClick={restoreDemo} data-testid="button-restore-demo"><RefreshCw size={14} /> Restore demo sequence</button></div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', width: `${10000 / zoom}%` }} data-testid="panel-grid">{panels.map((panel, index) => <button key={panel.id} className={`panel-card group overflow-hidden rounded-lg text-left ${selectedId === panel.id ? 'is-selected' : ''} rise-in`} style={{ animationDelay: `${index * 65}ms` }} onClick={() => setSelectedId(panel.id)} data-testid={`card-panel-${panel.id}`}><div className={`panel-art ${panel.art} h-[170px]`}><span className="absolute left-2 top-2 z-10 rounded bg-[#f8f4eb]/90 px-1.5 py-1 font-mono text-[9px] font-bold text-[#292826]">{panel.shot}</span>{panel.id === 1 && <><span className="art-shape left-[23%] top-[34%] h-16 w-10 -rotate-12 rounded-[50%_50%_42%_44%]" /><span className="sketch-line left-[8%] top-[72%] w-20 -rotate-[11deg]" /><span className="sketch-line left-[60%] top-[24%] w-14 rotate-[20deg]" /></>}{panel.id === 2 && <><span className="art-shape left-[32%] top-[23%] h-20 w-16 rotate-6 rounded-[48%_47%_35%_40%]" /><span className="speech-bubble right-3 top-4">You came<br />back.</span></>}{panel.id === 3 && <><span className="art-shape left-[37%] top-[28%] h-14 w-14 rounded-full" /><span className="speech-bubble left-3 top-5">I never<br />really left.</span></>}{panel.id === 4 && <><span className="art-shape left-[31%] top-[18%] h-24 w-16 -rotate-[8deg] rounded-[50%_45%_20%_20%]" /><span className="sketch-line left-[8%] top-[33%] w-16 rotate-[18deg]" /></>}{panel.id === 5 && <><span className="art-shape left-[13%] top-[55%] h-10 w-36 -rotate-3 rounded-full" /><span className="sketch-line left-[11%] top-[68%] w-40 rotate-[2deg]" /></>}{panel.id === 6 && <><span className="art-shape left-[43%] top-[19%] h-28 w-14 rotate-3 rounded-[45%_45%_12%_12%]" /><span className="speech-bubble right-2 top-3">Don't follow<br />the light.</span></>}{panel.caption && <span className="caption-strip">{panel.caption}</span>}</div><div className="bg-[#f8f4eb] p-3"><div className="mb-1 flex items-center justify-between"><span className="eyebrow text-[9px] text-[#8a8071]">{panel.tone}</span>{selectedId === panel.id && <span className="text-[9px] font-bold text-[#ed4f31]">EDITING</span>}</div><p className="truncate text-[11px] font-bold text-[#37342f]">{panel.scene}</p>{panel.dialogue && <p className="mt-1 truncate text-[10px] italic text-[#70685b]">“{panel.dialogue}”</p>}</div></button>)}</div>}
                {!isGenerating && panels.length > 0 && <div className="mt-6 flex items-center justify-between border-t border-[#cbc0ae] pt-4"><button className="flex items-center gap-1.5 text-[10px] font-bold text-[#736b5e] hover:text-[#ed4f31]" onClick={() => flash('Panel generation is queued')} data-testid="button-add-panel"><Plus size={14} /> ADD PANEL</button><span className="mono text-[9px] text-[#918676]">DRAG TO REORDER <span className="mx-1">·</span> CLICK TO EDIT</span></div>}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3"><div className="sequence-bar flex-1" /><span className="mono text-[9px] text-[#8a8071]">PACING / 06 BEATS</span></div>
            {panels.length > 0 && selectedPanel && <section className="paper-card mt-7 rounded-xl p-5 md:p-6" data-testid="section-panel-editor"><div className="mb-5 flex items-start justify-between"><div><p className="eyebrow mb-2 text-[#ed4f31]">03 / PANEL {selectedPanel.shot}</p><h3 className="display-font text-2xl">{selectedPanel.scene.toLowerCase()}</h3></div><button className="quiet-button grid h-8 w-8 place-items-center rounded-md" onClick={() => flash('Panel options opened')} aria-label="More panel options" data-testid="button-panel-options"><MoreHorizontal size={17} /></button></div><div className="grid gap-5 md:grid-cols-[180px_1fr]"><div className={`panel-art ${selectedPanel.art} h-[130px] rounded-lg`}><span className="caption-strip">{selectedPanel.tone}</span></div><div className="space-y-4"><div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-[#81786a]" htmlFor="dialogue-input"><MessageSquare size={12} className="mr-1 inline" /> Dialogue</label><input id="dialogue-input" value={selectedPanel.dialogue} onChange={(event) => updateSelected('dialogue', event.target.value)} placeholder="Give the panel a voice…" className="input-line pb-2 text-sm" data-testid="input-panel-dialogue" /></div><div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-[#81786a]" htmlFor="caption-input"><PenLine size={12} className="mr-1 inline" /> Caption / direction</label><input id="caption-input" value={selectedPanel.caption} onChange={(event) => updateSelected('caption', event.target.value)} placeholder="A note from the narrator or director…" className="input-line pb-2 text-sm" data-testid="input-panel-caption" /></div></div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e1d8ca] pt-4"><span className="text-[10px] text-[#898071]"><Sparkles size={12} className="mr-1 inline text-[#ed4f31]" /> Direction: <strong className="text-[#4a453d]">{currentDirection.name}</strong></span><div className="flex items-center gap-2"><button className="quiet-button flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-bold" onClick={() => flash('Panel note saved')} data-testid="button-save-panel"><Check size={13} /> Saved</button><button className="quiet-button grid h-7 w-7 place-items-center rounded-md text-[#a34c3b]" onClick={() => { setPanels((items) => items.filter((panel) => panel.id !== selectedId)); setSelectedId(panels.find((panel) => panel.id !== selectedId)?.id ?? 0); flash('Panel removed'); }} aria-label="Delete selected panel" data-testid="button-delete-panel"><Trash2 size={14} /></button></div></div></section>}
            <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[#d4c9b7] pb-4 pt-5 text-[10px] text-[#897f70]"><div className="flex items-center gap-2"><Aperture size={14} className="text-[#ed4f31]" /><span>MADE FOR THE LONG WAY AROUND</span></div><span className="mono">MANGA PANEL STUDIO / LOCAL DRAFT</span></footer>
          </section>
        </div>
      </main>
      {notice && <div className="toast-note fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#292826] px-4 py-2.5 text-xs font-semibold text-[#f7f0e3] shadow-xl" data-testid="status-toast"><Check size={15} className="text-[#d9a441]" />{notice}</div>}
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
