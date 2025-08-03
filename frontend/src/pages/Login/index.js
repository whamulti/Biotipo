import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

// Material-UI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";

// Custom Imports
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      top: '-50%',
      left: '-50%',
      transform: 'rotate(30deg)',
      opacity: 0.3,
    }
  },
  loginContainer: {
    width: '100%',
    maxWidth: 440,
    margin: theme.spacing(2),
    position: 'relative',
    zIndex: 1,
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: theme.spacing(5),
    animation: '$fadeInDown 0.8s ease-out',
  },
  '@keyframes fadeInDown': {
    from: {
      opacity: 0,
      transform: 'translateY(-20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  logoIcon: {
    width: 80,
    height: 80,
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    borderRadius: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)',
    transform: 'rotate(-5deg)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'rotate(0deg) scale(1.05)',
    },
    '& svg': {
      width: 40,
      height: 40,
      fill: 'white',
    }
  },
  brandName: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    marginBottom: '8px',
    letterSpacing: '-0.03em',
    '& span': {
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }
  },
  brandSubtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0,
    fontWeight: 400,
    letterSpacing: '0.01em',
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '48px 40px',
    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.04)',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    animation: '$fadeInUp 0.8s ease-out 0.2s both',
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: theme.spacing(1),
    letterSpacing: '-0.03em',
  },
  formSubtitle: {
    fontSize: '15px',
    color: '#64748b',
    marginBottom: theme.spacing(4),
    fontWeight: 400,
    '& a': {
      color: '#22c55e',
      textDecoration: 'none',
      fontWeight: 600,
      transition: 'all 0.2s ease',
      '&:hover': {
        color: '#16a34a',
        textDecoration: 'underline',
      }
    }
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: theme.spacing(1),
    textAlign: 'left',
    display: 'block',
    letterSpacing: '0.01em',
  },
  inputField: {
    marginBottom: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderColor: '#e2e8f0',
        borderWidth: '1px',
        transition: 'all 0.3s ease',
      },
      '&:hover': {
        backgroundColor: '#f1f5f9',
        '& fieldset': {
          borderColor: '#cbd5e1',
        },
      },
      '&.Mui-focused': {
        backgroundColor: 'white',
        '& fieldset': {
          borderColor: '#22c55e',
          borderWidth: '2px',
        },
      },
      '& input': {
        padding: '16px 18px',
        fontSize: '15px',
        fontWeight: 400,
        letterSpacing: '0.01em',
      },
      '& input::placeholder': {
        color: '#94a3b8',
        opacity: 1,
      }
    },
    '& .MuiInputLabel-root': {
      display: 'none',
    },
  },
  passwordToggle: {
    color: '#94a3b8',
    '&:hover': {
      color: '#64748b',
    }
  },
  checkboxContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#475569',
    fontWeight: 400,
    '& .MuiCheckbox-root': {
      color: '#cbd5e1',
      padding: '8px',
      '&.Mui-checked': {
        color: '#22c55e',
      },
      '& .MuiSvgIcon-root': {
        fontSize: 20,
      }
    }
  },
  forgotPassword: {
    fontSize: '14px',
    color: '#22c55e',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#16a34a',
      textDecoration: 'underline',
    }
  },
  submitButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    padding: '16px',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '16px',
    textTransform: 'none',
    boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.3)',
    marginBottom: theme.spacing(3),
    letterSpacing: '0.025em',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      boxShadow: '0 6px 20px 0 rgba(34, 197, 94, 0.4)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      background: '#cbd5e1',
      color: 'white',
      boxShadow: 'none',
    }
  },
  dividerContainer: {
    position: 'relative',
    marginBottom: theme.spacing(3),
    '& .MuiDivider-root': {
      backgroundColor: '#e2e8f0',
    }
  },
  dividerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '0 16px',
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: 400,
  },
  socialLogin: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  socialButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '14px',
    color: '#475569',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f1f5f9',
      borderColor: '#cbd5e1',
    }
  },
  footer: {
    fontSize: '12px',
    color: '#94a3b8',
    lineHeight: '1.6',
    fontWeight: 400,
    '& a': {
      color: '#22c55e',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'color 0.2s ease',
      '&:hover': {
        color: '#16a34a',
        textDecoration: 'underline',
      }
    }
  },
  floatingShape: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
    filter: 'blur(40px)',
    zIndex: 0,
  },
  shape1: {
    width: '300px',
    height: '300px',
    top: '-150px',
    right: '-100px',
  },
  shape2: {
    width: '250px',
    height: '250px',
    bottom: '-100px',
    left: '-100px',
  },
}));

