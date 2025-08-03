import React, { useState, useEffect } from "react";
import qs from "query-string";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import api from "../../services/api";
import InputMask from "react-input-mask";
import {
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  Fade,
  Slide,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { 
  ArrowBack, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  Business,
  Visibility,
  VisibilityOff,
  FlashOn,
  Lock,
  Speed,
  HeadsetMic,
  Group,
  Send,
  DateRange,
  Forum,
  Code,
  ArrowForward,
  EmojiEvents
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { i18n } from "../../translate/i18n";
import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";

const nomeEmpresa = process.env.REACT_APP_COPYRIGHT || "";
const versionSystem = process.env.REACT_APP_VERSION || "";

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

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: theme.spacing(3, 0),
    "&::before": {
      content: '""',
      position: "absolute",
      width: "200%",
      height: "200%",
      background: "radial-gradient(circle, rgba(34, 197, 94, 0.1) 1px, transparent 1px)",
      backgroundSize: "50px 50px",
      top: "-50%",
      left: "-50%",
      transform: "rotate(30deg)",
      opacity: 0.3,
    },
  },
  backButton: {
    background: "transparent",
    color: "#64748b",
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: 500,
    fontSize: "14px",
    textTransform: "none",
    boxShadow: "none",
    marginBottom: theme.spacing(3),
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f8fafc",
      borderColor: "#cbd5e1",
      transform: "translateX(-4px)",
    },
  },
  signUpContainer: {
    width: "100%",
    maxWidth: 1400,
    margin: theme.spacing(2),
    position: "relative",
    zIndex: 1,
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: theme.spacing(5),
    animation: "$fadeInDown 0.8s ease-out",
  },
  "@keyframes fadeInDown": {
    from: {
      opacity: 0,
      transform: "translateY(-20px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  "@keyframes fadeInUp": {
    from: {
      opacity: 0,
      transform: "translateY(20px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  "@keyframes pulse": {
    "0%, 100%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.05)",
    },
  },
  logoIcon: {
    width: 80,
    height: 80,
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    borderRadius: "20px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(3),
    boxShadow: "0 8px 32px rgba(34, 197, 94, 0.3)",
    transform: "rotate(-5deg)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "rotate(0deg) scale(1.05)",
    },
    "& svg": {
      width: 40,
      height: 40,
      fill: "white",
    },
  },
  brandName: {
    fontSize: "32px",
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
    marginBottom: "8px",
    letterSpacing: "-0.03em",
    "& span": {
      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
  },
  brandSubtitle: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
    fontWeight: 400,
    letterSpacing: "0.01em",
  },
  signUpCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "24px",
    padding: "48px",
    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    animation: "$fadeInUp 0.8s ease-out 0.2s both",
    [theme.breakpoints.down("sm")]: {
      padding: "32px 24px",
    },
    background: "rgba(255, 255, 255, 0.95)", // Fallback para backdrop-filter
    backdropFilter: "blur(10px)",
  },
  formTitle: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: theme.spacing(1),
    letterSpacing: "-0.03em",
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: theme.spacing(4),
    fontWeight: 400,
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: "600px",
    margin: "0 auto",
    marginBottom: theme.spacing(4),
    "& a": {
      color: "#22c55e",
      textDecoration: "none",
      fontWeight: 600,
      transition: "all 0.2s ease",
      "&:hover": {
        color: "#16a34a",
        textDecoration: "underline",
      },
    },
  },
  stepper: {
    backgroundColor: "transparent",
    padding: theme.spacing(3, 0, 5),
    "& .MuiStepIcon-root": {
      color: "#e2e8f0",
      fontSize: "2.2rem",
      transition: "all 0.3s ease",
    },
    "& .MuiStepIcon-root.MuiStepIcon-active": {
      color: "#22c55e",
      filter: "drop-shadow(0 4px 12px rgba(34, 197, 94, 0.4))",
    },
    "& .MuiStepIcon-root.MuiStepIcon-completed": {
      color: "#22c55e",
    },
    "& .MuiStepLabel-label": {
      color: "#64748b",
      fontSize: "15px",
      fontWeight: 500,
      marginTop: theme.spacing(1),
    },
    "& .MuiStepLabel-label.MuiStepLabel-active": {
      color: "#22c55e",
      fontWeight: 600,
    },
    "& .MuiStepLabel-label.MuiStepLabel-completed": {
      color: "#22c55e",
      fontWeight: 600,
    },
    "& .MuiStepConnector-lineHorizontal": {
      borderColor: "#e2e8f0",
      borderTopWidth: "2px",
    },
    "& .MuiStepConnector-root.MuiStepConnector-active .MuiStepConnector-lineHorizontal": {
      borderColor: "#22c55e",
    },
    "& .MuiStepConnector-root.MuiStepConnector-completed .MuiStepConnector-lineHorizontal": {
      borderColor: "#22c55e",
    },
  },
  form: {
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
  },
  inputLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: theme.spacing(1),
    textAlign: "left",
    display: "block",
    letterSpacing: "0.01em",
  },
  inputField: {
    marginBottom: theme.spacing(3),
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      fontSize: "16px",
      transition: "all 0.3s ease",
      "& fieldset": {
        borderColor: "#e2e8f0",
        borderWidth: "1px",
        transition: "all 0.3s ease",
      },
      "&:hover": {
        backgroundColor: "#f1f5f9",
        "& fieldset": {
          borderColor: "#cbd5e1",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "white",
        "& fieldset": {
          borderColor: "#22c55e",
          borderWidth: "2px",
        },
      },
      "& input": {
        padding: "16px 18px",
        fontSize: "15px",
        fontWeight: 400,
        letterSpacing: "0.01em",
      },
      "& input::placeholder": {
        color: "#94a3b8",
        opacity: 1,
      },
    },
    "& .MuiInputLabel-root": {
      display: "none",
    },
    "& .MuiFormHelperText-root": {
      marginLeft: "4px",
      fontSize: "13px",
      marginTop: "6px",
    },
  },
  passwordToggle: {
    color: "#94a3b8",
    "&:hover": {
      color: "#64748b",
    },
  },
  submitButton: {
    width: "100%",
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "white",
    padding: "16px",
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "16px",
    textTransform: "none",
    boxShadow: "0 4px 14px 0 rgba(34, 197, 94, 0.3)",
    marginBottom: theme.spacing(3),
    letterSpacing: "0.025em",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
      boxShadow: "0 6px 20px 0 rgba(34, 197, 94, 0.4)",
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
    "&:disabled": {
      background: "#cbd5e1",
      color: "white",
      boxShadow: "none",
    },
  },
  backToLoginButton: {
    position: "absolute",
    top: theme.spacing(2),
    left: theme.spacing(2),
    background: "rgba(255, 255, 255, 0.9)",
    color: "#64748b",
    padding: "10px 20px",
    borderRadius: "10px",
    fontWeight: 500,
    fontSize: "14px",
    textTransform: "none",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
    background: "rgba(255, 255, 255, 0.9)", // Fallback para backdrop-filter
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "white",
      borderColor: "#cbd5e1",
      transform: "translateX(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    [theme.breakpoints.down("sm")]: {
      position: "relative",
      top: "auto",
      left: "auto",
      marginBottom: theme.spacing(2),
      width: "100%",
    },
  },
  planCard: {
    backgroundColor: "white",
    border: "2px solid #e2e8f0",
    borderRadius: "20px",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      borderColor: "#22c55e",
      backgroundColor: "#f8fdf9",
      transform: "translateY(-8px)",
      boxShadow: "0 20px 40px -15px rgba(34, 197, 94, 0.2)",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: "transparent",
      transition: "background 0.3s ease",
    },
  },
  planCardSelected: {
    borderColor: "#22c55e",
    backgroundColor: "#f0fdf4",
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px -15px rgba(34, 197, 94, 0.25)",
    "&::before": {
      background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
    },
    "& $planIcon": {
      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      "& svg": {
        color: "white",
      },
    },
  },
  planCardPopular: {
    position: "relative",
    "&::after": {
      content: '"MAIS POPULAR"',
      position: "absolute",
      top: "20px",
      right: "20px",
      background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
      color: "white",
      padding: "6px 16px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
    },
  },
  planHeader: {
    marginBottom: theme.spacing(3),
    textAlign: "center",
  },
  planIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    marginBottom: theme.spacing(2),
    transition: "all 0.3s ease",
    "& svg": {
      color: "#22c55e",
      fontSize: "24px",
    },
  },
  planName: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: theme.spacing(0.5),
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },
  planDescription: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: theme.spacing(3),
    lineHeight: 1.5,
  },
  planPricing: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
  },
  planPrice: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1,
  },
  planPriceCurrency: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#64748b",
  },
  planPeriod: {
    fontSize: "16px",
    color: "#94a3b8",
    fontWeight: 500,
  },
  planFeatures: {
    flex: 1,
    "& .feature": {
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(1.5),
      fontSize: "13px",
      color: "#475569",
      fontWeight: 500,
      "& svg": {
        marginRight: theme.spacing(1),
        color: "#22c55e",
        fontSize: "18px",
      },
    },
  },
  planCta: {
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(3),
    borderTop: "1px solid #f1f5f9",
  },
  planButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    fontWeight: 600,
    fontSize: "15px",
    textTransform: "none",
    transition: "all 0.3s ease",
    letterSpacing: "0.02em",
  },
  planButtonPrimary: {
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "white",
    boxShadow: "0 4px 14px rgba(34, 197, 94, 0.3)",
    "&:hover": {
      boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)",
      transform: "translateY(-1px)",
    },
  },
  planButtonSecondary: {
    background: "transparent",
    color: "#22c55e",
    border: "2px solid #22c55e",
    "&:hover": {
      backgroundColor: "#f0fdf4",
      borderColor: "#16a34a",
      color: "#16a34a",
    },
  },
  footer: {
    fontSize: "12px",
    color: "#94a3b8",
    lineHeight: "1.6",
    fontWeight: 400,
    textAlign: "center",
    marginTop: theme.spacing(3),
    "& a": {
      color: "#22c55e",
      textDecoration: "none",
      fontWeight: 500,
      transition: "color 0.2s ease",
      "&:hover": {
        color: "#16a34a",
        textDecoration: "underline",
      },
    },
  },
  trialBadge: {
    display: "inline-flex",
    alignItems: "center",
    background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    color: "white",
    padding: "10px 24px",
    borderRadius: "30px",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: theme.spacing(4),
    boxShadow: "0 4px 14px rgba(251, 191, 36, 0.3)",
    letterSpacing: "0.02em",
    animation: "$pulse 2s ease-in-out infinite",
    "& svg": {
      marginRight: theme.spacing(1),
      fontSize: "20px",
    },
  },
  plansGrid: {
    marginBottom: theme.spacing(4),
  },
  selectedPlanAlert: {
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: theme.spacing(3),
    border: "2px solid #bbf7d0",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    "& .icon": {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      "& svg": {
        color: "white",
        fontSize: "24px",
      },
    },
    "& .content": {
      flex: 1,
      "& .title": {
        fontSize: "16px",
        color: "#166534",
        fontWeight: 600,
        marginBottom: "4px",
      },
      "& .subtitle": {
        fontSize: "14px",
        color: "#15803d",
        fontWeight: 500,
      },
    },
  },
  securityInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    fontSize: "13px",
    color: "#64748b",
    "& svg": {
      fontSize: "16px",
      color: "#22c55e",
    },
  },
  floatingShape: {
    position: "absolute",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
    filter: "blur(40px)",
    zIndex: 0,
  },
  shape1: {
    width: "400px",
    height: "400px",
    top: "-200px",
    right: "-150px",
  },
  shape2: {
    width: "350px",
    height: "350px",
    bottom: "50px",
    left: "-50px",
  },
}));

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Nome muito curto!")
    .max(50, "Nome muito longo!")
    .required("Campo obrigatório"),
  password: Yup.string()
    .min(5, "Senha muito curta! Mínimo 5 caracteres")
    .max(50, "Senha muito longa!")
    .required("Campo obrigatório"),
  email: Yup.string().email("Email inválido").required("Campo obrigatório"),
  phone: Yup.string().min(15, "Telefone incompleto").required("Campo obrigatório"),
  planId: Yup.string().required("Selecione um plano"),
});

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [allowregister, setallowregister] = useState("enabled");
  const [trial, settrial] = useState("3");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  let companyId = null;

  useEffect(() => {
    fetchallowregister();
    fetchtrial();
  }, []);

  const fetchtrial = async () => {
    try {
      const responsevvv = await api.get("/settings/trial");
      const allowtrialX = responsevvv.data.value;
      settrial(allowtrialX);
    } catch (error) {
      console.error("Error retrieving trial", error);
    }
  };

  const fetchallowregister = async () => {
    try {
      const responsevv = await api.get("/settings/allowregister");
      const allowregisterX = responsevv.data.value;
      setallowregister(allowregisterX);
    } catch (error) {
      console.error("Error retrieving allowregister", error);
    }
  };

  if (allowregister === "disabled") {
    history.push("/login");
  }

  const params = qs.parse(window.location.search);
  if (params.companyId !== undefined) {
    companyId = params.companyId;
  }

  const initialState = {
    name: "",
    email: "",
    phone: "",
    password: "",
    planId: "",
  };

  const dueDate = moment().add(trial, "day").format();

  const handleSignUp = async (values) => {
    setLoading(true);
    Object.assign(values, {
      recurrence: "MENSAL",
      dueDate: dueDate,
      status: "t",
      campaignsEnabled: true,
    });

    try {
      await openApi.post("/companies/cadastro", values);
      toast.success(i18n.t("signup.toasts.success"));
      history.push("/login");
    } catch (err) {
      console.log(err);
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  const [plans, setPlans] = useState([]);
  const { register: listPlans } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const list = await listPlans();
      setPlans(list);
    }
    fetchData();
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const steps = ["Escolha seu plano", "Crie sua conta"];

  const   getPlanIcon = (index) => {
    const icons = [<FlashOn />, <TrendingUp />, <Star />, <EmojiEvents />];
    return icons[index % icons.length];
  };

  const getPlanDescription = (plan) => {
    const descriptions = {
      0: "Ideal para pequenas empresas e startups",
      1: "Perfeito para negócios em crescimento",
      2: "Solução completa para grandes empresas",
      3: "Máximo desempenho e recursos ilimitados"
    };
    return descriptions[plans.indexOf(plan)] || "Transforme seu atendimento ao cliente";
  };

  const getFeatureIcon = (feature) => {
    const icons = {
      connections: <Group />,
      users: <HeadsetMic />,
      campaigns: <Send />,
      schedules: <DateRange />,
      chat: <Forum />,
      api: <Code />
    };
    return icons[feature] || <CheckCircle />;
  };

  const PlanCard = ({ plan, isSelected, onClick, index }) => (
    <div
      className={`${classes.planCard} ${
        isSelected ? classes.planCardSelected : ""
      } ${index === 1 ? classes.planCardPopular : ""}`}
      onClick={onClick}
    >
      <div className={classes.planHeader}>
        <div className={classes.planIcon}>
          {getPlanIcon(index)}
        </div>
        <div className={classes.planName}>{plan.name}</div>
        <div className={classes.planDescription}>
          {getPlanDescription(plan)}
        </div>
        <div className={classes.planPricing}>
          <span className={classes.planPriceCurrency}>R$</span>
          <span className={classes.planPrice}>
            {Math.floor(plan.value)}
          </span>
          <span className={classes.planPeriod}>/mês</span>
        </div>
      </div>
      
      <div className={classes.planFeatures}>
        <div className="feature">
          {getFeatureIcon('connections')}
          {plan.connections} Conexões WhatsApp
        </div>
        <div className="feature">
          {getFeatureIcon('users')}
          {plan.users} Usuários
        </div>
        <div className="feature">
          {getFeatureIcon('campaigns')}
          Campanhas {plan.useCampaigns ? "ilimitadas" : "não incluídas"}
        </div>
        <div className="feature">
          {getFeatureIcon('schedules')}
          Agendamentos {plan.useSchedules ? "incluídos" : "não incluídos"}
        </div>
        <div className="feature">
          {getFeatureIcon('chat')}
          Chat interno {plan.useInternalChat ? "ativo" : "não incluído"}
        </div>
        <div className="feature">
          {getFeatureIcon('api')}
          API externa {plan.useExternalApi ? "liberada" : "não incluída"}
        </div>
      </div>

      <div className={classes.planCta}>
        <Button
          className={`${classes.planButton} ${
            isSelected ? classes.planButtonPrimary : classes.planButtonSecondary
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {isSelected ? "✓ Plano selecionado" : "Selecionar este plano"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <div className={`${classes.floatingShape} ${classes.shape1}`}></div>
      <div className={`${classes.floatingShape} ${classes.shape2}`}></div>
      
      <div className={classes.signUpContainer}>
        <div className={classes.logoContainer}>
          <div className={classes.logoIcon}>
            <MessageIcon />
          </div>
          <h1 className={classes.brandName}>
            <span>Delfin</span>Zap
          </h1>
          <p className={classes.brandSubtitle}>
            Plataforma de múltiplos atendimentos
          </p>
        </div>

        <div className={classes.signUpCard}>
          <div style={{ textAlign: 'center' }}>
            <div className={classes.trialBadge}>
              <Star /> {trial} dias grátis para testar
            </div>
          </div>

          <Typography className={classes.formTitle}>
            {activeStep === 0 ? "Escolha o plano perfeito para você" : "Complete seu cadastro"}
          </Typography>
          <Typography className={classes.formSubtitle}>
            {activeStep === 0 ? (
              "Todos os planos incluem suporte completo e podem ser alterados a qualquer momento. Sem compromisso!"
            ) : (
              <>
                Já tem uma conta?{" "}
                <Link component={RouterLink} to="/login">
                  Faça login aqui
                </Link>
              </>
            )}
          </Typography>

          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 ? (
            <Fade in={activeStep === 0} timeout={500}>
              <div>
                <Button
                  component={RouterLink}
                  to="/login"
                  startIcon={<ArrowBack />}
                  className={classes.backToLoginButton}
                >
                  Voltar ao login
                </Button>
                
                <Grid container spacing={2} className={classes.plansGrid}>
                  {plans.map((plan, index) => (
                    <Grid item xs={12} sm={6} md={3} key={plan.id}>
                      <PlanCard
                        plan={plan}
                        isSelected={selectedPlan?.id === plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        index={index}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Button
                  onClick={handleNext}
                  disabled={!selectedPlan}
                  className={classes.submitButton}
                  startIcon={<ArrowForward />}
                >
                  Continuar com o plano {selectedPlan?.name || "selecionado"}
                </Button>
              </div>
            </Fade>
          ) : (
            <Slide
              direction="left"
              in={activeStep === 1}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={handleBack}
                  className={classes.backButton}
                >
                  Voltar para os planos
                </Button>

                {selectedPlan && (
                  <div className={classes.selectedPlanAlert}>
                    <div className="icon">
                      <CheckCircle />
                    </div>
                    <div className="content">
                      <div className="title">
                        Plano {selectedPlan.name} selecionado
                      </div>
                      <div className="subtitle">
                        R$ {selectedPlan.value.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}/mês após o período de teste
                      </div>
                    </div>
                  </div>
                )}

                <Formik
                  initialValues={{
                    ...initialState,
                    planId: selectedPlan?.id || "",
                  }}
                  enableReinitialize={true}
                  validationSchema={UserSchema}
                  onSubmit={(values, actions) => {
                    handleSignUp(values);
                    actions.setSubmitting(false);
                  }}
                >
                  {({
                    touched,
                    errors,
                    isSubmitting,
                    values,
                    setFieldValue,
                  }) => (
                    <Form className={classes.form}>
                      <div>
                        <label className={classes.inputLabel}>
                          Nome da empresa
                        </label>
                        <Field
                          as={TextField}
                          name="name"
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                          variant="outlined"
                          fullWidth
                          className={classes.inputField}
                          placeholder="Digite o nome da sua empresa"
                        />
                      </div>

                      <div>
                        <label className={classes.inputLabel}>E-mail corporativo</label>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          name="email"
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          autoComplete="email"
                          className={classes.inputField}
                          placeholder="empresa@email.com"
                        />
                      </div>

                      <div>
                        <label className={classes.inputLabel}>WhatsApp</label>
                        <Field name="phone">
                          {({ field, form }) => (
                            <InputMask
                              mask="(99) 99999-9999"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                            >
                              {() => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  error={touched.phone && Boolean(errors.phone)}
                                  helperText={touched.phone && errors.phone}
                                  className={classes.inputField}
                                  placeholder="(00) 00000-0000"
                                />
                              )}
                            </InputMask>
                          )}
                        </Field>
                      </div>

                      <div>
                        <label className={classes.inputLabel}>Crie uma senha</label>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          name="password"
                          type={showPassword ? "text" : "password"}
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                          className={classes.inputField}
                          placeholder="Mínimo 5 caracteres"
                          autoComplete="new-password"
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

                      <Button
                        type="submit"
                        variant="contained"
                        className={classes.submitButton}
                        disabled={loading}
                        startIcon={loading ? null : <FlashOn />}
                      >
                        {loading ? (
                          <CircularProgress size={22} color="inherit" />
                        ) : (
                          `Começar teste grátis de ${trial} dias`
                        )}
                      </Button>

                      <div className={classes.securityInfo}>
                        <Lock />
                        Seus dados estão seguros e criptografados
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </Slide>
          )}

          <div className={classes.footer}>
            © 2025 DelfinZap. Todos os direitos reservados.
            <br />
            <Link href="#">Termos de uso</Link> • <Link href="#">Política de privacidade</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;