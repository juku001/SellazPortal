import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import axios from 'src/utils/axios';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

export function SignInView() {
  const router = useRouter();

  const [email, setEmail] = useState('hello@gmail.com');
  const [password, setPassword] = useState('@demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/login', { email, password });

      const token = res.data.data.token;

      if (token) {
        localStorage.setItem('token', token);
        router.push('/dashboard');
      } else {
        console.error('Token not found in response');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, [email, password, router]);

  return (
    <>
      {/* Logo at the top */}
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
         <Logo variant="default" />

      </Box>

      {/* Form Section */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
        <TextField
          fullWidth
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
          Forgot password?
        </Link>

        <TextField
          fullWidth
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 3 }}
        />

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="contained"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </Box>

      {/* Divider only (no social icons below) */}
      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }} />
    </>
  );
}
