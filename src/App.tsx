import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Search, Brain, Map, HelpCircle, MessageSquare, ChevronRight,
  BookOpen, Tag, Lightbulb, CheckCircle, XCircle, ArrowLeft,
  Send, Bug, ThumbsUp, AlertCircle, Filter,
  FileQuestion, LayoutGrid, Play, RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import type { KnowledgeItem, Page, FeedbackItem } from '@/types';
import {
  knowledgeList, categories, categoryColors, imageMap,
  searchKnowledge, getKnowledgeById, getAllQA
} from '@/data/knowledge';
import './App.css';

/* ─── Header ─── */
function Header({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (p: Page) => void }) {
  const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
    { page: 'home', label: '知识库', icon: <BookOpen className="w-4 h-4" /> },
    { page: 'mindmap', label: '思维导图', icon: <Map className="w-4 h-4" /> },
    { page: 'quiz', label: '问答测试', icon: <HelpCircle className="w-4 h-4" /> },
    { page: 'feedback', label: '反馈', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <Brain className="w-7 h-7 text-amber-400" />
          <span className="text-lg font-bold text-white">Python<span className="text-amber-400">知识库</span></span>
        </div>
        <nav className="flex gap-1">
          {navItems.map(n => (
            <button
              key={n.page}
              onClick={() => onNavigate(n.page)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${currentPage === n.page
                  ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              {n.icon}
              <span className="hidden sm:inline">{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ─── Knowledge Graph (simple force-directed SVG) ─── */
function KnowledgeGraph({ onSelect }: { onSelect: (id: number) => void }) {
  const nodes = useMemo(() => {
    const center = { id: 0, x: 400, y: 300, label: 'Python基础', r: 45, color: '#FFD700' };
    const catNodes = categories.map((cat, i) => {
      const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
      return {
        id: 100 + i,
        x: 400 + Math.cos(angle) * 200,
        y: 300 + Math.sin(angle) * 180,
        label: cat,
        r: 35,
        color: categoryColors[cat] || '#888',
      };
    });
    const leafNodes = knowledgeList.map((k, i) => {
      const catIdx = categories.indexOf(k.category);
      const catAngle = (catIdx / categories.length) * Math.PI * 2 - Math.PI / 2;
      const offset = ((i % 3) - 1) * 0.5;
      const dist = 120;
      return {
        id: k.id,
        x: 400 + Math.cos(catAngle + offset) * 200 + Math.cos(catAngle + offset * 2) * dist,
        y: 300 + Math.sin(catAngle + offset) * 180 + Math.sin(catAngle + offset * 2) * dist,
        label: k.title.length > 6 ? k.title.slice(0, 5) + '..' : k.title,
        r: 28,
        color: categoryColors[k.category] || '#888',
      };
    });
    return { center, catNodes, leafNodes };
  }, []);

  return (
    <div className="w-full overflow-auto">
      <svg viewBox="0 0 800 600" className="w-full max-w-4xl mx-auto">
        <rect width="800" height="600" fill="#0f172a" rx="12" />
        {/* Links center -> categories */}
        {nodes.catNodes.map(cat => (
          <line key={`c-${cat.id}`} x1={nodes.center.x} y1={nodes.center.y} x2={cat.x} y2={cat.y}
            stroke={cat.color} strokeWidth="2" opacity="0.6" />
        ))}
        {/* Links categories -> leaves */}
        {nodes.leafNodes.map(leaf => {
          const catIdx = categories.indexOf(knowledgeList.find(k => k.id === leaf.id)?.category || '');
          const cat = nodes.catNodes[catIdx];
          if (!cat) return null;
          return (
            <line key={`l-${leaf.id}`} x1={cat.x} y1={cat.y} x2={leaf.x} y2={leaf.y}
              stroke={leaf.color} strokeWidth="1.5" opacity="0.4" />
          );
        })}
        {/* Center node */}
        <circle cx={nodes.center.x} cy={nodes.center.y} r={nodes.center.r}
          fill={nodes.center.color} opacity="0.9" />
        <text x={nodes.center.x} y={nodes.center.y} textAnchor="middle" dominantBaseline="central"
          fontSize="14" fontWeight="bold" fill="#1a1a2e">Python基础</text>
        {/* Category nodes */}
        {nodes.catNodes.map(cat => (
          <g key={cat.id}>
            <circle cx={cat.x} cy={cat.y} r={cat.r} fill={cat.color} opacity="0.85" />
            <text x={cat.x} y={cat.y} textAnchor="middle" dominantBaseline="central"
              fontSize="11" fontWeight="bold" fill="#1a1a2e">{cat.label}</text>
          </g>
        ))}
        {/* Leaf nodes */}
        {nodes.leafNodes.map(leaf => (
          <g key={leaf.id} onClick={() => onSelect(leaf.id)} style={{ cursor: 'pointer' }}>
            <circle cx={leaf.x} cy={leaf.y} r={leaf.r} fill="#1e2749" stroke={leaf.color} strokeWidth="2" />
            <text x={leaf.x} y={leaf.y} textAnchor="middle" dominantBaseline="central"
              fontSize="9" fill="white">{leaf.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─── Home Page ─── */
function HomePage({ onSelect }: { onSelect: (item: KnowledgeItem) => void }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  const filtered = useMemo(() => {
    let list = searchKnowledge(query);
    if (activeCategory !== '全部') {
      list = list.filter(k => k.category === activeCategory);
    }
    return list;
  }, [query, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Python 编程基础知识库</h1>
          <p className="text-slate-400 mb-6">涵盖 25 个核心知识点，6 大知识模块，助你系统掌握 Python 基础</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-amber-400" /> {knowledgeList.length} 个知识点</span>
            <span className="flex items-center gap-1"><FileQuestion className="w-4 h-4 text-emerald-400" /> {knowledgeList.reduce((s, k) => s + k.qa_pairs.length, 0)} 道问答</span>
            <span className="flex items-center gap-1"><LayoutGrid className="w-4 h-4 text-sky-400" /> {categories.length} 大模块</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="搜索知识点、定义、问答..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={activeCategory === '全部' ? 'default' : 'outline'}
            className={`cursor-pointer px-3 py-1.5 text-sm ${activeCategory === '全部' ? 'bg-amber-400 text-slate-900 hover:bg-amber-500' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
            onClick={() => setActiveCategory('全部')}
          >
            全部
          </Badge>
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1.5 text-sm"
              style={activeCategory === cat
                ? { backgroundColor: categoryColors[cat], color: '#1a1a2e', borderColor: categoryColors[cat] }
                : { borderColor: categoryColors[cat], color: categoryColors[cat] }
              }
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Filter className="w-4 h-4" />
        <span>共 {filtered.length} 个知识点</span>
        {query && <span className="text-amber-400">（搜索: &quot;{query}&quot;）</span>}
      </div>

      {/* Knowledge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <Card
            key={item.id}
            className="bg-slate-800/50 border-slate-700 hover:border-slate-500 transition-all cursor-pointer group"
            onClick={() => onSelect(item)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: `${categoryColors[item.category]}22`,
                    color: categoryColors[item.category],
                    borderColor: categoryColors[item.category],
                  }}
                  variant="outline"
                >
                  {item.category}
                </Badge>
                <span className="text-xs text-slate-500 font-mono">#{String(item.id).padStart(2, '0')}</span>
              </div>
              <CardTitle className="text-lg text-white group-hover:text-amber-400 transition-colors mt-2">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 line-clamp-2 mb-3">{item.definition}</p>
              <div className="flex flex-wrap gap-1.5">
                {item.key_points.slice(0, 3).map((kp, i) => (
                  <span key={i} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded">
                    {kp}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/50">
                <span className="text-xs text-slate-500">{item.qa_pairs.length} 个问答</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>没有找到匹配的知识点</p>
          <Button variant="outline" className="mt-3 border-slate-600 text-slate-300" onClick={() => { setQuery(''); setActiveCategory('全部'); }}>
            清除筛选
          </Button>
        </div>
      )}
    </div>
  );
}

/* ─── Detail Page ─── */
function DetailPage({ item, onBack }: { item: KnowledgeItem; onBack: () => void }) {
  const img = imageMap[item.id];

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="border-slate-600 text-slate-300 hover:text-white">
        <ArrowLeft className="w-4 h-4 mr-1" /> 返回
      </Button>

      <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge
            className="text-sm px-3 py-1"
            style={{
              backgroundColor: `${categoryColors[item.category]}22`,
              color: categoryColors[item.category],
              borderColor: categoryColors[item.category],
            }}
            variant="outline"
          >
            {item.category}
          </Badge>
          <span className="text-sm text-slate-500 font-mono">知识点 #{String(item.id).padStart(2, '0')}</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">{item.title}</h1>

        {img && (
          <div className="mb-6 rounded-xl overflow-hidden border border-slate-600">
            <img src={img} alt={item.title} className="w-full object-cover" />
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> 定义
            </h2>
            <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-lg">{item.definition}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
              <Tag className="w-5 h-5" /> 核心要点
            </h2>
            <div className="flex flex-wrap gap-2">
              {item.key_points.map((kp, i) => (
                <span key={i} className="bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 px-3 py-1.5 rounded-lg text-sm">
                  {kp}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-sky-400 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" /> 问答练习
            </h2>
            <div className="space-y-3">
              {item.qa_pairs.map((qa, i) => (
                <Card key={i} className="bg-slate-800/80 border-slate-600">
                  <CardContent className="p-4">
                    <p className="font-medium text-white mb-2 flex items-start gap-2">
                      <span className="bg-sky-400/20 text-sky-400 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                      {qa.question}
                    </p>
                    <div className="ml-8 text-slate-400 text-sm border-l-2 border-sky-400/30 pl-3">
                      {qa.answer}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MindMap Page ─── */
function MindMapPage({ onSelect }: { onSelect: (id: number) => void }) {
  const [showGraph, setShowGraph] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">知识图谱</h1>
          <p className="text-slate-400 text-sm mt-1">以可视化方式探索 Python 知识体系</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={!showGraph ? 'default' : 'outline'}
            onClick={() => setShowGraph(false)}
            className={!showGraph ? 'bg-amber-400 text-slate-900 hover:bg-amber-500' : 'border-slate-600 text-slate-300'}
          >
            <Map className="w-4 h-4 mr-1" /> 思维导图
          </Button>
          <Button
            variant={showGraph ? 'default' : 'outline'}
            onClick={() => setShowGraph(true)}
            className={showGraph ? 'bg-amber-400 text-slate-900 hover:bg-amber-500' : 'border-slate-600 text-slate-300'}
          >
            <Brain className="w-4 h-4 mr-1" /> 交互图谱
          </Button>
        </div>
      </div>

      {!showGraph ? (
        <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/30">
          <img src="/mindmap.png" alt="Python知识思维导图" className="w-full" />
        </div>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <p className="text-sm text-slate-400 mb-4 text-center">点击节点查看知识点详情</p>
          <KnowledgeGraph onSelect={onSelect} />
        </Card>
      )}
    </div>
  );
}

/* ─── Quiz Page ─── */
function QuizPage() {
  const allQA = useMemo(() => getAllQA(), []);
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<{ q: string; correct: string; user: string }[]>([]);
  const [finished, setFinished] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const shuffle = useCallback(() => {
    const shuffled = [...allQA].sort(() => Math.random() - 0.5).slice(0, 10);
    return shuffled;
  }, [allQA]);

  const [quizSet, setQuizSet] = useState(() => shuffle());

  const current = quizSet[currentIdx];
  const options = useMemo(() => {
    if (!current) return [];
    const wrongAnswers = allQA
      .filter(qa => qa.qa.answer !== current.qa.answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(qa => qa.qa.answer);
    return [current.qa.answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
  }, [current, allQA]);

  const handleAnswer = () => {
    if (!selected || !current) return;
    const isCorrect = selected === current.qa.answer;
    if (isCorrect) setScore(s => s + 1);
    else setWrong(w => [...w, { q: current.qa.question, correct: current.qa.answer, user: selected }]);
    setShowAnswer(true);
  };

  const next = () => {
    if (currentIdx + 1 >= quizSet.length) {
      setFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected('');
      setShowAnswer(false);
    }
  };

  const restart = () => {
    const newSet = shuffle();
    setQuizSet(newSet);
    setCurrentIdx(0);
    setSelected('');
    setScore(0);
    setWrong([]);
    setFinished(false);
    setShowAnswer(false);
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 pt-10">
        <HelpCircle className="w-16 h-16 text-amber-400 mx-auto" />
        <h1 className="text-3xl font-bold text-white">知识问答测试</h1>
        <p className="text-slate-400">随机抽取 10 道题目，检验你的 Python 基础知识掌握程度</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl font-bold text-amber-400">10</div>
            <div className="text-sm text-slate-400">题目数量</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl font-bold text-emerald-400">4</div>
            <div className="text-sm text-slate-400">选项/题</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl font-bold text-sky-400">{allQA.length}</div>
            <div className="text-sm text-slate-400">题库总量</div>
          </div>
        </div>
        <Button onClick={() => setStarted(true)} className="bg-amber-400 text-slate-900 hover:bg-amber-500 text-lg px-8 py-3">
          <Play className="w-5 h-5 mr-2" /> 开始测试
        </Button>
      </div>
    );
  }

  if (finished) {
    const accuracy = Math.round((score / quizSet.length) * 100);
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">测试结果</h1>

        <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
          <div className="text-5xl font-bold text-amber-400 mb-2">{accuracy}%</div>
          <p className="text-slate-400 mb-4">正确率</p>
          <Progress value={accuracy} className="h-3 mb-4" />
          <div className="flex justify-center gap-6 text-sm">
            <span className="flex items-center gap-1 text-emerald-400"><CheckCircle className="w-4 h-4" /> 正确 {score} 题</span>
            <span className="flex items-center gap-1 text-red-400"><XCircle className="w-4 h-4" /> 错误 {wrong.length} 题</span>
          </div>
        </Card>

        {wrong.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> 错题回顾
            </h2>
            {wrong.map((w, i) => (
              <Card key={i} className="bg-slate-800/50 border-red-400/30">
                <CardContent className="p-4 space-y-2">
                  <p className="text-white font-medium">{i + 1}. {w.q}</p>
                  <p className="text-sm"><span className="text-red-400">你的答案:</span> <span className="text-slate-300">{w.user}</span></p>
                  <p className="text-sm"><span className="text-emerald-400">正确答案:</span> <span className="text-slate-300">{w.correct}</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button onClick={restart} className="bg-amber-400 text-slate-900 hover:bg-amber-500">
            <RotateCcw className="w-4 h-4 mr-2" /> 重新测试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400 whitespace-nowrap">{currentIdx + 1} / {quizSet.length}</span>
        <Progress value={((currentIdx + 1) / quizSet.length) * 100} className="h-2 flex-1" />
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-sky-400/20 text-sky-400 border-sky-400/30">{current?.item.category}</Badge>
            <span className="text-xs text-slate-500">来自: {current?.item.title}</span>
          </div>
          <CardTitle className="text-xl text-white leading-relaxed">{current?.qa.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup value={selected} onValueChange={setSelected} disabled={showAnswer}>
            {options.map((opt, i) => {
              let borderClass = 'border-slate-600';
              let bgClass = 'bg-slate-800/50';
              if (showAnswer) {
                if (opt === current?.qa.answer) { borderClass = 'border-emerald-400'; bgClass = 'bg-emerald-400/10'; }
                else if (opt === selected) { borderClass = 'border-red-400'; bgClass = 'bg-red-400/10'; }
              } else if (selected === opt) {
                borderClass = 'border-amber-400';
                bgClass = 'bg-amber-400/10';
              }
              return (
                <div key={i} className={`flex items-center space-x-3 rounded-lg border p-4 transition-all ${borderClass} ${bgClass}`}>
                  <RadioGroupItem value={opt} id={`opt-${i}`} disabled={showAnswer} className="border-slate-500" />
                  <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-slate-200">{opt}</Label>
                  {showAnswer && opt === current?.qa.answer && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                  {showAnswer && opt === selected && opt !== current?.qa.answer && <XCircle className="w-5 h-5 text-red-400" />}
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {!showAnswer ? (
          <Button onClick={handleAnswer} disabled={!selected} className="bg-amber-400 text-slate-900 hover:bg-amber-500 disabled:opacity-50">
            确认答案
          </Button>
        ) : (
          <Button onClick={next} className="bg-sky-400 text-slate-900 hover:bg-sky-500">
            {currentIdx + 1 >= quizSet.length ? '查看结果' : '下一题'} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ─── Feedback Page ─── */
function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    try {
      const saved = localStorage.getItem('python_kb_feedback');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [type, setType] = useState<FeedbackItem['type']>('suggestion');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('python_kb_feedback', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    const item: FeedbackItem = {
      id: Date.now(),
      type,
      content: content.trim(),
      timestamp: new Date().toLocaleString('zh-CN'),
    };
    setFeedbacks(prev => [item, ...prev]);
    setContent('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const typeConfig: Record<FeedbackItem['type'], { label: string; icon: React.ReactNode; color: string }> = {
    bug: { label: 'Bug反馈', icon: <Bug className="w-4 h-4" />, color: '#EF4444' },
    suggestion: { label: '功能建议', icon: <Lightbulb className="w-4 h-4" />, color: '#F59E0B' },
    praise: { label: '点赞鼓励', icon: <ThumbsUp className="w-4 h-4" />, color: '#10B981' },
    other: { label: '其他', icon: <MessageSquare className="w-4 h-4" />, color: '#6B7280' },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">用户反馈</h1>
        <p className="text-slate-400 text-sm mt-1">帮助我们改进 Python 知识库</p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-slate-300 mb-2 block">反馈类型</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(typeConfig) as FeedbackItem['type'][]).map(t => (
                <Button
                  key={t}
                  variant={type === t ? 'default' : 'outline'}
                  onClick={() => setType(t)}
                  className={type === t
                    ? 'text-slate-900'
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  }
                  style={type === t ? { backgroundColor: typeConfig[t].color, borderColor: typeConfig[t].color } : {}}
                >
                  {typeConfig[t].icon}
                  <span className="ml-1">{typeConfig[t].label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-slate-300 mb-2 block">反馈内容</Label>
            <Textarea
              placeholder="请输入你的建议或问题..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-500 min-h-[120px]"
            />
          </div>

          {submitted && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-400/10 border border-emerald-400/30 rounded-lg p-3">
              <CheckCircle className="w-4 h-4" /> 反馈已提交，感谢你的建议！
            </div>
          )}

          <Button onClick={handleSubmit} disabled={!content.trim()} className="bg-amber-400 text-slate-900 hover:bg-amber-500 disabled:opacity-50">
            <Send className="w-4 h-4 mr-2" /> 提交反馈
          </Button>
        </CardContent>
      </Card>

      {feedbacks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-400" /> 历史反馈 ({feedbacks.length})
          </h2>
          {feedbacks.map(fb => (
            <Card key={fb.id} className="bg-slate-800/30 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: typeConfig[fb.type].color }}>{typeConfig[fb.type].icon}</span>
                  <span className="text-sm font-medium" style={{ color: typeConfig[fb.type].color }}>{typeConfig[fb.type].label}</span>
                  <span className="text-xs text-slate-500 ml-auto">{fb.timestamp}</span>
                </div>
                <p className="text-slate-300 text-sm">{fb.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Floating Feedback Button ─── */
function FloatingFeedbackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30 flex items-center justify-center hover:bg-amber-500 hover:scale-110 transition-all"
      title="用户反馈"
    >
      <MessageSquare className="w-6 h-6" />
    </button>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [prevPage, setPrevPage] = useState<Page>('home');

  const navigate = useCallback((p: Page) => {
    setPrevPage(page);
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const selectItem = useCallback((item: KnowledgeItem) => {
    setSelectedItem(item);
    setPrevPage(page);
    setPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const selectById = useCallback((id: number) => {
    const item = getKnowledgeById(id);
    if (item) selectItem(item);
  }, [selectItem]);

  const goBack = useCallback(() => {
    setPage(prevPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [prevPage]);

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white">
      <Header currentPage={page} onNavigate={navigate} />

      <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
        {page === 'home' && <HomePage onSelect={selectItem} />}
        {page === 'mindmap' && <MindMapPage onSelect={selectById} />}
        {page === 'quiz' && <QuizPage />}
        {page === 'feedback' && <FeedbackPage />}
        {page === 'detail' && selectedItem && <DetailPage item={selectedItem} onBack={goBack} />}
      </main>

      <FloatingFeedbackButton onClick={() => navigate('feedback')} />
    </div>
  );
}
