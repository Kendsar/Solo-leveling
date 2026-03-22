import { useState } from 'react';
import type { AuthCredentials, SignUpCredentials } from '../../../models/auth';

const AuthSystemPanel = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const [form, setForm] = useState<AuthCredentials | SignUpCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    ...(isSignUp && { confirmPassword: '' }),
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = () => {
    if (!form.email) return 'Email is required';

    if (form.password.length < 8) {
      return 'Password must be at least 8 characters';
    }

    if (isSignUp) {
      const signUpForm = form as SignUpCredentials;

      if (!signUpForm.confirmPassword) {
        return 'Please confirm your password';
      }

      if (signUpForm.password !== signUpForm.confirmPassword) {
        return 'Passwords do not match';
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    // 🔥 READY FOR SUPABASE
    if (isSignUp) {
      console.log('Register:', form);
    } else {
      console.log('Login:', form);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0f1c]">
      <div
        style={{ display: 'inline-flex', width: '90%', maxWidth: '424px' }}
        className="relative p-[2px] rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 shadow-[0_0_40px_rgba(0,255,255,0.4)]"
      >
        <div className="relative w-[420px] rounded-xl bg-[#0b1324]/90 backdrop-blur-md border border-cyan-400/30 overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-300"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-300"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-300"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-300"></div>

          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-cyan-400/20">
            <h2 className="text-cyan-300 tracking-widest text-sm font-semibold">
              SYSTEM ACCESS
            </h2>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-5 text-cyan-100 text-sm">
            {/* System message */}
            <p className="text-xs text-cyan-400/70 italic">
              Awaiting user authentication...
            </p>

            {/* ERROR */}
            {error && (
              <div className="text-red-400 text-xs border border-red-400/30 bg-red-500/10 px-3 py-2 rounded">
                {error}
              </div>
            )}

            {/* Username (Sign Up only) */}
            {isSignUp && (
              <div className="flex flex-col gap-1">
                <label className="text-cyan-400 text-xs">USERNAME</label>
                <input
                  type="text"
                  placeholder="USERNAME"
                  value={(form as SignUpCredentials).username || ''}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="bg-[#0a0f1c]/60 border border-cyan-400/30 rounded-md px-3 py-2 text-cyan-100 placeholder:text-cyan-500/40 focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                />
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-cyan-400 text-xs">EMAIL</label>
              <input
                type="email"
                placeholder="EMAIL"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="bg-[#0a0f1c]/60 border border-cyan-400/30 rounded-md px-3 py-2 text-cyan-100 placeholder:text-cyan-500/40 focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-cyan-400 text-xs">PASSWORD</label>
              <input
                type="password"
                placeholder="PASSWORD"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="bg-[#0a0f1c]/60 border border-cyan-400/30 rounded-md px-3 py-2 text-cyan-100 placeholder:text-cyan-500/40 focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-cyan-400 text-xs">CONFIRM PASSWORD</label>
              {isSignUp && (
                <input
                  type="password"
                  placeholder="CONFIRM PASSWORD"
                  value={(form as SignUpCredentials).confirmPassword || ''}
                  onChange={(e) =>
                    handleChange('confirmPassword', e.target.value)
                  }
                  className="bg-[#0a0f1c]/60 border border-cyan-400/30 rounded-md px-3 py-2 text-cyan-100 placeholder:text-cyan-500/40 focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                />
              )}
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-2 rounded-md border border-cyan-400/40 text-cyan-300 tracking-widest text-sm font-semibold hover:bg-cyan-400/10 hover:shadow-[0_0_12px_rgba(0,255,255,0.4)]"
            >
              {isSignUp ? 'REGISTER' : 'ENTER SYSTEM'}
            </button>

            {/* Toggle */}
            <div className="text-center text-xs text-cyan-400/70">
              {isSignUp ? (
                <>
                  Already a Player?{' '}
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-cyan-300"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  New Player?{' '}
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-cyan-300"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Scan line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-[2px] bg-cyan-400/40 animate-scan"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSystemPanel;