// Componente do ícone de mensagem melhorado
const MessageIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
      stroke="white" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="white"
    />
  </svg>
);

const Login = () => {
    const classes = useStyles();
    const [user, setUser] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { handleLogin, loading } = useContext(AuthContext);
    const [viewregister, setviewregister] = useState('disabled');

    const handleChangeInput = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    useEffect(() => {
        fetchviewregister();
    }, []);

    const fetchviewregister = async () => {
        try {
            const responsev = await api.get("/settings/viewregister");
            const viewregisterX = responsev?.data?.value;
            setviewregister(viewregisterX);
        } catch (error) {
            console.error('Error retrieving viewregister', error);
        }
    };

    const handlSubmit = (e) => {
        e.preventDefault();
        handleLogin(user);
    };

    return (
        <div className={classes.root}>
            <div className={`${classes.floatingShape} ${classes.shape1}`}></div>
            <div className={`${classes.floatingShape} ${classes.shape2}`}></div>
            
            <div className={classes.loginContainer}>
                <div className={classes.logoContainer}>
                    <div className={classes.logoIcon}>
                        <MessageIcon />
                    </div>
                    <h1 className={classes.brandName}>
                        <span>Delfin</span>Zap
                    </h1>
                    <p className={classes.brandSubtitle}>Plataforma de múltiplos atendimentos</p>
                </div>
                
                <div className={classes.loginCard}>
                    <Typography className={classes.formTitle}>
                        Bem-vindo de volta
                    </Typography>
                    <Typography className={classes.formSubtitle}>
                        Novo por aqui? <Link component={RouterLink} to="/signup">Crie sua conta grátis</Link>
                    </Typography>
                    
                    <form className={classes.form} onSubmit={handlSubmit}>
                        <div>
                            <label className={classes.inputLabel}>E-mail</label>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleChangeInput}
                                autoComplete="email"
                                className={classes.inputField}
                                placeholder="seu@email.com"
                            />
                        </div>
                        
                        <div>
                            <label className={classes.inputLabel}>Senha</label>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={user.password}
                                onChange={handleChangeInput}
                                autoComplete="current-password"
                                className={classes.inputField}
                                placeholder="••••••••"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                                size="small"
                                                className={classes.passwordToggle}
                                            >
                                                {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        
                        <div className={classes.checkboxContainer}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={handleRememberMeChange}
                                        name="rememberMe"
                                        size="small"
                                    />
                                }
                                label="Manter conectado"
                                className={classes.checkboxLabel}
                            />
                            <Link
                                component={RouterLink}
                                to="/forgetpsw"
                                className={classes.forgotPassword}
                            >
                                Esqueceu a senha?
                            </Link>
                        </div>
                        
                        <Button
                            type="submit"
                            variant="contained"
                            className={classes.submitButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={22} color="inherit" />
                            ) : (
                                "Entrar na plataforma"
                            )}
                        </Button>
                        
                        <div className={classes.dividerContainer}>
                            <Divider />
                            <span className={classes.dividerText}>ou continue com</span>
                        </div>
                        
                        <div className={classes.socialLogin}>
                            <Button className={classes.socialButton}>
                                <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </Button>
                            <Button className={classes.socialButton}>
                                <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
                                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Facebook
                            </Button>
                        </div>
                    </form>
                    
                    <div className={classes.footer}>
                        © 2025 DelfinZap. Todos os direitos reservados.<br />
                        <Link href="#">Termos de uso</Link> • <Link href="#">Política de privacidade</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;