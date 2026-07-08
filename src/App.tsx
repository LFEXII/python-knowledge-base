import { useState, useMemo } from 'react'
import knowledgeData from './data/python_knowledge.json'

type Page = 'home' | 'mindmap' | 'quiz' | 'feedback' | 'detail'
type FeedbackItem = { id: number; type: 'bug' | 'suggestion' | 'praise' | 'other'; content: string; timestamp: string }

const categoryColors: Record<string, string> = {
  '基础概念': '#FF6B6B', '数据类型': '#4ECDC4', '数据结构': '#45B7D1',
  '流程控制': '#96CEB4', '函数': '#FFEAA7', '模块化': '#DDA0DD',
  '文件操作': '#87CEEB', '错误处理': '#F8C471', '面向对象': '#BB8FCE',
  '算法': '#85C1E9', '高级特性': '#F1948A', '文本处理': '#82E0AA', '内置工具': '#F7DC6F',
}

const categories = [...new Set(knowledgeData.map((k: any) => k.category))]

/* ─── 图片路径映射 ─── */
const getImagePath = (id: number): string => {
  const map: Record<number, string> = {
    1: '/python-knowledge-base/img_01_variables.png',
    2: '/python-knowledge-base/img_02_operators.png',
    3: '/python-knowledge-base/img_03_strings.png',
    4: '/python-knowledge-base/img_04_lists.png',
    5: '/python-knowledge-base/img_05_tuples.png',
    6: '/python-knowledge-base/img_06_dict.png',
    7: '/python-knowledge-base/img_07_set.png',
    8: '/python-knowledge-base/img_08_conditionals.png',
    9: '/python-knowledge-base/img_09_forloops.png',
    10: '/python-knowledge-base/img_10_whileloops.png',
    11: '/python-knowledge-base/img_11_breakcontinue.png',
    12: '/python-knowledge-base/img_12_functions.png',
    13: '/python-knowledge-base/img_13_parameters.png',
    14: '/python-knowledge-base/img_14_lambda.png',
    15: '/python-knowledge-base/img_15_comprehension.png',
    16: '/python-knowledge-base/img_16_import.png',
    17: '/python-knowledge-base/img_17_fileio.png',
    18: '/python-knowledge-base/img_18_exceptions.png',
    19: '/python-knowledge-base/img_19_classes.png',
    20: '/python-knowledge-base/img_20_inheritance.png',
    21: '/python-knowledge-base/img_21_recursion.png',
    22: '/python-knowledge-base/img_22_decorator.png',
    23: '/python-knowledge-base/img_23_iterators.png',
    24: '/python-knowledge-base/img_24_regex.png',
    25: '/python-knowledge-base/img_25_builtins.png',
  }
  return map[id] || ''
}

/* ─── Header ─── */
function Header({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const navs: { p: Page; label: string }[] = [
    { p: 'home', label: '知识库' },
    { p: 'mindmap', label: '思维导图' },
    { p: 'quiz', label: '问答测试' },
    { p: 'feedback', label: '反馈' },
  ]
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(51,65,85,0.5)', zIndex: 50 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => onNavigate('home')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 3.866 3.582 7 8 7s8-3.134 8-7a8 8 0 0 0-8-8z"/><path d="M9.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M14.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M9 15h6"/></svg>
          <span style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Python<span style={{ color: '#fbbf24' }}>知识库</span></span>
        </div>
        <nav style={{ display: 'flex', gap: 4 }}>
          {navs.map(n => (
            <button key={n.p} onClick={() => onNavigate(n.p)} style={{
              padding: '6px 12px', borderRadius: 8, border: page === n.p ? '1px solid rgba(251,191,36,0.3)' : '1px solid transparent',
              background: page === n.p ? 'rgba(251,191,36,0.15)' : 'transparent', color: page === n.p ? '#fbbf24' : '#cbd5e1',
              fontSize: 14, cursor: 'pointer', transition: 'all 0.2s'
            }}>{n.label}</button>
          ))}
        </nav>
      </div>
    </header>
  )
}

