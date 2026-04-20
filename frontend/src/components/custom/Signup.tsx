import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

const Signup = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const passwordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthLabel = ['', '弱', '一般', '较强', '强'];
  const strengthColor = ['', '#C0392B', '#E65100', '#C4922A', '#2E7D32'];
  const strength = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('请填写所有必填项');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }
    if (password.length < 8) {
      setError('密码至少8位');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await response.json();
      if (data.success && data.data?.token) {
        login(data.data.token);
        toast.success('注册成功', { description: `欢迎加入华史通鉴，${data.data.user.name}！` });
        navigate('/', { replace: true });
      } else {
        setError(data.message || '注册失败，请稍后重试');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-8"
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
          <p className="text-sm" style={{ color: 'rgba(253,250,244,0.6)', fontFamily: 'Noto Sans SC, sans-serif' }}>加入数万名历史学者与爱好者</p>
        </div>

        {/* Card */}
        <div className="rounded-sm p-8 shadow-2xl border" style={{ backgroundColor: '#FDFAF4', borderColor: '#D4C4A8' }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>免费注册</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-sm text-sm border" style={{ backgroundColor: 'rgba(192,57,43,0.08)', borderColor: 'rgba(192,57,43,0.3)', color: '#C0392B', fontFamily: 'Noto Sans SC, sans-serif' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>姓名 <span style={{ color: '#C0392B' }}>*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的姓名"
                autoComplete="name"
                className="w-full px-4 py-2.5 rounded-sm text-sm outline-none transition-colors duration-200"
                style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>电子邮箱 <span style={{ color: '#C0392B' }}>*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入您的邮箱"
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-sm text-sm outline-none transition-colors duration-200"
                style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>密码 <span style={{ color: '#C0392B' }}>*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少8位密码"
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 pr-10 rounded-sm text-sm outline-none transition-colors duration-200"
                  style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                  onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                  onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B5744' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ backgroundColor: i <= strength ? strengthColor[strength] : '#D4C4A8' }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: strengthColor[strength], fontFamily: 'Noto Sans SC, sans-serif' }}>密码强度：{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#1A1208' }}>确认密码 <span style={{ color: '#C0392B' }}>*</span></label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 pr-10 rounded-sm text-sm outline-none transition-colors duration-200"
                  style={{ backgroundColor: '#F5F0E8', border: '1px solid #D4C4A8', color: '#1A1208', fontFamily: 'Noto Sans SC, sans-serif' }}
                  onFocus={(e) => (e.target.style.borderColor = '#a72323')}
                  onBlur={(e) => (e.target.style.borderColor = '#D4C4A8')}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B5744' }}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#2E7D32' }} />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-sm text-sm font-medium tracking-wider transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px] mt-2"
              style={{ backgroundColor: loading ? '#6B5744' : '#a72323', color: '#FDFAF4', fontFamily: 'Noto Serif SC, serif' }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> 注册中...</>
              ) : (
                '免费注册'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>已有账号？</span>
            <Link to="/login" className="text-sm font-medium ml-1 transition-colors duration-200" style={{ color: '#a72323', fontFamily: 'Noto Serif SC, serif' }}>立即登录</Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: 'rgba(253,250,244,0.4)', fontFamily: 'Noto Sans SC, sans-serif' }}>© 2026 华史通鉴 · 中国历史查询系统</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
