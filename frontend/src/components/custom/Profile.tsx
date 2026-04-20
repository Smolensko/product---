import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Edit3, Lock, BookOpen, Bookmark, FileText, LogOut, Loader2, Camera, ChevronRight, Star, Clock } from 'lucide-react';
import type { User as UserType, Note, Bookmark as BookmarkType } from '../../types';

type ProfileTab = 'info' | 'bookmarks' | 'notes' | 'security';

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);

  useEffect(() => {
    fetchProfile();
    loadLocalData();
  }, []);

  const loadLocalData = () => {
    const savedNotes = localStorage.getItem('history_notes');
    const savedBookmarks = localStorage.getItem('history_bookmarks');
    if (savedNotes) setNotes(JSON.parse(savedNotes) as Note[]);
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks) as BookmarkType[]);
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setUser(data.data as UserType);
        setEditName(data.data.name);
        setEditBio(data.data.bio || '');
        setEditAvatar(data.data.avatar || '');
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName, bio: editBio, avatar: editAvatar || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data as UserType);
        toast.success('个人信息已更新');
      } else {
        toast.error(data.message || '更新失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('请填写所有密码字段');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('两次新密码不一致');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    setPwLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('密码修改成功');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        toast.error(data.message || '修改失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('已退出登录');
    navigate('/login', { replace: true });
  };

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('history_bookmarks', JSON.stringify(updated));
    toast.success('已取消收藏');
  };

  const removeNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem('history_notes', JSON.stringify(updated));
    toast.success('笔记已删除');
  };

  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: 'info', label: '个人信息', icon: <User className="w-4 h-4" /> },
    { id: 'bookmarks', label: '我的收藏', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'notes', label: '我的笔记', icon: <FileText className="w-4 h-4" /> },
    { id: 'security', label: '安全设置', icon: <Lock className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#a72323' }} />
          <span className="text-sm" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>
      {/* Header */}
      <div className="py-8 px-4" style={{ backgroundColor: '#2C1810' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-sm flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#a72323' }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4922A' }}>
                    {user?.name?.[0] || '用'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#FDFAF4' }}>{user?.name || '用户'}</h1>
              <p className="text-sm" style={{ color: 'rgba(196,146,42,0.8)', fontFamily: 'Noto Sans SC, sans-serif' }}>{user?.email}</p>
              {user?.bio && <p className="text-xs mt-1" style={{ color: 'rgba(253,250,244,0.6)', fontFamily: 'Noto Sans SC, sans-serif' }}>{user.bio}</p>}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm transition-colors duration-200"
              style={{ backgroundColor: 'rgba(167,35,35,0.3)', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif', border: '1px solid rgba(167,35,35,0.5)' }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">退出登录</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: '收藏条目', value: bookmarks.length },
              { label: '学习笔记', value: notes.length },
              { label: '加入天数', value: user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000) : 0 },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-sm" style={{ backgroundColor: 'rgba(253,250,244,0.05)', border: '1px solid rgba(196,146,42,0.2)' }}>
                <div className="text-xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4922A' }}>{stat.value}</div>
                <div className="text-xs" style={{ color: 'rgba(253,250,244,0.5)', fontFamily: 'Noto Sans SC, sans-serif' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-4 text-sm whitespace-nowrap transition-all duration-200 border-b-2"
                style={{
                  fontFamily: 'Noto Serif SC, serif',
                  color: activeTab === tab.id ? '#a72323' : '#6B5744',
                  borderBottomColor: activeTab === tab.id ? '#a72323' : 'transparent',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="rounded-sm p-6 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
            <h3 className="text-lg font-bold mb-6" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>编辑个人信息</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>姓名</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-sm text-sm outline-none"
                  style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                  onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                  onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>个人简介</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  placeholder="介绍一下自己..."
                  className="w-full px-4 py-2.5 rounded-sm text-sm outline-none resize-none"
                  style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                  onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                  onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>头像URL（可选）</label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-sm text-sm outline-none"
                  style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                  onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                  onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                />
              </div>
              <div className="pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-sm text-sm font-medium tracking-wider transition-all duration-200 flex items-center gap-2 min-h-[44px]"
                  style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
                >
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> 保存中...</> : '保存修改'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div>
            <h3 className="text-lg font-bold mb-6" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>我的收藏 ({bookmarks.length})</h3>
            {bookmarks.length === 0 ? (
              <div className="text-center py-16 rounded-sm border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
                <Bookmark className="w-12 h-12 mx-auto mb-4" style={{ color: '#D4C4A8' }} />
                <p className="text-sm" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>还没有收藏任何内容</p>
                <p className="text-xs mt-1" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>浏览历史条目时点击收藏按鈕即可保存</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarks.map((bm) => (
                  <div key={bm.id} className="flex items-center justify-between p-4 rounded-sm border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: 'rgba(167,35,35,0.1)' }}>
                        <Star className="w-4 h-4" style={{ color: '#a72323' }} />
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>{bm.targetTitle}</div>
                        <div className="text-xs" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>{bm.targetType} {bm.targetDynasty ? `· ${bm.targetDynasty}` : ''}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeBookmark(bm.id)}
                      className="text-xs px-3 py-1 rounded-sm transition-colors duration-200"
                      style={{ color: '#C0392B', border: '1px solid rgba(192,57,43,0.3)', fontFamily: 'Noto Sans SC, sans-serif' }}
                    >
                      取消
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div>
            <h3 className="text-lg font-bold mb-6" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>我的笔记 ({notes.length})</h3>
            {notes.length === 0 ? (
              <div className="text-center py-16 rounded-sm border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
                <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: '#D4C4A8' }} />
                <p className="text-sm" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>还没有任何笔记</p>
                <p className="text-xs mt-1" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>在历史条目详情页添加笔记</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 rounded-sm border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(167,35,35,0.1)', color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>{note.targetTitle}</span>
                          <span className="text-xs" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>{new Date(note.createdAt).toLocaleDateString('zh-CN')}</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}>{note.content}</p>
                      </div>
                      <button
                        onClick={() => removeNote(note.id)}
                        className="text-xs px-3 py-1 rounded-sm flex-shrink-0 transition-colors duration-200"
                        style={{ color: '#C0392B', border: '1px solid rgba(192,57,43,0.3)', fontFamily: 'Noto Sans SC, sans-serif' }}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="rounded-sm p-6 border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
            <h3 className="text-lg font-bold mb-6" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>修改密码</h3>
            <div className="space-y-5 max-w-md">
              {[
                { label: '当前密码', value: currentPassword, setter: setCurrentPassword, placeholder: '请输入当前密码' },
                { label: '新密码', value: newPassword, setter: setNewPassword, placeholder: '至少8位新密码' },
                { label: '确认新密码', value: confirmNewPassword, setter: setConfirmNewPassword, placeholder: '再次输入新密码' },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>{field.label}</label>
                  <input
                    type="password"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-sm text-sm outline-none"
                    style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                    onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                    onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                  />
                </div>
              ))}
              <button
                onClick={handleChangePassword}
                disabled={pwLoading}
                className="px-6 py-2.5 rounded-sm text-sm font-medium tracking-wider transition-all duration-200 flex items-center gap-2 min-h-[44px]"
                style={{ backgroundColor: '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
              >
                {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> 修改中...</> : '确认修改'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