/* ─── Home ─── */
function HomePage({ onSelect }: { onSelect: (item: any) => void }) {
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState('全部')

  const filtered = useMemo(() => {
    let list = query ? knowledgeData.filter((k: any) =>
      k.title.includes(query) || k.definition.includes(query) || k.key_points.some((p: string) => p.includes(query))
    ) : [...knowledgeData]
    if (activeCat !== '全部') list = list.filter((k: any) => k.category === activeCat)
    return list
  }, [query, activeCat])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero */}
      <div style={{ borderRadius: 16, background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #334155', padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 256, height: 256, background: 'rgba(251,191,36,0.08)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <h1 style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8, position: 'relative' }}>Python 编程基础知识库</h1>
        <p style={{ color: '#94a3b8', marginBottom: 16, position: 'relative' }}>涵盖 25 个核心知识点，{categories.length} 大知识模块，助你系统掌握 Python 基础</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 14, color: '#cbd5e1', position: 'relative' }}>
          <span>25 个知识点</span><span>50 道问答</span><span>{categories.length} 大模块</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索知识点、定义、问答..."
          style={{ width: '100%', maxWidth: 500, padding: '10px 16px', borderRadius: 8, border: '1px solid #475569', background: 'rgba(30,41,59,0.5)', color: '#fff', fontSize: 14 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setActiveCat('全部')} style={{
            padding: '4px 12px', borderRadius: 6, border: '1px solid', fontSize: 13, cursor: 'pointer',
            background: activeCat === '全部' ? '#fbbf24' : 'transparent', color: activeCat === '全部' ? '#0f172a' : '#cbd5e1', borderColor: activeCat === '全部' ? '#fbbf24' : '#475569'
          }}>全部</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              padding: '4px 12px', borderRadius: 6, border: '1px solid', fontSize: 13, cursor: 'pointer',
              background: activeCat === cat ? (categoryColors[cat] || '#475569') : 'transparent',
              color: activeCat === cat ? '#0f172a' : (categoryColors[cat] || '#94a3b8'), borderColor: categoryColors[cat] || '#475569'
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {filtered.map((item: any) => {
          const imgPath = getImagePath(item.id)
          return (
            <div key={item.id} onClick={() => onSelect(item)} style={{
              borderRadius: 12, background: 'rgba(30,41,59,0.5)', border: '1px solid #334155',
              padding: 20, cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s', overflow: 'hidden'
            }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#64748b'; e.currentTarget.style.transform = 'translateY(-2px)' }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.transform = 'translateY(0)' }}>
              
              {/* 知识点配图 */}
              {imgPath && (
                <div style={{ margin: '-20px -20px 12px -20px', height: 160, overflow: 'hidden', background: '#0f172a' }}>
                  <img src={imgPath} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 6, border: `1px solid ${categoryColors[item.category] || '#475569'}33`, color: categoryColors[item.category] || '#94a3b8', background: `${categoryColors[item.category] || '#475569'}15` }}>{item.category}</span>
                <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>#{String(item.id).padStart(2, '0')}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 'bold', color: '#fff', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.definition}</p>
              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {item.key_points.slice(0, 3).map((kp: string, i: number) => (
                  <span key={i} style={{ fontSize: 12, background: 'rgba(51,65,85,0.5)', color: '#cbd5e1', padding: '2px 8px', borderRadius: 4 }}>{kp}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(51,65,85,0.3)' }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>{item.qa_pairs.length} 个问答</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>&rarr;</span>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>没有找到匹配的知识点</p>}
    </div>
  )
}

/* ─── Detail ─── */
function DetailPage({ item, onBack }: { item: any; onBack: () => void }) {
  const imgPath = getImagePath(item.id)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button onClick={onBack} style={{
        padding: '8px 16px', borderRadius: 8, border: '1px solid #475569',
        background: 'transparent', color: '#cbd5e1', cursor: 'pointer', fontSize: 14, width: 'fit-content'
      }}>&larr; 返回</button>

      <div style={{ borderRadius: 16, background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #334155', padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6, border: `1px solid ${categoryColors[item.category] || '#475569'}44`, color: categoryColors[item.category] || '#94a3b8', background: `${categoryColors[item.category] || '#475569'}18` }}>{item.category}</span>
          <span style={{ fontSize: 13, color: '#64748b', fontFamily: 'monospace' }}>知识点 #{String(item.id).padStart(2, '0')}</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 }}>{item.title}</h1>

        {/* 详情页大图 */}
        {imgPath && (
          <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 20, border: '1px solid #334155', maxHeight: 320, background: '#0f172a' }}>
            <img src={imgPath} alt={item.title} style={{ width: '100%', maxHeight: 320, objectFit: 'contain', display: 'block' }} />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 'bold', color: '#fbbf24', marginBottom: 8 }}>&#128214; 定义</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.6, background: 'rgba(30,41,59,0.5)', padding: 16, borderRadius: 8 }}>{item.definition}</p>
          </div>

          <div>
            <h2 style={{ fontSize: 17, fontWeight: 'bold', color: '#34d399', marginBottom: 8 }}>&#127991; 核心要点</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {item.key_points.map((kp: string, i: number) => (
                <span key={i} style={{ background: 'rgba(52,211,153,0.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.25)', padding: '6px 12px', borderRadius: 8, fontSize: 14 }}>{kp}</span>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 17, fontWeight: 'bold', color: '#38bdf8', marginBottom: 10 }}>&#128161; 问答练习</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {item.qa_pairs.map((qa: any, i: number) => (
                <div key={i} style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid #475569', borderRadius: 10, padding: 16 }}>
                  <p style={{ fontWeight: 500, color: '#fff', marginBottom: 8, display: 'flex', gap: 8 }}>
                    <span style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>{i + 1}</span>
                    {qa.question}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: 14, paddingLeft: 32, borderLeft: '2px solid rgba(56,189,248,0.25)' }}>{qa.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── MindMap ─── */
function MindMapPage() {
  const [mode, setMode] = useState<'img' | 'svg'>('img')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>知识图谱</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>以可视化方式探索 Python 知识体系</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setMode('img')} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', fontSize: 14, cursor: 'pointer', background: mode === 'img' ? '#fbbf24' : 'transparent', color: mode === 'img' ? '#0f172a' : '#cbd5e1', borderColor: mode === 'img' ? '#fbbf24' : '#475569' }}>思维导图</button>
          <button onClick={() => setMode('svg')} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', fontSize: 14, cursor: 'pointer', background: mode === 'svg' ? '#fbbf24' : 'transparent', color: mode === 'svg' ? '#0f172a' : '#cbd5e1', borderColor: mode === 'svg' ? '#fbbf24' : '#475569' }}>交互图谱</button>
        </div>
      </div>

      {mode === 'img' ? (
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #334155' }}>
          <img src="/python-knowledge-base/mindmap.png" alt="Python知识思维导图" style={{ width: '100%', display: 'block' }} />
        </div>
      ) : (
        <KnowledgeGraph />
      )}
    </div>
  )
}

/* ─── Knowledge Graph SVG ─── */
function KnowledgeGraph() {
  const catNodes = categories.map((cat, i) => {
    const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2
    return { id: 100 + i, x: 400 + Math.cos(angle) * 200, y: 300 + Math.sin(angle) * 180, label: cat, r: 35, color: categoryColors[cat] || '#888' }
  })
  const leafNodes = knowledgeData.map((k: any, i: number) => {
    const ci = categories.indexOf(k.category)
    const a = (ci / categories.length) * Math.PI * 2 - Math.PI / 2
    const off = ((i % 3) - 1) * 0.5
    return { id: k.id, x: 400 + Math.cos(a + off) * 320, y: 300 + Math.sin(a + off) * 260, label: k.title.length > 6 ? k.title.slice(0, 5) + '..' : k.title, r: 26, color: categoryColors[k.category] || '#888' }
  })

  return (
    <div style={{ borderRadius: 16, border: '1px solid #334155', background: '#0f172a', padding: 16, overflow: 'auto' }}>
      <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>Python 知识全景图 - 6大模块 25个知识点</p>
      <svg viewBox="0 0 800 600" style={{ width: '100%', maxWidth: 800, margin: '0 auto', display: 'block' }}>
        {catNodes.map(c => <line key={`lc${c.id}`} x1={400} y1={300} x2={c.x} y2={c.y} stroke={c.color} strokeWidth="2" opacity="0.5" />)}
        {leafNodes.map(l => { const c = catNodes[categories.indexOf((knowledgeData as any[]).find((k: any) => k.id === l.id)?.category || '')]; return c ? <line key={`ll${l.id}`} x1={c.x} y1={c.y} x2={l.x} y2={l.y} stroke={l.color} strokeWidth="1.2" opacity="0.3" /> : null })}
        <circle cx={400} cy={300} r={42} fill="#FFD700" opacity="0.9" />
        <text x={400} y={300} textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="bold" fill="#1a1a2e">Python基础</text>
        {catNodes.map(c => <g key={c.id}><circle cx={c.x} cy={c.y} r={c.r} fill={c.color} opacity="0.85" /><text x={c.x} y={c.y} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="bold" fill="#1a1a2e">{c.label}</text></g>)}
        {leafNodes.map(l => <g key={l.id}><circle cx={l.x} cy={l.y} r={l.r} fill="#1e2749" stroke={l.color} strokeWidth="1.5" /><text x={l.x} y={l.y} textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#fff">{l.label}</text></g>)}
      </svg>
    </div>
  )
}

/* ─── Quiz ─── */
function QuizPage() {
  const allQA = useMemo(() => {
    const qa: { q: string; a: string }[] = []
    knowledgeData.forEach((k: any) => k.qa_pairs.forEach((p: any) => qa.push({ q: p.question, a: p.answer })))
    return qa
  }, [])

  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState('')
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState<{ q: string; c: string; u: string }[]>([])
  const [finished, setFinished] = useState(false)
  const [showA, setShowA] = useState(false)

  const [quizSet] = useState(() => [...allQA].sort(() => Math.random() - 0.5).slice(0, 10))
  const current = quizSet[idx]
  const options = useMemo(() => {
    if (!current) return []
    const wrongs = allQA.filter(q => q.a !== current.a).sort(() => Math.random() - 0.5).slice(0, 3).map(q => q.a)
    return [current.a, ...wrongs].sort(() => Math.random() - 0.5)
  }, [current, allQA])

  const check = () => {
    if (!selected || !current) return
    const ok = selected === current.a
    if (ok) setScore(s => s + 1)
    else setWrong(w => [...w, { q: current.q, c: current.a, u: selected }])
    setShowA(true)
  }

  const next = () => {
    if (idx + 1 >= quizSet.length) setFinished(true)
    else { setIdx(i => i + 1); setSelected(''); setShowA(false) }
  }

  const restart = () => { setIdx(0); setSelected(''); setScore(0); setWrong([]); setFinished(false); setShowA(false); setStarted(true) }

  if (!started) return (
    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '40px 16px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 }}>知识问答测试</h1>
      <p style={{ color: '#94a3b8', marginBottom: 24 }}>随机抽取 10 道题目，检验你的 Python 基础</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[{ n: '10', l: '题目' }, { n: '4', l: '选项' }, { n: String(allQA.length), l: '题库' }].map((s, i) => (
          <div key={i} style={{ background: 'rgba(30,41,59,0.5)', borderRadius: 12, border: '1px solid #334155', padding: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#fbbf24' }}>{s.n}</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>{s.l}</div>
          </div>
        ))}
      </div>
      <button onClick={() => setStarted(true)} style={{ padding: '12px 32px', borderRadius: 8, background: '#fbbf24', color: '#0f172a', border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>开始测试</button>
    </div>
  )

  if (finished) {
    const acc = Math.round((score / quizSet.length) * 100)
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 16 }}>测试结果</h1>
        <div style={{ background: 'rgba(30,41,59,0.5)', borderRadius: 16, border: '1px solid #334155', padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 'bold', color: '#fbbf24' }}>{acc}%</div>
          <p style={{ color: '#94a3b8', marginBottom: 12 }}>正确率</p>
          <div style={{ height: 8, background: '#1e293b', borderRadius: 4, marginBottom: 12 }}>
            <div style={{ width: `${acc}%`, height: '100%', background: '#fbbf24', borderRadius: 4, transition: 'width 0.5s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 14 }}>
            <span style={{ color: '#34d399' }}>&#10003; 正确 {score} 题</span>
            <span style={{ color: '#f87171' }}>&#10007; 错误 {wrong.length} 题</span>
          </div>
        </div>
        {wrong.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h2 style={{ color: '#f87171', fontSize: 16, marginBottom: 8 }}>&#9888; 错题回顾</h2>
            {wrong.map((w, i) => (
              <div key={i} style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                <p style={{ color: '#fff', fontSize: 14, marginBottom: 4 }}>{i + 1}. {w.q}</p>
                <p style={{ color: '#f87171', fontSize: 13 }}>你的: {w.u}</p>
                <p style={{ color: '#34d399', fontSize: 13 }}>正确: {w.c}</p>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={restart} style={{ padding: '10px 24px', borderRadius: 8, background: '#fbbf24', color: '#0f172a', border: 'none', fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>重新测试</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 14, color: '#94a3b8', whiteSpace: 'nowrap' }}>{idx + 1} / {quizSet.length}</span>
        <div style={{ flex: 1, height: 6, background: '#1e293b', borderRadius: 3 }}><div style={{ width: `${((idx + 1) / quizSet.length) * 100}%`, height: '100%', background: '#38bdf8', borderRadius: 3 }} /></div>
      </div>

      <div style={{ background: 'rgba(30,41,59,0.5)', borderRadius: 16, border: '1px solid #334155', padding: 20 }}>
        <h2 style={{ fontSize: 18, color: '#fff', marginBottom: 16, lineHeight: 1.5 }}>{current?.q}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map((opt, i) => {
            let border = '1px solid #475569', bg = 'rgba(30,41,59,0.5)'
            if (showA) { if (opt === current?.a) { border = '1px solid #34d399'; bg = 'rgba(52,211,153,0.1)' } else if (opt === selected) { border = '1px solid #f87171'; bg = 'rgba(248,113,113,0.1)' } }
            else if (opt === selected) { border = '1px solid #fbbf24'; bg = 'rgba(251,191,36,0.1)' }
            return (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 8, border, background: bg, cursor: showA ? 'default' : 'pointer' }}>
                <input type="radio" name="quiz" value={opt} checked={selected === opt} onChange={() => !showA && setSelected(opt)} disabled={showA} style={{ accentColor: '#fbbf24' }} />
                <span style={{ flex: 1, color: '#e2e8f0', fontSize: 14 }}>{opt}</span>
                {showA && opt === current?.a && <span style={{ color: '#34d399' }}>&#10003;</span>}
                {showA && opt === selected && opt !== current?.a && <span style={{ color: '#f87171' }}>&#10007;</span>}
              </label>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        {!showA ? (
          <button onClick={check} disabled={!selected} style={{ padding: '8px 20px', borderRadius: 8, background: selected ? '#fbbf24' : '#475569', color: selected ? '#0f172a' : '#94a3b8', border: 'none', fontSize: 14, cursor: selected ? 'pointer' : 'not-allowed' }}>确认答案</button>
        ) : (
          <button onClick={next} style={{ padding: '8px 20px', borderRadius: 8, background: '#38bdf8', color: '#0f172a', border: 'none', fontSize: 14, cursor: 'pointer' }}>{idx + 1 >= quizSet.length ? '查看结果' : '下一题'} &rarr;</button>
        )}
      </div>
    </div>
  )
}

/* ─── Feedback ─── */
function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => { try { const s = localStorage.getItem('py_kb_fb'); return s ? JSON.parse(s) : [] } catch { return [] } })
  const [type, setType] = useState<FeedbackItem['type']>('suggestion')
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const tc: Record<FeedbackItem['type'], { label: string; color: string }> = {
    bug: { label: 'Bug反馈', color: '#EF4444' },
    suggestion: { label: '功能建议', color: '#F59E0B' },
    praise: { label: '点赞鼓励', color: '#10B981' },
    other: { label: '其他', color: '#6B7280' },
  }

  const submit = () => {
    if (!content.trim()) return
    const item: FeedbackItem = { id: Date.now(), type, content: content.trim(), timestamp: new Date().toLocaleString('zh-CN') }
    setFeedbacks(prev => [item, ...prev])
    setContent(''); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>用户反馈</h1>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>帮助我们改进知识库</p>
      </div>

      <div style={{ background: 'rgba(30,41,59,0.5)', borderRadius: 16, border: '1px solid #334155', padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#cbd5e1', fontSize: 14, display: 'block', marginBottom: 8 }}>反馈类型</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(Object.keys(tc) as FeedbackItem['type'][]).map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: '6px 14px', borderRadius: 8, border: '1px solid', fontSize: 13, cursor: 'pointer',
                background: type === t ? tc[t].color : 'transparent', color: type === t ? '#0f172a' : '#cbd5e1', borderColor: type === t ? tc[t].color : '#475569'
              }}>{tc[t].label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#cbd5e1', fontSize: 14, display: 'block', marginBottom: 8 }}>反馈内容</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="请输入建议或问题..."
            style={{ width: '100%', minHeight: 100, padding: 12, borderRadius: 8, border: '1px solid #475569', background: 'rgba(30,41,59,0.7)', color: '#fff', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
        </div>

        {submitted && <div style={{ color: '#34d399', fontSize: 14, marginBottom: 12, padding: '8px 12px', background: 'rgba(52,211,153,0.1)', borderRadius: 8, border: '1px solid rgba(52,211,153,0.3)' }}>&#10003; 反馈已提交！</div>}

        <button onClick={submit} disabled={!content.trim()} style={{
          padding: '8px 20px', borderRadius: 8, background: content.trim() ? '#fbbf24' : '#475569', color: content.trim() ? '#0f172a' : '#94a3b8',
          border: 'none', fontSize: 14, cursor: content.trim() ? 'pointer' : 'not-allowed'
        }}>提交反馈</button>
      </div>

      {feedbacks.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, color: '#fff', marginBottom: 10 }}>历史反馈 ({feedbacks.length})</h2>
          {feedbacks.map(fb => (
            <div key={fb.id} style={{ background: 'rgba(30,41,59,0.3)', borderRadius: 10, border: '1px solid #334155', padding: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: tc[fb.type].color, fontSize: 13, fontWeight: 'bold' }}>{tc[fb.type].label}</span>
                <span style={{ color: '#64748b', fontSize: 12, marginLeft: 'auto' }}>{fb.timestamp}</span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: 14 }}>{fb.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── App ─── */
export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [item, setItem] = useState<any>(null)
  const [prev, setPrev] = useState<Page>('home')

  const nav = (p: Page) => { setPrev(page); setPage(p); window.scrollTo(0, 0) }
  const sel = (it: any) => { setItem(it); setPrev(page); setPage('detail'); window.scrollTo(0, 0) }
  const back = () => { setPage(prev) }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e27', color: '#fff' }}>
      <Header page={page} onNavigate={nav} />
      <main style={{ paddingTop: 80, paddingBottom: 40, paddingLeft: 16, paddingRight: 16, maxWidth: 1280, margin: '0 auto' }}>
        {page === 'home' && <HomePage onSelect={sel} />}
        {page === 'mindmap' && <MindMapPage />}
        {page === 'quiz' && <QuizPage />}
        {page === 'feedback' && <FeedbackPage />}
        {page === 'detail' && item && <DetailPage item={item} onBack={back} />}
      </main>
    </div>
  )
}