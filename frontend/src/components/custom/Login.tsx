import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, BookOpen, Loader2 } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('请填写邮箱和密码');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success && data.data?.token) {
        login(data.data.token);
        toast.success('登录成功', { description: `欢迎回来，${data.data.user.name}` });
        navigate('/', { replace: true });
      } else {
        setError(data.message || '登录失败，请检查邮箱和密码');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#F5F0E8' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1762115839715-fbd4e2c65260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80"
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(44,24,16,0.95) 0%, rgba(167,35,35,0.3) 100%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#a72323' }}>
              <span className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4922A' }}>史</span>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-widest" style={{ fontFamily: 'Noto Serif SC, serif', color: '#FDFAF4' }}>华史通鉴</div>
              <div className="text-xs tracking-wider" style={{ color: 'rgba(196,146,42,0.8)', fontFamily: 'Noto Serif SC, serif' }}>中国历史查询系统</div>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'rgba(253,250,244,0.6)', fontFamily: 'Noto Sans SC, sans-serif' }}>登录以开启您的历史探索之旅</p>
        </div>

        {/* Card */}
        <div className="rounded-sm p-8 shadow-2xl border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>用户登录</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-sm text-sm border" style={{ backgroundColor: 'rgba(192,57,43,0.08)', borderColor: 'rgba(192,57,43,0.3)', color: '#C0392B', fontFamily: 'Noto Sans SC, sans-serif' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>电子邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入您的邮箱"
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-sm text-sm outline-none transition-colors duration-200"
                style={{
                  backgroundColor: '#F5F0E8',
                  border: '1px solid #D4C4A8',
                  color: '#1A1208',
                  fontFamily: 'Noto Sans SC, sans-serif',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-10 rounded-sm text-sm outline-none transition-colors duration-200"
                  style={{
                    backgroundColor: '#F5F0E8',
                    border: '1px solid #D4C4A8',
                    color: '#1A1208',
                    fontFamily: 'Noto Sans SC, sans-serif',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                  onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: '#6B5744' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-sm"
                  style={{ accentColor: '#a72323' }}
                />
                <span className="text-sm" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>记住我</span>
              </label>
              <button
                type="button"
                className="text-sm transition-colors duration-200"
                style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}
              >
                忘记密码？
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-sm text-sm font-medium tracking-wider transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px]"
              style={{
                backgroundColor: loading ? '#6B5744' : '#a72323',
                color: '#FDFAF4',
                fontFamily: 'Noto Serif SC, serif',
              }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> 登录中...</>
              ) : (
                '立即登录'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>还没有账号？</span>
            <Link
              to="/signup"
              className="text-sm font-medium ml-1 transition-colors duration-200"
              style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}
            >
              免费注册
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: 'rgba(253,250,244,0.4)', fontFamily: 'Noto Sans SC, sans-serif' }}>© 2026 华史通鉴 · 中国历史查询系统</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
