import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link as RouterLink, useHistory } from "react-router-dom";

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
import Fade from "@material-ui/core/Fade";
import { 
  Email, 
  Lock, 
  VpnKey, 
  CheckCircle,
  ArrowBack,
  Send
} from "@material-ui/icons";

// Custom Imports
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";

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
  container: {
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
  '@keyframes slideIn': {
    from: {
      opacity: 0,
      transform: 'translateX(-20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateX(0)',
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
  card: {
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
    lineHeight: 1.6,
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
      '&.Mui-disabled': {
        backgroundColor: '#f3f4f6',
        opacity: 0.8,
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
    '& .MuiFormHelperText-root': {
      color: '#ef4444',
      fontSize: '13px',
      marginTop: '6px',
      textAlign: 'left',
      marginLeft: '4px',
    }
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    zIndex: 1,
    fontSize: '20px',
  },
  inputWithIcon: {
    '& input': {
      paddingLeft: '48px !important',
    }
  },
  passwordToggle: {
    color: '#94a3b8',
    '&:hover': {
      color: '#64748b',
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
  linkContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(3),
    fontSize: '14px',
    marginBottom: theme.spacing(2),
    '& a': {
      color: '#22c55e',
      textDecoration: 'none',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.5),
      transition: 'all 0.2s ease',
      '&:hover': {
        color: '#16a34a',
        textDecoration: 'underline',
      }
    }
  },
  divider: {
    color: '#cbd5e1',
    margin: '0 8px',
    fontSize: '14px',
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
    },
  },
  successMessage: {
    fontSize: '14px',
    color: '#16a34a',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: '#f0fdf4',
    borderRadius: '12px',
    border: '2px solid #bbf7d0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    fontWeight: 500,
    animation: '$slideIn 0.5s ease-out',
    '& svg': {
      fontSize: '20px',
      color: '#22c55e',
    }
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    '& .step': {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      fontSize: '14px',
      transition: 'all 0.3s ease',
    },
    '& .step.active': {
      backgroundColor: '#22c55e',
      color: 'white',
      boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
    },
    '& .step.inactive': {
      backgroundColor: '#f1f5f9',
      color: '#94a3b8',
      border: '2px solid #e2e8f0',
    },
    '& .line': {
      width: '60px',
      height: '2px',
      backgroundColor: '#e2e8f0',
      margin: '0 12px',
      position: 'relative',
      '&.active': {
        backgroundColor: '#22c55e',
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

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const ForgetPassword = () => {
  const classes = useStyles();
  const history = useHistory();
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async (values) => {
    setLoading(true);
    try {
      const response = await api.post(
        `${process.env.REACT_APP_BACKEND_URL}/forgetpassword/${values.email}`
      );
      if (response.data.status === 404) {
        toast.error("Email não encontrado");
      } else {
        toast.success("Email enviado com sucesso!");
        setShowAdditionalFields(true);
        setEmailSent(true);
      }
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      await api.post(
        `${process.env.REACT_APP_BACKEND_URL}/resetpasswords/${values.email}/${values.token}/${values.newPassword}`
      );
      toast.success("Senha redefinida com sucesso.");
      history.push("/login");
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  };

  const UserSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    token: showAdditionalFields
      ? Yup.string().required("Informe o código de verificação")
      : Yup.string(),
    newPassword: showAdditionalFields
      ? Yup.string()
        .required("Campo obrigatório")
        .matches(
          passwordRegex,
          "A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula e número"
        )
      : Yup.string(),
    confirmPassword: Yup.string().when("newPassword", {
      is: (newPassword) => showAdditionalFields && newPassword,
      then: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "As senhas não correspondem")
        .required("Campo obrigatório"),
      otherwise: Yup.string(),
    }),
  });

  return (
    <div className={classes.root}>
      <div className={`${classes.floatingShape} ${classes.shape1}`}></div>
      <div className={`${classes.floatingShape} ${classes.shape2}`}></div>
      
      <div className={classes.container}>
        <div className={classes.logoContainer}>
          <div className={classes.logoIcon}>
            <MessageIcon />
          </div>
          <h1 className={classes.brandName}>
            <span>Delfin</span>Zap
          </h1>
          <p className={classes.brandSubtitle}>Plataforma de múltiplos atendimentos</p>
        </div>
        
        <div className={classes.card}>
          <div className={classes.stepIndicator}>
            <div className={`step ${!showAdditionalFields ? 'active' : 'inactive'}`}>1</div>
            <div className={`line ${showAdditionalFields ? 'active' : ''}`}></div>
            <div className={`step ${showAdditionalFields ? 'active' : 'inactive'}`}>2</div>
          </div>

          <Typography className={classes.formTitle}>
            {showAdditionalFields ? 'Crie sua nova senha' : 'Recuperar senha'}
          </Typography>
          <Typography className={classes.formSubtitle}>
            {showAdditionalFields 
              ? 'Digite o código que enviamos para seu email e defina uma nova senha segura'
              : 'Não se preocupe! Vamos te ajudar a recuperar o acesso à sua conta'
            }
          </Typography>

          {emailSent && !showAdditionalFields && (
            <Fade in={emailSent}>
              <div className={classes.successMessage}>
                <CheckCircle />
                Email enviado! Verifique sua caixa de entrada
              </div>
            </Fade>
          )}
          
          <Formik
            initialValues={{
              email: "",
              token: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={UserSchema}
            onSubmit={(values) => {
              if (showAdditionalFields) {
                handleResetPassword(values);
              } else {
                handleSendEmail(values);
              }
            }}
          >
            {({ touched, errors, values }) => (
              <Form className={classes.form}>
                <div style={{ position: 'relative' }}>
                  <label className={classes.inputLabel}>E-mail</label>
                  <Email className={classes.inputIcon} />
                  <Field
                    as={TextField}
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    name="email"
                    autoComplete="email"
                    className={`${classes.inputField} ${classes.inputWithIcon}`}
                    placeholder="seu@email.com"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={showAdditionalFields}
                  />
                </div>

                {showAdditionalFields && (
                  <Fade in={showAdditionalFields}>
                    <div>
                      <div style={{ position: 'relative' }}>
                        <label className={classes.inputLabel}>Código de verificação</label>
                        <VpnKey className={classes.inputIcon} />
                        <Field
                          as={TextField}
                          variant="outlined"
                          required
                          fullWidth
                          id="token"
                          name="token"
                          className={`${classes.inputField} ${classes.inputWithIcon}`}
                          placeholder="Digite o código de 6 dígitos"
                          error={touched.token && Boolean(errors.token)}
                          helperText={touched.token && errors.token}
                        />
                      </div>

                      <div style={{ position: 'relative' }}>
                        <label className={classes.inputLabel}>Nova senha</label>
                        <Lock className={classes.inputIcon} />
                        <Field
                          as={TextField}
                          variant="outlined"
                          required
                          fullWidth
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          id="newPassword"
                          className={`${classes.inputField} ${classes.inputWithIcon}`}
                          placeholder="Mínimo 8 caracteres"
                          error={touched.newPassword && Boolean(errors.newPassword)}
                          helperText={touched.newPassword && errors.newPassword}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowPassword(!showPassword)}
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

                      <div style={{ position: 'relative' }}>
                        <label className={classes.inputLabel}>Confirme a nova senha</label>
                        <Lock className={classes.inputIcon} />
                        <Field
                          as={TextField}
                          variant="outlined"
                          required
                          fullWidth
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          className={`${classes.inputField} ${classes.inputWithIcon}`}
                          placeholder="Digite a senha novamente"
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          helperText={touched.confirmPassword && errors.confirmPassword}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle confirm password visibility"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                  size="small"
                                  className={classes.passwordToggle}
                                >
                                  {showConfirmPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </Fade>
                )}
                
                <Button
                  type="submit"
                  variant="contained"
                  className={classes.submitButton}
                  disabled={loading}
                  startIcon={loading ? null : (showAdditionalFields ? <Lock /> : <Send />)}
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : showAdditionalFields ? "Redefinir senha" : "Enviar código por email"}
                </Button>

                <div className={classes.linkContainer}>
                  <Link component={RouterLink} to="/login">
                    <ArrowBack fontSize="small" />
                    Voltar ao login
                  </Link>
                  <span className={classes.divider}>•</span>
                  <Link component={RouterLink} to="/signup">
                    Criar nova conta
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
          
          <div className={classes.footer}>
            © 2025 DelfinZaaaaap. Todos os direitos reservados.<br />
            <Link href="#">Termos de uso</Link> • <Link href="#">Política de privacidade</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;