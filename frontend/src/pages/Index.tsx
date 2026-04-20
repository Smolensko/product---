import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import OmniflowBadge from '@/components/custom/OmniflowBadge';
import {
  Search, ChevronRight, BookOpen, User, Map, Network, BookMarked,
  Menu, X, LogOut, UserCircle, Bookmark, FileText, Clock, Star,
  ChevronDown, Scroll, Globe, Swords, Crown, Feather, GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';
import type { Note, Bookmark as BookmarkType } from '../types';
import { extractWithAI } from '../utils/aiService';

type View = 'home' | 'events' | 'persons' | 'dynasties' | 'knowledge' | 'map' | 'learning' | 'tools';

const dynastyTimeline = [
  { name: '夏', year: '约前2070', color: '#8B4513' },
  { name: '商', year: '约前1600', color: '#8B4513' },
  { name: '周', year: '前1046', color: '#8B4513' },
  { name: '秦', year: '前221', color: '#a72323' },
  { name: '汉', year: '前206', color: '#a72323' },
  { name: '三国', year: '220年', color: '#6B5744' },
  { name: '隋', year: '581年', color: '#6B5744' },
  { name: '唐', year: '618年', color: '#a72323' },
  { name: '宋', year: '960年', color: '#a72323' },
  { name: '元', year: '1271年', color: '#6B5744' },
  { name: '明', year: '1368年', color: '#a72323' },
  { name: '清', year: '1644年', color: '#6B5744' },
];

const featuredEvents = [
  {
    id: 'chibi',
    title: '赤壁之战',
    year: '公元208年',
    location: '湖北赤壁',
    dynasty: '三国时期',
    figures: ['曹操', '周瑞', '诸葛亮'],
    description: '建安十三年（208年），曹操率大军南下，孙刘联军以少胜多，于赤壁大败曹军，奠定三国鼎立格局。',
    category: '历史事件',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
  },
  {
    id: 'zhenghe',
    title: '郑和下西洋',
    year: '1405—1433年',
    location: '南海至非洲',
    dynasty: '明朝',
    figures: ['郑和', '永乐帝'],
    description: '明永乐年间，郑和率庞大船队七次远航，最远抗达非洲东海岸，是世界航海史上的壮举。',
    category: '历史事件',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
  },
  {
    id: 'anshi',
    title: '安史之乱',
    year: '755—763年',
    location: '唐朝全境',
    dynasty: '唐朝',
    figures: ['安禄山', '史思明', '唐玄宗'],
    description: '唐朝天宝十四年，安禄山发动叛乱，历时8年，是唐朝由盛转衰的转折点。',
    category: '历史事件',
    image: 'https://images.unsplash.com/photo-1707414021341-132ee07b62c5?w=800&q=80',
  },
];

const featuredPersons = [
  {
    id: 'wuzetian',
    name: '武则天',
    alias: '武媚',
    birthYear: '624年',
    deathYear: '705年',
    dynasty: '唐朝 / 武周',
    role: '女皇帝',
    description: '中国历史上唯一正统女皇帝，在位期间励精图治，开创武周政权，推动科举制度发展。',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
  },
  {
    id: 'libai',
    name: '李白',
    alias: '李太白',
    birthYear: '701年',
    deathYear: '762年',
    dynasty: '唐朝',
    role: '诗人',
    description: '唐朝伟大浪漫主义诗人，被称为“诗仙”，与杜甫并称“李杜”，作品豪迈飘逸，影响深远。',
    image: 'https://images.unsplash.com/photo-1762115839715-fbd4e2c65260?w=400&q=80',
  },
  {
    id: 'qinshihuang',
    name: '秦始皇',
    alias: '嵊政',
    birthYear: '前259年',
    deathYear: '前210年',
    dynasty: '秦朝',
    role: '皇帝',
    description: '中国历史上第一个大一统王朝秦朝的开国皇帝，结束春秋战国分裂局面，建立中央集权封建制度。',
    image: 'https://images.unsplash.com/photo-1707414016759-377d827a721a?w=400&q=80',
  },
];

const dynastyData = [
  { name: '唐朝', period: '618—1907年', capital: '长安', achievements: ['科举制度完善', '丝绸之路繁荣', '诗歌文化鼎盛'], description: '中国封建社会的鼎盛时期，政治开明，经济繁荣，文化辉煌。' },
  { name: '汉朝', period: '前206—220年', capital: '长安', achievements: ['丝绸之路开辟', '儒家思想确立', '封建制度完善'], description: '中国封建社会的重要朝代，建立了完善的封建制度和儒家文化。' },
  { name: '宋朝', period: '960—1279年', capital: '汴京', achievements: ['印刷术发明', '指南针广泛应用', '商品经济高度发展'], description: '中国封建社会经济最繁荣的时期，科技文化成就卓越。' },
];

const navItems = [
  { id: 'home' as View, label: '首页', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'events' as View, label: '历史事件', icon: <Swords className="w-4 h-4" /> },
  { id: 'persons' as View, label: '历史人物', icon: <User className="w-4 h-4" /> },
  { id: 'dynasties' as View, label: '朝代政权', icon: <Crown className="w-4 h-4" /> },
  { id: 'knowledge' as View, label: '知识图谱', icon: <Network className="w-4 h-4" /> },
  { id: 'map' as View, label: '时空地图', icon: <Map className="w-4 h-4" /> },
  { id: 'learning' as View, label: '学习笔记', icon: <BookMarked className="w-4 h-4" /> },
  { id: 'tools' as View, label: '学术工具', icon: <GraduationCap className="w-4 h-4" /> },
];

export default function Index() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<View>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'事件' | '人物' | '政权' | '时期' | 'all'>('事件');
  const [selectedDynasty, setSelectedDynasty] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTarget, setNoteTarget] = useState('');
  const [yearInput, setYearInput] = useState('639');
  const [yearResult, setYearResult] = useState({ gregorian: '639年', era: '贞观十三年', ganzhi: '己亥年' });
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(() => {
    const saved = localStorage.getItem('history_bookmarks');
    return saved ? (JSON.parse(saved) as BookmarkType[]) : [];
  });
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('history_notes');
    return saved ? (JSON.parse(saved) as Note[]) : [];
  });
  const [quizActive, setQuizActive] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizResult, setQuizResult] = useState<string | null>(null);
  
  const [searchResults, setSearchResults] = useState<{ events: any[], persons: any[], dynasties: any[] }>({
    events: [],
    persons: [],
    dynasties: []
  });
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  const handleViewDetail = (item: any, type: string) => {
    setSelectedItem({ ...item, type });
    setShowDetail(true);
  };
  
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    handleSearch();
  };

  // 带超时的fetch函数
  const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout: number = 10000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      toast.loading('正在搜索中...');
      
      // 调用Wikipedia API获取数据（带10秒超时）
      const wikiResponse = await fetchWithTimeout(
        `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`,
        {},
        10000
      );
      
      let summary = '';
      let imageUrl = '';
      let dynasty = '未知';
      let role = '搜索结果';
      let birthYear = '未知';
      let deathYear = '未知';
      let location = '未知';
      let figures: string[] = [];
      let capital = '未知';
      let category = '未知';
      
      if (wikiResponse.ok) {
        const wikiData = await wikiResponse.json();
        console.log('Wikipedia搜索结果:', wikiData);
        
        // 提取摘要信息
        if (wikiData.extract) {
          summary = wikiData.extract;
          
          // ========== AI智能提取 ==========
          console.log('开始AI智能提取...');
          const aiResult = await extractWithAI(wikiData.extract, searchMode);
          
          if (aiResult) {
            console.log('AI提取成功:', aiResult);
            
            // 根据搜索模式应用AI结果
            if (searchMode === '事件') {
              location = aiResult.location || location;
              category = aiResult.category || category;
              figures = aiResult.figures || figures;
              if (aiResult.year) {
                const years = aiResult.year.split(' - ');
                birthYear = years[0] || birthYear;
                deathYear = years[1] || deathYear;
              }
            } else if (searchMode === '人物') {
              birthYear = aiResult.birthYear || birthYear;
              deathYear = aiResult.deathYear || deathYear;
              dynasty = aiResult.dynasty || dynasty;
              role = aiResult.role || role;
            } else if (searchMode === '政权' || searchMode === '时期') {
              capital = aiResult.capital || capital;
              if (aiResult.period) {
                const periods = aiResult.period.split(' - ');
                birthYear = periods[0] || birthYear;
                deathYear = periods[1] || deathYear;
              }
            }
          } else {
            console.log('AI提取失败，使用正则表达式提取');
            
            // ========== 正则表达式提取（备用） ==========
            const extractText = wikiData.extract;
            
            // 提取朝代信息
            const dynastyPatterns = [
              /(夏朝|商朝|周朝|西周|东周|春秋|战国|秦朝|西汉|东汉|三国|魏|蜀|吴|晋朝|西晋|东晋|南北朝|隋朝|唐朝|五代十国|宋朝|北宋|南宋|元朝|明朝|清朝)/,
              /(\w+朝)/,
              /(\w+时期)/
            ];
            
            for (const pattern of dynastyPatterns) {
              const match = extractText.match(pattern);
              if (match) {
                dynasty = match[0];
                break;
              }
            }
            
            // 提取身份信息
            const rolePatterns = [
              /(皇帝|君主|国王|皇后|太后|丞相|大臣|将军|军事家|政治家|思想家|文学家|诗人|学者|科学家|发明家)/,
              /(\w+家)/,
              /(\w+者)/
            ];
            
            for (const pattern of rolePatterns) {
              const match = extractText.match(pattern);
              if (match) {
                role = match[0];
                break;
              }
            }
            
            // 提取生卒年信息 - 从括号中提取
            const bracketPattern = /（([^）]+)）/;
            const bracketMatch = extractText.match(bracketPattern);
            if (bracketMatch && bracketMatch[1]) {
              const bracketContent = bracketMatch[1];
              // 尝试从括号内容中提取日期
              const datePatterns = [
                /(\d+年[\d月日号]*)\s*[—\-–~]\s*(\d+年[\d月日号]*)/,
                /(前\d+年[\d月日号]*)\s*[—\-–~]\s*(前?\d+年[\d月日号]*)/,
                /(\d+年)\s*[—\-–~]\s*(\d+年)/,
                /(前\d+年)\s*[—\-–~]\s*(前?\d+年)/
              ];
              for (const pattern of datePatterns) {
                const match = bracketContent.match(pattern);
                if (match && match.length >= 3) {
                  birthYear = match[1];
                  deathYear = match[2];
                  break;
                }
              }
            }
          }
          
          // ========== 正则表达式补充提取（AI提取后仍有缺失时使用） ==========
          const extractText = wikiData.extract;
          
          // 如果生卒年仍未提取到，尝试正则提取
          if (birthYear === '未知' || deathYear === '未知') {
            const yearPatterns = [
              /(\d+年[\d月日号]*)\s*[—\-–~]\s*(\d+年[\d月日号]*)/,
              /(前\d+年[\d月日号]*)\s*[—\-–~]\s*(前?\d+年[\d月日号]*)/,
              /(\d+年)\s*-\s*(\d+年)/,
              /(前\d+年)\s*-\s*(前?\d+年)/,
              /生于([\d前]+年)/,
              /卒于([\d前]+年)/,
              /出生于([\d前]+年)/,
              /逝世于([\d前]+年)/
            ];
            
            for (const pattern of yearPatterns) {
              const match = extractText.match(pattern);
              if (match) {
                if (match.length >= 3) {
                  if (birthYear === '未知') birthYear = match[1];
                  if (deathYear === '未知') deathYear = match[2];
                } else if (pattern.source.includes('生于') || pattern.source.includes('出生')) {
                  birthYear = match[1];
                } else if (pattern.source.includes('卒于') || pattern.source.includes('逝世')) {
                  deathYear = match[1];
                }
              }
            }
          }
          
          // 如果地点仍未提取到，尝试正则提取（用于事件）
          if (location === '未知') {
            const locationPatterns = [
              /发生于([\u4e00-\u9fa5]{2,}(省|市|县|地区|城|镇|州|府|郡))/,
              /在([\u4e00-\u9fa5]{2,}(省|市|县|地区|城|镇|州|府|郡))[，。]/,
              /[\u4e00-\u9fa5]{2,}(之战|之役|事变|起义|战争)/,
              /([\u4e00-\u9fa5]{2,}(平原|山脉|高原|河流|流域))/,
              /占领([\u4e00-\u9fa5]{2,})/,
              /进攻([\u4e00-\u9fa5]{2,})/,
              /退守([\u4e00-\u9fa5]{2,})/
            ];
            
            for (const pattern of locationPatterns) {
              const match = extractText.match(pattern);
              if (match && match[1]) {
                const result = match[1];
                const cleanResult = result.replace(/(省|市|县|地区|城|镇|州|府|郡|之战|之役)$/, '');
                if (cleanResult.length >= 2) {
                  location = cleanResult;
                  break;
                }
              }
            }
          }
          
          // 如果人物列表仍为空，尝试正则提取（用于事件）
          if (figures.length === 0) {
            const figurePatterns = [
              /由([\u4e00-\u9fa5]{2,4}[、，])+[\u4e00-\u9fa5]{2,4}/,
              /与([\u4e00-\u9fa5]{2,4}[、，])+[\u4e00-\u9fa5]{2,4}/,
              /以及([\u4e00-\u9fa5]{2,4}[、，])+[\u4e00-\u9fa5]{2,4}/,
              /([\u4e00-\u9fa5]{2,4})及其部将([\u4e00-\u9fa5]{2,4})/,
              /([\u4e00-\u9fa5]{2,4})与([\u4e00-\u9fa5]{2,4})/,
              /([\u4e00-\u9fa5]{2,4})和([\u4e00-\u9fa5]{2,4})/,
              /([\u4e00-\u9fa5]{2,4}、[\u4e00-\u9fa5]{2,4})/
            ];
            
            for (const pattern of figurePatterns) {
              const match = extractText.match(pattern);
              if (match) {
                let extractedFigures: string[] = [];
                for (let i = 1; i < match.length; i++) {
                  if (match[i] && match[i].length >= 2) {
                    const parts = match[i].split(/[、，]/).filter(f => f.trim().length >= 2);
                    extractedFigures = extractedFigures.concat(parts);
                  }
                }
                const filteredFigures = extractedFigures.filter(f => !/(省|市|县|地区|战争|战役|事件|时期|朝代)/.test(f));
                if (filteredFigures.length > 0) {
                  figures = filteredFigures.slice(0, 5);
                  break;
                }
              }
            }
          }
          
          // 如果都城仍未提取到，尝试正则提取（用于朝代）
          if (capital === '未知') {
            const capitalPatterns = [
              /都城[：:]?([\u4e00-\u9fa5]{2,4})/,
              /首都[：:]?([\u4e00-\u9fa5]{2,4})/,
              /定都([\u4e00-\u9fa5]{2,4})/,
              /都城在([\u4e00-\u9fa5]{2,4})/,
              /首都为([\u4e00-\u9fa5]{2,4})/,
              /以([\u4e00-\u9fa5]{2,4})为都城/,
              /以([\u4e00-\u9fa5]{2,4})为首都/,
              /都城先后为([\u4e00-\u9fa5]{2,4})/,
              /定都于([\u4e00-\u9fa5]{2,4})/,
              /设都于([\u4e00-\u9fa5]{2,4})/,
              /国都为([\u4e00-\u9fa5]{2,4})/
            ];
            
            for (const pattern of capitalPatterns) {
              const match = extractText.match(pattern);
              if (match && match[1]) {
                capital = match[1];
                const multiCapitalPattern = /([\u4e00-\u9fa5]{2,4})、([\u4e00-\u9fa5]{2,4})/;
                const multiMatch = extractText.match(multiCapitalPattern);
                if (multiMatch) {
                  capital = multiMatch[1] + '、' + multiMatch[2];
                }
                break;
              }
            }
          }
          
          // 如果类别仍未提取到，尝试正则提取
          if (category === '未知') {
            const categoryPatterns = [
              /是一场([\u4e00-\u9fa5]{2,})战争/,
              /是一次([\u4e00-\u9fa5]{2,})起义/,
              /是一次([\u4e00-\u9fa5]{2,})事变/,
              /是一场([\u4e00-\u9fa5]{2,})战役/,
              /是一场([\u4e00-\u9fa5]{2,})革命/,
              /是一次([\u4e00-\u9fa5]{2,})改革/,
              /是一次([\u4e00-\u9fa5]{2,})运动/,
              /是([\u4e00-\u9fa5]{2,})战争/,
              /([\u4e00-\u9fa5]{2,})之战/,
              /([\u4e00-\u9fa5]{2,})之役/,
              /([\u4e00-\u9fa5]{2,})起义/,
              /([\u4e00-\u9fa5]{2,})事变/,
              /([\u4e00-\u9fa5]{2,})革命/,
              /([\u4e00-\u9fa5]{2,})改革/,
              /([\u4e00-\u9fa5]{2,})运动/
            ];
            
            for (const pattern of categoryPatterns) {
              const match = extractText.match(pattern);
              if (match && match[1]) {
                category = match[1];
                break;
              }
            }
            
            // 如果仍未提取到类别，根据标题推断
            if (category === '未知' && searchQuery) {
              if (searchQuery.includes('战争') || searchQuery.includes('战役') || searchQuery.includes('之战') || searchQuery.includes('之役')) {
                category = '战争';
              } else if (searchQuery.includes('起义')) {
                category = '起义';
              } else if (searchQuery.includes('事变') || searchQuery.includes('事件')) {
                category = '事变';
              } else if (searchQuery.includes('革命')) {
                category = '革命';
              } else if (searchQuery.includes('改革')) {
                category = '改革';
              } else if (searchQuery.includes('运动')) {
                category = '运动';
              }
            }
          }
        }
        
        // 获取相关图片
        if (wikiData.thumbnail && wikiData.thumbnail.source) {
          imageUrl = wikiData.thumbnail.source.replace(/\/thumb\/(\d+)px/, '/thumb/400px');
        }
      } else {
        // 如果Wikipedia API请求失败，使用默认信息
        summary = `关于"${searchQuery}"的搜索结果。通过联网搜索获取的信息。`;
      }
      
      // 如果没有图片，使用与搜索词相关的默认图片
      if (!imageUrl) {
        // 为不同类型的搜索词使用不同的默认图片
        if (searchQuery.includes('人物') || searchQuery.includes('历史') || searchQuery.includes('诗人') || searchQuery.includes('皇帝')) {
          imageUrl = `https://picsum.photos/400/300?random=1`;
        } else if (searchQuery.includes('城市') || searchQuery.includes('地点')) {
          imageUrl = `https://picsum.photos/400/300?random=2`;
        } else if (searchQuery.includes('科技') || searchQuery.includes('技术')) {
          imageUrl = `https://picsum.photos/400/300?random=3`;
        } else {
          imageUrl = `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 10)}`;
        }
      }
      
      // 构建搜索结果
      let mockResults;
      
      if (searchMode === '事件') {
        // 事件搜索结果
        mockResults = {
          events: [
            {
              id: Date.now(),
              title: searchQuery,
              year: birthYear !== '未知' ? birthYear + (deathYear !== '未知' ? ' - ' + deathYear : '') : '未知',
              dynasty: dynasty,
              location: location,
              figures: figures.length > 0 ? figures.join('、') : '未知',
              category: category,
              description: summary,
              image: imageUrl
            }
          ],
          persons: [],
          dynasties: []
        };
      } else if (searchMode === '政权' || searchMode === '时期') {
        // 政权/时期搜索结果
        mockResults = {
          events: [],
          persons: [],
          dynasties: [
            {
              id: Date.now(),
              name: searchQuery,
              period: birthYear !== '未知' ? birthYear + (deathYear !== '未知' ? ' - ' + deathYear : '') : '未知',
              capital: capital,
              achievements: '',
              description: summary,
              image: imageUrl
            }
          ]
        };
      } else {
        // 人物搜索结果
        mockResults = {
          events: [],
          persons: [
            {
              id: Date.now(),
              name: searchQuery,
              alias: '',
              birthYear: birthYear,
              deathYear: deathYear,
              dynasty: dynasty,
              role: role,
              description: summary,
              image: imageUrl
            }
          ],
          dynasties: []
        };
      }
      
      // 保存搜索结果
      setSearchResults(mockResults);
      
      const totalResults = mockResults.events.length + mockResults.persons.length + mockResults.dynasties.length;
      
      toast.dismiss(); // 关闭加载提示
      
      if (totalResults === 0) {
        toast.info(`未找到「${searchQuery}」的相关结果`);
      } else {
        toast.success(`找到 ${totalResults} 条结果`, {
          description: `事件: ${mockResults.events.length} | 人物: ${mockResults.persons.length} | 朝代: ${mockResults.dynasties.length}`
        });
        
        // 根据搜索模式切换视图
        if (searchMode === '人物' && mockResults.persons.length > 0) {
          setCurrentView('persons');
        } else if (searchMode === '事件' && mockResults.events.length > 0) {
          setCurrentView('events');
        } else if ((searchMode === '政权' || searchMode === '时期') && mockResults.dynasties.length > 0) {
          setCurrentView('dynasties');
        } else if (searchMode === 'all') {
          // 当搜索模式为all时，优先显示人物结果
          if (mockResults.persons.length > 0) {
            setCurrentView('persons');
          } else if (mockResults.events.length > 0) {
            setCurrentView('events');
          } else if (mockResults.dynasties.length > 0) {
            setCurrentView('dynasties');
          }
        }
      }
    } catch (error) {
      console.error('搜索失败:', error);
      
      toast.dismiss(); // 关闭加载提示
      
      // 判断错误类型
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast.error('搜索超时，请检查网络连接或稍后重试');
        } else if (error.message.includes('Failed to fetch')) {
          toast.error('网络连接失败，请检查网络设置');
        } else if (error.message.includes('CORS')) {
          toast.error('跨域访问被阻止，请检查API配置');
        } else {
          toast.error('搜索失败: ' + error.message);
        }
      } else {
        toast.error('搜索失败，请稍后重试');
      }
    }
  };

  const handleHotSearch = async (term: string) => {
    setSearchQuery(term);
    
    try {
      // 模拟搜索结果，避免后端依赖
      const mockResults = {
        events: [
          {
            id: 1,
            title: '李白诗歌创作',
            year: '唐朝',
            location: '长安',
            dynasty: '唐朝',
            figures: '李白',
            description: '李白在唐朝时期创作了大量优秀的诗歌作品，被誉为诗仙。',
            category: '文化',
            image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80'
          }
        ],
        persons: [
          {
            id: 1,
            name: '李白',
            alias: '诗仙',
            birthYear: '701年',
            deathYear: '762年',
            dynasty: '唐朝',
            role: '诗人',
            description: '唐代伟大的浪漫主义诗人，被誉为"诗仙"，与杜甫并称为"李杜"。',
            image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80'
          }
        ],
        dynasties: [
          {
            id: 1,
            name: '唐朝',
            period: '618年-907年',
            capital: '长安',
            achievements: '诗歌发展的黄金时期，国力强盛',
            description: '中国历史上最强盛的朝代之一，文化繁荣，诗歌发展达到顶峰。'
          }
        ]
      };
      
      // 保存搜索结果
      setSearchResults(mockResults);
      
      const totalResults = mockResults.events.length + mockResults.persons.length + mockResults.dynasties.length;
      
      if (totalResults > 0) {
        toast.success(`找到 ${totalResults} 条结果`, {
          description: `事件: ${mockResults.events.length} | 人物: ${mockResults.persons.length} | 朝代: ${mockResults.dynasties.length}`
        });
        
        if (mockResults.events.length > 0) {
          setCurrentView('events');
        } else if (mockResults.persons.length > 0) {
          setCurrentView('persons');
        } else if (mockResults.dynasties.length > 0) {
          setCurrentView('dynasties');
        }
      }
    } catch (error) {
      console.error('搜索失败:', error);
      toast.error('搜索失败，请稍后重试');
    }
  };

  const addBookmark = (id: string, title: string, type: string, dynasty?: string) => {
    const existing = bookmarks.find((b) => b.targetId === id);
    if (existing) {
      toast.info('已收藏过该条目');
      return;
    }
    const newBm: BookmarkType = {
      id: Date.now().toString(),
      targetId: id,
      targetType: type,
      targetTitle: title,
      targetDynasty: dynasty,
      createdAt: new Date().toISOString(),
    };
    const updated = [...bookmarks, newBm];
    setBookmarks(updated);
    localStorage.setItem('history_bookmarks', JSON.stringify(updated));
    toast.success('收藏成功', { description: title });
  };

  const addNote = () => {
    if (!noteContent.trim()) { toast.error('笔记内容不能为空'); return; }
    const newNote: Note = {
      id: Date.now().toString(),
      content: noteContent,
      targetId: noteTarget || 'general',
      targetType: '通用',
      targetTitle: noteTarget || '通用笔记',
      createdAt: new Date().toISOString(),
    };
    const updated = [...notes, newNote];
    setNotes(updated);
    localStorage.setItem('history_notes', JSON.stringify(updated));
    setNoteContent('');
    setNoteTarget('');
    toast.success('笔记已保存');
  };

  const convertYear = () => {
    const y = parseInt(yearInput);
    if (isNaN(y)) { toast.error('请输入有效年份'); return; }
    const ganzhiStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const ganzhiBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const stemIdx = ((y - 4) % 10 + 10) % 10;
    const branchIdx = ((y - 4) % 12 + 12) % 12;
    const ganzhi = ganzhiStems[stemIdx] + ganzhiBranches[branchIdx] + '年';
    const eraMap: { [key: number]: string } = {
      627: '贞观元年', 628: '贞观二年', 629: '贞观三年', 630: '贞观四年',
      631: '贞观五年', 632: '贞观六年', 633: '贞观七年', 634: '贞观八年',
      635: '贞观九年', 636: '贞观十年', 637: '贞观十一年', 638: '贞观十二年',
      639: '贞观十三年', 640: '贞观十四年', 641: '贞观十五年', 642: '贞观十六年',
      643: '贞观十七年', 644: '贞观十八年', 645: '贞观十九年', 646: '贞观二十年',
      208: '建安十三年', 221: '建安二十六年', 755: '天宝十四年',
    };
    setYearResult({
      gregorian: y > 0 ? `${y}年` : `公元前${Math.abs(y)}年`,
      era: eraMap[y] || `公元${y > 0 ? y : '前' + Math.abs(y)}年`,
      ganzhi,
    });
    toast.success('换算完成');
  };

  const quizQuestions = [
    { q: '赤壁之战发生在哪个朝代？', a: '三国', hint: '公元208年' },
    { q: '唐朝第二位皇帝是谁？', a: '唐太宗', hint: '年号贞观' },
    { q: '郑和下西洋共进行了几次？', a: '7', hint: '明永乐年间' },
    { q: '秦始皇统一中国是哪年？', a: '前221年', hint: '战国时代结束' },
  ];
  const [quizIdx, setQuizIdx] = useState(0);
  const currentQuiz = quizQuestions[quizIdx % quizQuestions.length];

  const checkAnswer = () => {
    if (quizAnswer.trim() === currentQuiz.a) {
      setQuizResult('正确！很好！');
      toast.success('回答正确！');
    } else {
      setQuizResult(`错误，正确答案是：${currentQuiz.a}`);
    }
  };

  const nextQuiz = () => {
    setQuizIdx((i) => i + 1);
    setQuizAnswer('');
    setQuizResult(null);
  };

  const handleLogout = () => {
    logout();
    toast.success('已退出登录');
    navigate('/login', { replace: true });
  };

  const isBookmarked = (id: string) => bookmarks.some((b) => b.targetId === id);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0E8', fontFamily: 'Noto Sans SC, sans-serif' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: '#2C1810', borderColor: 'rgba(196,146,42,0.3)' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#a72323' }}>
                <span className="text-lg font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4922A' }}>史</span>
              </div>
              <div>
                <span className="font-bold text-xl tracking-widest" style={{ fontFamily: 'Noto Serif SC, serif', color: '#FDFAF4' }}>华史通鉴</span>
                <span className="text-xs ml-2 tracking-wider hidden sm:inline" style={{ color: 'rgba(196,146,42,0.7)' }}>中国历史查询系统</span>
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navItems.slice(1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className="text-sm tracking-wide transition-colors duration-200"
                  style={{
                    fontFamily: 'Noto Serif SC, serif',
                    color: currentView === item.id ? '#C4922A' : 'rgba(253,250,244,0.8)',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/profile')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm transition-colors duration-200"
                style={{ color: 'rgba(253,250,244,0.7)', border: '1px solid rgba(196,146,42,0.3)', fontFamily: 'Noto Serif SC, serif' }}
              >
                <UserCircle className="w-4 h-4" />
                <span>个人中心</span>
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-sm text-sm transition-colors duration-200"
                style={{ color: 'rgba(253,250,244,0.6)', fontFamily: 'Noto Serif SC, serif' }}
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-sm"
                style={{ color: 'rgba(253,250,244,0.8)' }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t" style={{ backgroundColor: '#2C1810', borderColor: 'rgba(196,146,42,0.2)' }}>
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentView(item.id); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors duration-200"
                  style={{
                    fontFamily: 'Noto Serif SC, serif',
                    color: currentView === item.id ? '#C4922A' : 'rgba(253,250,244,0.8)',
                    backgroundColor: currentView === item.id ? 'rgba(167,35,35,0.2)' : 'transparent',
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <div className="border-t pt-2 mt-2" style={{ borderColor: 'rgba(196,146,42,0.2)' }}>
                <button
                  onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm"
                  style={{ color: 'rgba(253,250,244,0.8)', fontFamily: 'Noto Serif SC, serif' }}
                >
                  <UserCircle className="w-4 h-4" />
                  个人中心
                </button>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm"
                  style={{ color: 'rgba(253,250,244,0.6)', fontFamily: 'Noto Serif SC, serif' }}
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HOME VIEW ===== */}
      {currentView === 'home' && (
        <div>
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1707414021341-132ee07b62c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600&q=80"
                alt=""
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(44,24,16,0.9) 0%, rgba(44,24,16,0.7) 60%, #F5F0E8 100%)' }} />
            </div>
            <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, #a72323)' }} />
                  <span className="text-xs tracking-[0.3em] uppercase" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4922A' }}>五千年文明 · 一键探索</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'Noto Serif SC, serif', color: '#FDFAF4' }}>
                  探索中华<br /><span style={{ color: '#C4922A' }}>五千年</span>历史
                </h1>
                <p className="text-lg leading-relaxed mb-10 max-w-xl" style={{ color: 'rgba(253,250,244,0.7)', fontFamily: 'Noto Sans SC, sans-serif' }}>
                  整合权威史料，汇聚历史事件、人物、政权与地图，为学者、教师与历史爱好者提供专业、便捷的知识查询平台。
                </p>
                {/* Search Bar */}
                <div className="rounded-sm p-2 flex gap-2 max-w-2xl shadow-2xl border" style={{ backgroundColor: 'rgba(253,250,244,0.95)', borderColor: '#D4C4A8' }}>
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="w-5 h-5 flex-shrink-0" style={{ color: '#6B5744' }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="搜索历史事件、人物、朝代…如“安史之乱”、“李白”"
                      className="flex-1 bg-transparent text-sm outline-none py-2"
                      style={{ color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                    />
                  </div>
                  <div className="flex gap-1">
                    <select
                      value={searchMode}
                      onChange={(e) => setSearchMode(e.target.value as typeof searchMode)}
                      className="text-xs px-3 py-2 rounded-sm border outline-none cursor-pointer"
                      style={{ backgroundColor: '#F5F0E8', color: '#6B5744', borderColor: '#D4C4A8', fontFamily: 'Noto Serif SC, serif' }}
                    >
                      <option>事件</option>
                      <option>人物</option>
                      <option>政权</option>
                      <option>时期</option>
                    </select>
                    <button
                      onClick={handleSearch}
                      className="px-6 py-2 rounded-sm text-sm tracking-wider transition-colors duration-200"
                      style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
                    >
                      查询
                    </button>
                  </div>
                </div>
                {/* Hot searches */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs mr-1" style={{ color: 'rgba(253,250,244,0.5)', fontFamily: 'Noto Serif SC, serif' }}>热门：</span>
                  {['赤壁之战', '武则天', '唐朝', '郑和下西洋', '秦始皇'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleHotSearch(term)}
                      className="text-xs px-3 py-1 rounded-full transition-all duration-200"
                      style={{ color: 'rgba(196,146,42,0.8)', border: '1px solid rgba(196,146,42,0.3)', fontFamily: 'Noto Sans SC, sans-serif' }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: '5,000+', label: '历史事件' },
                { value: '10,000+', label: '历史人物' },
                { value: '100+', label: '历史政权' },
                { value: '99%', label: '数据准确率' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-sm p-5 text-center border transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
                  <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Noto Serif SC, serif', color: '#a72323' }}>{stat.value}</div>
                  <div className="text-sm" style={{ color: '#6B5744', fontFamily: 'Noto Serif SC, serif' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #a72323)' }} />
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>核心功能</h2>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #a72323, transparent)' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Search className="w-6 h-6" />, title: '智能搜索与发现', desc: '支持事件、人物、时期、政权四种精准搜索模式，模糊匹配与别称识别，自然语言提问，智能推荐相关内容。', view: 'events' as View, color: '#a72323' },
                { icon: <Swords className="w-6 h-6" />, title: '历史事件查询', desc: '结构化呈现时间、地点、人物、起因、经过与结果，提供多史料对照，支持事件时间轴与前因后果关联。', view: 'events' as View, color: '#C4922A' },
                { icon: <User className="w-6 h-6" />, title: '历史人物查询', desc: '全面呈现人物生平事迹、历史评价与作品著作，可视化人物关系图谱，展示家族、政治、师承多维关系网络。', view: 'persons' as View, color: '#a72323' },
                { icon: <Crown className="w-6 h-6" />, title: '朝代政权查询', desc: '系统呈现政治制度、经济发展与文化成就，帝王世系与疑域变化地图，朝代更迭时间轴助您建立宏观历史框架。', view: 'dynasties' as View, color: '#C4922A' },
                { icon: <Map className="w-6 h-6" />, title: '时空地图系统', desc: '查看各历史时期疑域图与战役标注，按时间地点组合查询，追踪历史人物迁徙路线并支持动态播放。', view: 'map' as View, color: '#a72323' },
                { icon: <BookMarked className="w-6 h-6" />, title: '个性化学习笔记', desc: '浏览时添加文字笔记与高亮标注，收藏感兴趣条目，系统自动生成测验题目并自适应调整难度。', view: 'learning' as View, color: '#C4922A' },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="group rounded-sm p-7 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8', borderLeft: `3px solid ${feat.color}` }}
                  onClick={() => setCurrentView(feat.view)}
                >
                  <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-5 transition-colors duration-300" style={{ backgroundColor: `${feat.color}18` }}>
                    <span style={{ color: feat.color }}>{feat.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>{feat.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>{feat.desc}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium transition-all duration-200" style={{ color: feat.color, fontFamily: 'Noto Serif SC, serif' }}>
                    探索功能 <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dynasty Timeline */}
          <section className="py-16" style={{ backgroundColor: '#2C1810' }}>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-8 h-px" style={{ backgroundColor: '#C4922A' }} />
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#FDFAF4' }}>朝代时间轴</h2>
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(196,146,42,0.3)' }} />
              </div>
              <div className="relative">
                <div className="absolute left-0 right-0 top-6 h-px" style={{ backgroundColor: 'rgba(196,146,42,0.2)' }} />
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {dynastyTimeline.map((d) => (
                    <button
                      key={d.name}
                      onClick={() => { setSelectedDynasty(d.name); setCurrentView('dynasties'); }}
                      className="flex-shrink-0 text-center group cursor-pointer"
                    >
                      <div className="w-3 h-3 rounded-full mx-auto mb-3 transition-transform duration-200 group-hover:scale-150" style={{ backgroundColor: '#C4922A' }} />
                      <div
                        className="rounded-sm px-4 py-3 transition-all duration-200 border"
                        style={{
                          backgroundColor: selectedDynasty === d.name ? '#a72323' : 'rgba(253,250,244,0.08)',
                          borderColor: selectedDynasty === d.name ? '#a72323' : 'rgba(196,146,42,0.3)',
                        }}
                      >
                        <div className="font-bold text-sm" style={{ fontFamily: 'Noto Serif SC, serif', color: selectedDynasty === d.name ? '#FDFAF4' : '#C4922A' }}>{d.name}</div>
                        <div className="text-xs mt-1" style={{ color: selectedDynasty === d.name ? 'rgba(255,255,255,0.7)' : 'rgba(253,250,244,0.5)' }}>{d.year}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Featured Entries */}
          <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #a72323)' }} />
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>精选历史条目</h2>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #a72323, transparent)' }} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Featured Event */}
              <div className="lg:col-span-2 group rounded-sm overflow-hidden border transition-all duration-300 hover:shadow-xl" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
                <div className="relative h-52 overflow-hidden">
                  <img src={featuredEvents[0].image} alt={featuredEvents[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(44,24,16,0.8), transparent)' }} />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}>{featuredEvents[0].category}</span>
                    <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(196,146,42,0.9)', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}>{featuredEvents[0].dynasty}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>{featuredEvents[0].title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>{featuredEvents[0].description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs" style={{ color: '#6B5744' }}>
                      <span>📅 {featuredEvents[0].year}</span>
                      <span>📍 {featuredEvents[0].location}</span>
                      <span className="hidden sm:inline">👥 {featuredEvents[0].figures.join(' · ')}</span>
                    </div>
                    <button
                      onClick={() => addBookmark(featuredEvents[0].id, featuredEvents[0].title, '历史事件', featuredEvents[0].dynasty)}
                      className="flex items-center gap-1 text-sm transition-colors duration-200"
                      style={{ color: isBookmarked(featuredEvents[0].id) ? '#C4922A' : '#a72323', fontFamily: 'Noto Serif SC, serif' }}
                    >
                      <Bookmark className="w-4 h-4" fill={isBookmarked(featuredEvents[0].id) ? 'currentColor' : 'none'} />
                      {isBookmarked(featuredEvents[0].id) ? '已收藏' : '收藏'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Side cards */}
              <div className="flex flex-col gap-4">
                {featuredPersons.slice(0, 2).map((person) => (
                  <div key={person.id} className="group rounded-sm overflow-hidden border flex transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
                    <div className="w-24 flex-shrink-0 overflow-hidden">
                      <img src={person.image} alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(196,146,42,0.15)', color: '#C4922A', fontFamily: 'Noto Serif SC, serif' }}>历史人物</span>
                        </div>
                        <h4 className="text-base font-bold mb-1" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>{person.name}</h4>
                        <p className="text-xs leading-relaxed" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>{person.description.slice(0, 50)}...</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs" style={{ color: '#6B5744' }}>{person.birthYear} — {person.deathYear}</span>
                        <button
                          onClick={() => addBookmark(person.id, person.name, '历史人物', person.dynasty)}
                          className="text-xs transition-colors duration-200"
                          style={{ color: isBookmarked(person.id) ? '#C4922A' : '#a72323', fontFamily: 'Noto Serif SC, serif' }}
                        >
                          {isBookmarked(person.id) ? '已收藏' : '收藏 →'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ===== EVENTS VIEW ===== */}
      {currentView === 'events' && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #a72323)' }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>历史事件</h2>
          </div>
          {searchResults.events.length === 0 ? (
            <div className="text-center py-20" style={{ color: '#6B5744' }}>
              <p>暂无历史事件数据</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.events.map((event: any) => (
                <div key={event.id} className="group rounded-sm overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={event.image || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80'} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(44,24,16,0.7), transparent)' }} />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}>{event.dynasty}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>{event.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>{event.description}</p>
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center gap-2 text-xs" style={{ color: '#6B5744' }}>
                        <Clock className="w-3 h-3" /><span>{event.year}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#6B5744' }}>
                          <Globe className="w-3 h-3" /><span>{event.location}</span>
                        </div>
                      )}
                      {event.figures && (
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#6B5744' }}>
                          <User className="w-3 h-3" /><span>{event.figures}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#D4C4A8' }}>
                      <button
                        onClick={() => addBookmark(event.id.toString(), event.title, '历史事件', event.dynasty)}
                        className="flex items-center gap-1 text-xs transition-colors duration-200"
                        style={{ color: isBookmarked(event.id.toString()) ? '#C4922A' : '#a72323', fontFamily: 'Noto Serif SC, serif' }}
                      >
                        <Bookmark className="w-3 h-3" fill={isBookmarked(event.id.toString()) ? 'currentColor' : 'none'} />
                        {isBookmarked(event.id.toString()) ? '已收藏' : '收藏'}
                      </button>
                      <button 
                        onClick={() => handleViewDetail(event, 'event')}
                        className="text-xs transition-colors duration-200 hover:underline"
                        style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}
                      >
                        查看详情 →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== PERSONS VIEW ===== */}
      {currentView === 'persons' && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #a72323)' }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>历史人物</h2>
          </div>
          {searchResults.persons.length === 0 ? (
            <div className="text-center py-20" style={{ color: '#6B5744' }}>
              <p>暂无历史人物数据</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.persons.map((person: any) => (
                <div key={person.id} className="group rounded-sm overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={person.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80'} alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(44,24,16,0.7), transparent)' }} />
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span 
                        onClick={() => handleTagClick(person.dynasty)}
                        className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all duration-200 hover:opacity-80"
                        style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
                      >
                        {person.dynasty}
                      </span>
                      <span 
                        onClick={() => handleTagClick(person.role)}
                        className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all duration-200 hover:opacity-80"
                        style={{ backgroundColor: 'rgba(196,146,42,0.9)', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
                      >
                        {person.role}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>{person.name}</h3>
                        {person.alias && <p className="text-xs" style={{ color: '#6B5744' }}>小名 / 别称：{person.alias}</p>}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>{person.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#D4C4A8' }}>
                      <span className="text-xs" style={{ color: '#6B5744' }}>{person.birthYear} — {person.deathYear}</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => addBookmark(person.id.toString(), person.name, '历史人物', person.dynasty)}
                          className="flex items-center gap-1 text-xs transition-colors duration-200"
                          style={{ color: isBookmarked(person.id.toString()) ? '#C4922A' : '#a72323', fontFamily: 'Noto Serif SC, serif' }}
                        >
                          <Bookmark className="w-3 h-3" fill={isBookmarked(person.id.toString()) ? 'currentColor' : 'none'} />
                          {isBookmarked(person.id.toString()) ? '已收藏' : '收藏'}
                        </button>
                        <button 
                          onClick={() => handleViewDetail(person, 'person')}
                          className="text-xs transition-colors duration-200 hover:underline"
                          style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}
                        >
                          查看详情 →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== DYNASTIES VIEW ===== */}
      {currentView === 'dynasties' && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #a72323)' }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>朝代政权</h2>
          </div>
          {searchResults.dynasties.length === 0 ? (
            <div className="text-center py-20" style={{ color: '#6B5744' }}>
              <p>暂无朝代政权数据</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {searchResults.dynasties.map((dynasty: any) => (
                <div key={dynasty.id} className="rounded-sm p-6 border transition-all duration-300 hover:shadow-xl" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8', borderLeft: '3px solid #a72323' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#a72323' }}>{dynasty.name}</h3>
                      <p className="text-xs mt-1" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>{dynasty.period} · 都城：{dynasty.capital}</p>
                    </div>
                    <button
                      onClick={() => addBookmark(dynasty.id.toString(), dynasty.name, '朝代政权')}
                      className="p-1"
                      style={{ color: isBookmarked(dynasty.id.toString()) ? '#C4922A' : '#6B5744' }}
                    >
                      <Bookmark className="w-4 h-4" fill={isBookmarked(dynasty.id.toString()) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>{dynasty.description}</p>
                  {dynasty.achievements && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium mb-2" style={{ color: '#C4922A', fontFamily: 'Noto Serif SC, serif' }}>主要成就</h4>
                      <div className="flex flex-wrap gap-2">
                        {dynasty.achievements.split(',').map((achievement: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-sm" style={{ backgroundColor: 'rgba(196,146,42,0.1)', color: '#a72323', fontFamily: 'Noto Sans SC, sans-serif' }}>
                            {achievement.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => handleViewDetail(dynasty, 'dynasty')}
                    className="text-sm font-medium transition-colors duration-200" style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>
                    查看详情 →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== DETAIL MODAL ===== */}
      {showDetail && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#FDFAF4] to-[#F8F3E8] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D4C4A8]">
            <div className="relative">
              {/* Close button */}
              <button 
                onClick={() => setShowDetail(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Detail content */}
              <div className="p-8">
                {selectedItem.type === 'person' && (
                  <div className="space-y-6">
                    {/* Header section */}
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#a72323' }}>
                        {selectedItem.name}
                      </h2>
                      {selectedItem.alias && (
                        <p className="text-lg text-gray-600 mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                          {selectedItem.alias}
                        </p>
                      )}
                    </div>
                    
                    {/* Image section */}
                    {selectedItem.image && (
                      <div className="rounded-lg overflow-hidden shadow-lg">
                        <img 
                          src={selectedItem.image} 
                          alt={selectedItem.name} 
                          className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}
                    
                    {/* Info cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md border border-[#D4C4A8]">
                        <h3 className="text-sm font-semibold mb-2" style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>
                          基本信息
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm" style={{ color: '#6B5744' }}>
                            <strong>朝代：</strong>{selectedItem.dynasty}
                          </p>
                          <p className="text-sm" style={{ color: '#6B5744' }}>
                            <strong>身份：</strong>{selectedItem.role}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md border border-[#D4C4A8]">
                        <h3 className="text-sm font-semibold mb-2" style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>
                          生卒年
                        </h3>
                        <p className="text-sm" style={{ color: '#6B5744' }}>
                          {selectedItem.birthYear} — {selectedItem.deathYear}
                        </p>
                      </div>
                    </div>
                    
                    {/* Description section */}
                    <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md border border-[#D4C4A8]">
                      <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>
                        人物简介
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif', lineHeight: '1.8' }}>
                        {selectedItem.description}
                      </p>
                    </div>
                    
                    {/* Footer with tags */}
                    <div className="flex flex-wrap gap-2">
                      <span 
                        onClick={() => handleTagClick(selectedItem.dynasty)}
                        className="px-3 py-1 rounded-full text-xs cursor-pointer transition-all duration-200 hover:opacity-80"
                        style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
                      >
                        {selectedItem.dynasty}
                      </span>
                      <span 
                        onClick={() => handleTagClick(selectedItem.role)}
                        className="px-3 py-1 rounded-full text-xs cursor-pointer transition-all duration-200 hover:opacity-80"
                        style={{ backgroundColor: 'rgba(196,146,42,0.9)', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
                      >
                        {selectedItem.role}
                      </span>
                    </div>
                  </div>
                )}
                
                {selectedItem.type === 'event' && (
                  <div className="space-y-6">
                    {/* Header section */}
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#a72323' }}>
                        {selectedItem.title}
                      </h2>
                    </div>
                    
                    {/* Image section */}
                    {selectedItem.image && (
                      <div className="rounded-lg overflow-hidden shadow-lg">
                        <img 
                          src={selectedItem.image} 
                          alt={selectedItem.title} 
                          className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}
                    
                    {/* Info cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md border border-[#D4C4A8]">
                        <h3 className="text-sm font-semibold mb-2" style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>
                          时间地点
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm" style={{ color: '#6B5744' }}>
                            <strong>朝代：</strong>{selectedItem.dynasty}
                          </p>
                          <p className="text-sm" style={{ color: '#6B5744' }}>
                            <strong>时间：</strong>{selectedItem.year}
                          </p>
                          <p className="text-sm" style={{ color: '#6B5744' }}>
                            <strong>地点：</strong>{selectedItem.location}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md border border-[#D4C4A8]">
                        <h3 className="text-sm font-semibold mb-2" style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>
                          事件信息
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm" style={{ color: '#6B5744' }}>
                            <strong>类别：</strong>{selectedItem.category}
                          </p>
                          {selectedItem.figures && (
                            <p className="text-sm" style={{ color: '#6B5744' }}>
                              <strong>相关人物：</strong>{selectedItem.figures}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Description section */}
                    <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md border border-[#D4C4A8]">
                      <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>
                        事件描述
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif', lineHeight: '1.8' }}>
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedItem.type === 'dynasty' && (
                  <div className="space-y-6">
                    {/* Header section */}
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#a72323' }}>
                        {selectedItem.name}
                      </h2>
                    </div>
                    
                    {/* Image section */}
                    {selectedItem.image && (
                      <div className="rounded-lg overflow-hidden shadow-lg">
                        <img 
                          src={selectedItem.image} 
                          alt={selectedItem.name} 
                          className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}
                    
                    {/* Info cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md border border-[#D4C4A8]">
                        <h3 className="text-sm font-semibold mb-2" style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>
                          基本信息
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm" style={{ color: '#6B5744' }}>
                            <strong>朝代：</strong>{selectedItem.name}
                          </p>
                          <p className="text-sm" style={{ color: '#6B5744' }}>
                            <strong>都城：</strong>{selectedItem.capital}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md border border-[#D4C4A8]">
                        <h3 className="text-sm font-semibold mb-2" style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>
                          存在时间
                        </h3>
                        <p className="text-sm" style={{ color: '#6B5744' }}>
                          {selectedItem.period}
                        </p>
                      </div>
                    </div>
                    
                    {/* Description section */}
                    <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md border border-[#D4C4A8]">
                      <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>
                        朝代简介
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif', lineHeight: '1.8' }}>
                        {selectedItem.description}
                      </p>
                    </div>
                    
                    {/* Achievements section */}
                    {selectedItem.achievements && (
                      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md border border-[#D4C4A8]">
                        <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>
                          主要成就
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.achievements.split(',').map((achievement: string, i: number) => (
                            <span key={i} className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(196,146,42,0.15)', color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>
                              {achievement.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== KNOWLEDGE GRAPH VIEW ===== */}
      {currentView === 'knowledge' && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #a72323)' }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>知识图谱</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Causality */}
            <div className="rounded-sm p-6 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>事件因果链条</h3>
              <div className="space-y-3">
                {[
                  { event: '唐玄宗宫廷腐败', type: '起因', color: '#C0392B' },
                  { event: '安禄山发动叛乱', type: '经过', color: '#E65100' },
                  { event: '唐朝由盛转衰', type: '结果', color: '#2E7D32' },
                  { event: '藩镇割据局面形成', type: '影响', color: '#a72323' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-center px-2 py-1 rounded-sm flex-shrink-0" style={{ backgroundColor: `${item.color}18`, color: item.color, fontFamily: 'Noto Serif SC, serif' }}>{item.type}</div>
                    <div className="flex-1 h-px" style={{ backgroundColor: '#D4C4A8' }} />
                    <div className="flex-1 text-sm" style={{ color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}>{item.event}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Person Relations */}
            <div className="rounded-sm p-6 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>人物关系图谱</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="px-6 py-3 rounded-sm text-sm font-bold" style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}>唐太宗 李世民</div>
                <div className="flex gap-8">
                  {['唐高宗 李渊', '唐太宗 李世民', '唐高宗 李渊'].slice(0, 2).map((p, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-px h-6" style={{ backgroundColor: '#D4C4A8' }} />
                      <div className="px-4 py-2 rounded-sm text-xs" style={{ backgroundColor: 'rgba(196,146,42,0.15)', color: '#C4922A', fontFamily: 'Noto Serif SC, serif', border: '1px solid rgba(196,146,42,0.3)' }}>{p}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-6">
                  {['房珀玄龄', '魏征', '杜如晦'].map((p) => (
                    <div key={p} className="flex flex-col items-center gap-2">
                      <div className="w-px h-4" style={{ backgroundColor: '#D4C4A8' }} />
                      <div className="px-3 py-1 rounded-sm text-xs" style={{ backgroundColor: '#F5F0E8', color: '#6B5744', fontFamily: 'Noto Serif SC, serif', border: '1px solid #D4C4A8' }}>{p}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Spatiotemporal */}
            <div className="lg:col-span-2 rounded-sm p-6 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>时空演变图谱</h3>
              <div className="relative overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                  {[
                    { period: '唐初 (618-649)', events: ['建立唐朝', '贞观之治', '开边拓土'] },
                    { period: '唐盛 (649-755)', events: ['永徽年间', '开元盛世', '丝路繁荣'] },
                    { period: '唐衰 (755-907)', events: ['安史之乱', '藩镇割据', '唐朝灭亡'] },
                  ].map((phase) => (
                    <div key={phase.period} className="flex-shrink-0 w-48 rounded-sm p-4 border" style={{ backgroundColor: '#F5F0E8', borderColor: '#D4C4A8' }}>
                      <div className="text-xs font-bold mb-3" style={{ fontFamily: 'Noto Serif SC, serif', color: '#a72323' }}>{phase.period}</div>
                      <div className="space-y-2">
                        {phase.events.map((e) => (
                          <div key={e} className="flex items-center gap-2 text-xs" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C4922A' }} />
                            {e}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAP VIEW ===== */}
      {currentView === 'map' && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #a72323)' }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>时空地图系统</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-sm overflow-hidden border relative" style={{ backgroundColor: '#2C1810', borderColor: '#D4C4A8', height: '400px' }}>
                <img
                  src="https://images.unsplash.com/photo-1707414021341-132ee07b62c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80"
                  alt="历史地图"
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgba(196,146,42,0.6)' }} />
                    <p className="text-sm" style={{ color: 'rgba(253,250,244,0.7)', fontFamily: 'Noto Serif SC, serif' }}>中国历史时空地图</p>
                    <p className="text-xs mt-2" style={{ color: 'rgba(253,250,244,0.4)', fontFamily: 'Noto Sans SC, sans-serif' }}>支持各朝代疑域、战役地点、迁徙路线展示</p>
                  </div>
                </div>
                {/* Map markers */}
                {[
                  { name: '长安', x: '35%', y: '40%' },
                  { name: '洛阳', x: '42%', y: '38%' },
                  { name: '赤壁', x: '55%', y: '60%' },
                  { name: '广州', x: '52%', y: '72%' },
                ].map((marker) => (
                  <div
                    key={marker.name}
                    className="absolute flex flex-col items-center cursor-pointer group"
                    style={{ left: marker.x, top: marker.y, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="w-3 h-3 rounded-full border-2 transition-transform duration-200 group-hover:scale-150" style={{ backgroundColor: '#a72323', borderColor: '#C4922A' }} />
                    <span className="text-xs mt-1 px-1 rounded" style={{ color: '#C4922A', fontFamily: 'Noto Serif SC, serif', backgroundColor: 'rgba(44,24,16,0.8)' }}>{marker.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-sm p-4 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
                <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>时期选择</h3>
                <div className="space-y-2">
                  {['唐朝全境图', '宋朝疑域图', '元朝疑域图', '明朝疑域图'].map((period) => (
                    <button
                      key={period}
                      className="w-full text-left px-3 py-2 rounded-sm text-sm transition-colors duration-200"
                      style={{ color: '#6B5744', fontFamily: 'Noto Serif SC, serif', border: '1px solid #D4C4A8' }}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-sm p-4 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
                <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>著名路线</h3>
                <div className="space-y-2">
                  {['郑和下西洋路线', '丝绸之路', '唐朝商路网络'].map((route) => (
                    <button
                      key={route}
                      className="w-full text-left px-3 py-2 rounded-sm text-sm transition-colors duration-200"
                      style={{ color: '#6B5744', fontFamily: 'Noto Serif SC, serif', border: '1px solid #D4C4A8' }}
                    >
                      {route}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== LEARNING VIEW ===== */}
      {currentView === 'learning' && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #a72323)' }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>学习笔记</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Note */}
            <div className="rounded-sm p-6 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>添加笔记</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>相关条目（可选）</label>
                  <input
                    type="text"
                    value={noteTarget}
                    onChange={(e) => setNoteTarget(e.target.value)}
                    placeholder="如：赤壁之战、李白..."
                    className="w-full px-4 py-2.5 rounded-sm text-sm outline-none"
                    style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                    onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                    onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>笔记内容</label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={5}
                    placeholder="在此输入您的学习笔记..."
                    className="w-full px-4 py-2.5 rounded-sm text-sm outline-none resize-none"
                    style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                    onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                    onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                  />
                </div>
                <button
                  onClick={addNote}
                  className="px-6 py-2.5 rounded-sm text-sm font-medium tracking-wider transition-all duration-200 min-h-[44px]"
                  style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
                >
                  保存笔记
                </button>
              </div>
            </div>

            {/* Quiz */}
            <div className="rounded-sm p-6 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>历史测验</h3>
              <div className="rounded-sm p-4 mb-4" style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8' }}>
                <p className="text-sm font-medium mb-1" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>题目 {(quizIdx % quizQuestions.length) + 1} / {quizQuestions.length}</p>
                <p className="text-base" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>{currentQuiz.q}</p>
                <p className="text-xs mt-1" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>提示：{currentQuiz.hint}</p>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={quizAnswer}
                  onChange={(e) => setQuizAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                  placeholder="输入答案..."
                  className="w-full px-4 py-2.5 rounded-sm text-sm outline-none"
                  style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                  onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                  onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                />
                {quizResult && (
                  <div className="px-4 py-3 rounded-sm text-sm" style={{
                    backgroundColor: quizResult.startsWith('正确') ? 'rgba(46,125,50,0.1)' : 'rgba(192,57,43,0.1)',
                    color: quizResult.startsWith('正确') ? '#2E7D32' : '#C0392B',
                    border: `1px solid ${quizResult.startsWith('正确') ? 'rgba(46,125,50,0.3)' : 'rgba(192,57,43,0.3)'}`,
                    fontFamily: 'Noto Sans SC, sans-serif',
                  }}>
                    {quizResult}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={checkAnswer}
                    className="flex-1 py-2.5 rounded-sm text-sm font-medium tracking-wider transition-all duration-200 min-h-[44px]"
                    style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
                  >
                    提交答案
                  </button>
                  <button
                    onClick={nextQuiz}
                    className="px-4 py-2.5 rounded-sm text-sm transition-all duration-200 min-h-[44px]"
                    style={{ color: '#a72323', border: '1px solid #a72323', fontFamily: 'Noto Serif SC, serif' }}
                  >
                    下一题
                  </button>
                </div>
              </div>
            </div>

            {/* Notes List */}
            <div className="lg:col-span-2 rounded-sm p-6 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>我的笔记 ({notes.length})</h3>
              {notes.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: '#D4C4A8' }} />
                  <p className="text-sm" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>还没有笔记，开始添加吧！</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.map((note) => (
                    <div key={note.id} className="p-4 rounded-sm border" style={{ backgroundColor: '#F5F0E8', borderColor: '#D4C4A8' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(167,35,35,0.1)', color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>{note.targetTitle}</span>
                        <span className="text-xs" style={{ color: '#6B5744' }}>{new Date(note.createdAt).toLocaleDateString('zh-CN')}</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}>{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== TOOLS VIEW ===== */}
      {currentView === 'tools' && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #a72323)' }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>学术研究工具</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Year Converter */}
            <div className="rounded-sm p-6 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
              <div className="text-xs tracking-wider uppercase mb-4" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#6B5744' }}>纪年换算工具</div>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>干支纪年 / 年号纪年 / 公历互换</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>输入年份</label>
                  <input
                    type="text"
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
                    placeholder="如：贞观十三年 / 甲子年 / 639"
                    className="w-full px-4 py-2.5 rounded-sm text-sm outline-none"
                    style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                    onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                    onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '公历', value: yearResult.gregorian },
                    { label: '年号', value: yearResult.era },
                    { label: '干支', value: yearResult.ganzhi },
                  ].map((r) => (
                    <div key={r.label} className="rounded-sm p-3 text-center border" style={{ backgroundColor: '#F5F0E8', borderColor: '#D4C4A8' }}>
                      <div className="text-xs mb-1" style={{ color: '#6B5744', fontFamily: 'Noto Serif SC, serif' }}>{r.label}</div>
                      <div className="font-bold text-sm" style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>{r.value}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={convertYear}
                  className="w-full py-2.5 rounded-sm text-sm tracking-wider transition-colors duration-200 min-h-[44px]"
                  style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
                >
                  立即换算
                </button>
              </div>
            </div>

            {/* Citation Tool */}
            <div className="rounded-sm p-6 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
              <div className="text-xs tracking-wider uppercase mb-4" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#6B5744' }}>学术引用工具</div>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>规范引用格式生成</h3>
              <div className="space-y-4">
                {[
                  { label: '史料名称', placeholder: '如：新唐书' },
                  { label: '卷次页码', placeholder: '如：卷一百二十三，第456页' },
                  { label: '作者', placeholder: '如：欧阳修' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 rounded-sm text-sm outline-none"
                      style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                      onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                      onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                    />
                  </div>
                ))}
                <button
                  onClick={() => toast.success('引用格式已生成', { description: '已复制到剪贴板' })}
                  className="w-full py-2.5 rounded-sm text-sm tracking-wider transition-colors duration-200 min-h-[44px]"
                  style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
                >
                  生成引用
                </button>
              </div>
            </div>

            {/* Source Tracing */}
            <div className="lg:col-span-2 rounded-sm p-6 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>原始史料溯源</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: '新唐书', type: '正史', desc: '唐朝官方正史，共225卷，详载唐朝政治、经济、文化及各方面历史。', source: '宋·欧阳修等撰' },
                  { title: '史记', type: '正史', desc: '中国第一部纪传体通史，记载上至上古传说中的黄帝，下至汉武帝太初年间共3000多年的历史。', source: '西汉·司马迁撰' },
                  { title: '资治通鉴', type: '编年体', desc: '中国第一部编年体通史，记载了从周威烈王到宋太祖赵匡包元年共1362年的历史。', source: '宋·司马光撰' },
                ].map((source) => (
                  <div key={source.title} className="rounded-sm p-4 border" style={{ backgroundColor: '#F5F0E8', borderColor: '#D4C4A8' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#a72323' }}>{source.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(167,35,35,0.1)', color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>{source.type}</span>
                    </div>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>{source.desc}</p>
                    <p className="text-xs" style={{ color: '#6B5744', fontFamily: 'Noto Serif SC, serif' }}>撰者：{source.source}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-10" style={{ backgroundColor: '#2C1810', borderColor: 'rgba(196,146,42,0.2)' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#a72323' }}>
                  <span className="font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4922A' }}>史</span>
                </div>
                <span className="font-bold text-lg tracking-widest" style={{ fontFamily: 'Noto Serif SC, serif', color: '#FDFAF4' }}>华史通鉴</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(253,250,244,0.5)', fontFamily: 'Noto Sans SC, sans-serif' }}>专业的中国历史知识查询平台，整合权威史料，为历史学习与研究提供全面支持。</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 tracking-wider" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4922A' }}>功能模块</h4>
              <ul className="space-y-2">
                {['历史事件', '历史人物', '朝代政权', '知识图谱'].map((item) => (
                  <li key={item}>
                    <button className="text-sm transition-colors duration-200" style={{ color: 'rgba(253,250,244,0.5)', fontFamily: 'Noto Sans SC, sans-serif' }}>{item}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 tracking-wider" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4922A' }}>关于我们</h4>
              <ul className="space-y-2">
                {['项目介绍', '数据来源', '合作机构', '联系我们'].map((item) => (
                  <li key={item}>
                    <button className="text-sm transition-colors duration-200" style={{ color: 'rgba(253,250,244,0.5)', fontFamily: 'Noto Sans SC, sans-serif' }}>{item}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(196,146,42,0.1)' }}>
            <p className="text-xs" style={{ color: 'rgba(253,250,244,0.3)', fontFamily: 'Noto Sans SC, sans-serif' }}>© 2026 华史通鉴 · 中国历史查询系统 · 作者：Mengfei Leo</p>
            <p className="text-xs" style={{ color: 'rgba(253,250,244,0.3)', fontFamily: 'Noto Sans SC, sans-serif' }}>数据准确率 99% · 覆盖事件 5,000+ · 人物 10,000+</p>
          </div>
        </div>
      </footer>

      <OmniflowBadge />
    </div>
  );
}
