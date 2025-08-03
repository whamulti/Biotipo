import React, { useContext, useState, useEffect, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import { Button, Box, Fade, Grow, IconButton } from "@material-ui/core";

import SpeedIcon from "@material-ui/icons/Speed";
import GroupIcon from "@material-ui/icons/Group";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PersonIcon from "@material-ui/icons/Person";
import CallIcon from "@material-ui/icons/Call";
import MobileFriendlyIcon from '@material-ui/icons/MobileFriendly';
import StoreIcon from '@material-ui/icons/Store';
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ForumIcon from "@material-ui/icons/Forum";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import MessageIcon from "@material-ui/icons/Message";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import TimerIcon from "@material-ui/icons/Timer";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import RefreshIcon from "@material-ui/icons/Refresh";
import DateRangeIcon from "@material-ui/icons/DateRange";
import ScheduleIcon from "@material-ui/icons/Schedule";

import { makeStyles } from "@material-ui/core/styles";
import { grey, blue } from "@material-ui/core/colors";
import { toast } from "react-toastify";

import Chart from "./Chart";
import ButtonWithSpinner from "../../components/ButtonWithSpinner";
import CardCounter from "../../components/Dashboard/CardCounter";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";

import { AuthContext } from "../../context/Auth/AuthContext";

import useDashboard from "../../hooks/useDashboard";
import useTickets from "../../hooks/useTickets";
import useUsers from "../../hooks/useUsers";
import useContacts from "../../hooks/useContacts";
import useMessages from "../../hooks/useMessages";
import { ChatsUser } from "./ChartsUser";

import Filters from "./Filters";
import { isEmpty } from "lodash";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";
import ChartsAppointmentsAtendent from "./ChartsAppointmentsAtendent";
import ChartsRushHour from "./ChartsRushHour";
import ChartsDepartamentRatings from "./ChartsDepartamentRatings";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  pageHeader: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  titleIcon: {
    width: 48,
    height: 48,
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    '& svg': {
      fontSize: 28,
    },
  },
  refreshButton: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: theme.spacing(1.5),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f1f5f9',
      borderColor: '#cbd5e1',
      transform: 'rotate(180deg)',
    },
  },
  card: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    height: "100%",
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    transition: "all 0.3s ease",
    backgroundColor: 'white',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    position: 'relative',
    overflow: 'hidden',
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
      borderColor: '#22c55e',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover::before': {
      opacity: 1,
    },
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: theme.spacing(1),
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  cardValue: {
    fontSize: "32px",
    fontWeight: 700,
    lineHeight: 1.2,
    color: '#0f172a',
    marginBottom: theme.spacing(0.5),
  },
  cardTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    fontSize: '13px',
    fontWeight: 600,
  },
  trendUp: {
    color: '#22c55e',
    '& svg': {
      fontSize: 16,
    },
  },
  trendDown: {
    color: '#ef4444',
    '& svg': {
      fontSize: 16,
    },
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    '& svg': {
      fontSize: 28,
      color: '#22c55e',
    },
  },
  filterSection: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: '16px',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0',
  },
  filterTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& svg': {
      color: '#22c55e',
    },
  },
  filterField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderColor: '#e2e8f0',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#cbd5e1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#22c55e',
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-outlined': {
      color: '#64748b',
    },
  },
  filterButton: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    borderRadius: '12px',
    padding: '14px 28px',
    fontWeight: 600,
    fontSize: '15px',
    textTransform: 'none',
    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      background: '#cbd5e1',
      color: 'white',
      boxShadow: 'none',
    },
  },
  chartPaper: {
    padding: theme.spacing(3),
    borderRadius: '16px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
    },
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: '2px solid #f1f5f9',
  },
  attendantsTable: {
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&::after': {
      content: '""',
      flex: 1,
      height: '2px',
      background: 'linear-gradient(90deg, #e2e8f0 0%, transparent 100%)',
      marginLeft: theme.spacing(2),
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(6),
    color: '#94a3b8',
    '& svg': {
      fontSize: 48,
      marginBottom: theme.spacing(2),
      opacity: 0.3,
    },
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [period, setPeriod] = useState(0);
  const [filterType, setFilterType] = useState(1);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);

  const { find } = useDashboard();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
  }, []);

  async function handleChangePeriod(value) {
    setPeriod(value);
  }

  async function handleChangeFilterType(value) {
    setFilterType(value);
    if (value === 1) {
      setPeriod(0);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  }

  async function fetchData() {
    setLoading(true);

    let params = {};

    if (period > 0) {
      params = { days: period };
    }

    if (!isEmpty(dateFrom) && moment(dateFrom).isValid()) {
      params = { ...params, date_from: moment(dateFrom).format("YYYY-MM-DD") };
    }

    if (!isEmpty(dateTo) && moment(dateTo).isValid()) {
      params = { ...params, date_to: moment(dateTo).format("YYYY-MM-DD") };
    }

    if (Object.keys(params).length === 0) {
      toast.error("Parametrize o filtro");
      setLoading(false);
      return;
    }

    const data = await find(params);
    setCounters(data.counters);
    setAttendants(isArray(data.attendants) ? data.attendants : []);
    setLoading(false);
  }

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }

  const GetUsers = () => {
    return attendants.filter(user => user.online).length;
  };

  const GetContacts = (all) => {
    let props = all ? {} : {};
    const { count } = useContacts(props);
    return count;
  };

  const cardConfigs = [
    {
      title: "Conexões Ativas",
      value: counters.totalWhatsappSessions || 0,
      icon: <MobileFriendlyIcon />,
      show: user.super,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Empresas",
      value: counters.totalCompanies || 0,
      icon: <StoreIcon />,
      show: user.super,
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Em Conversa",
      value: counters.supportHappening || 0,
      icon: <CallIcon />,
      show: true,
      trend: "-3%",
      trendUp: false,
    },
    {
      title: "Aguardando",
      value: counters.supportPending || 0,
      icon: <HourglassEmptyIcon />,
      show: true,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Novos Contatos",
      value: GetContacts(true) || 0,
      icon: <GroupAddIcon />,
      show: true,
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "T.M. de Conversa",
      value: formatTime(counters.avgSupportTime || 0),
      icon: <AccessAlarmIcon />,
      show: true,
      trend: "-5%",
      trendUp: false,
    },
    {
      title: "Finalizados",
      value: counters.supportFinished || 0,
      icon: <CheckCircleIcon />,
      show: true,
      trend: "+20%",
      trendUp: true,
    },
    {
      title: "T.M. de Espera",
      value: formatTime(counters.avgWaitTime || 0),
      icon: <TimerIcon />,
      show: true,
      trend: "-10%",
      trendUp: false,
    },
  ];

  function renderFilters() {
    if (filterType === 1) {
      return (
        <>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Data Inicial"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              className={classes.filterField}
              InputProps={{
                startAdornment: <DateRangeIcon style={{ marginRight: 8, color: '#94a3b8' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Data Final"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              className={classes.filterField}
              InputProps={{
                startAdornment: <DateRangeIcon style={{ marginRight: 8, color: '#94a3b8' }} />,
              }}
            />
          </Grid>
        </>
      );
    } else {
      return (
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined" className={classes.filterField}>
            <InputLabel id="period-selector-label">Período</InputLabel>
            <Select
              labelId="period-selector-label"
              value={period}
              onChange={(e) => handleChangePeriod(e.target.value)}
              label="Período"
              startAdornment={<ScheduleIcon style={{ marginRight: 8, marginLeft: 12, color: '#94a3b8' }} />}
            >
              <MenuItem value={0}>Nenhum selecionado</MenuItem>
              <MenuItem value={3}>Últimos 3 dias</MenuItem>
              <MenuItem value={7}>Últimos 7 dias</MenuItem>
              <MenuItem value={15}>Últimos 15 dias</MenuItem>
              <MenuItem value={30}>Últimos 30 dias</MenuItem>
              <MenuItem value={60}>Últimos 60 dias</MenuItem>
              <MenuItem value={90}>Últimos 90 dias</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      );
    }
  }

  return (
    <Container maxWidth="xl" className={classes.container}>
      {/* Page Header */}
      <Box className={classes.pageHeader}>
        <Typography className={classes.pageTitle}>
          <Box className={classes.titleIcon}>
            <SpeedIcon />
          </Box>
          Dashboard
        </Typography>
        <IconButton 
          className={classes.refreshButton}
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12}>
          <Paper className={classes.filterSection}>
            <Typography className={classes.filterTitle}>
              <FilterListIcon />
              Filtros de Visualização
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined" className={classes.filterField}>
                  <InputLabel id="filter-type-label">Tipo de Filtro</InputLabel>
                  <Select
                    labelId="filter-type-label"
                    value={filterType}
                    onChange={(e) => handleChangeFilterType(e.target.value)}
                    label="Tipo de Filtro"
                  >
                    <MenuItem value={1}>Filtro por Data</MenuItem>
                    <MenuItem value={2}>Filtro por Período</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {renderFilters()}

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  className={classes.filterButton}
                  onClick={fetchData}
                  disabled={loading}
                  startIcon={<FilterListIcon />}
                >
                  Aplicar Filtros
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Cards Section */}
        <Grid item xs={12}>
          <Typography className={classes.sectionTitle}>
            Métricas Principais
          </Typography>
        </Grid>
        
        {cardConfigs.filter(card => card.show).map((card, index) => (
          <Grow in key={index} timeout={600 + index * 100}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Paper className={classes.card}>
                <div className={classes.cardContent}>
                  <div className={classes.cardText}>
                    <Typography className={classes.cardTitle}>
                      {card.title}
                    </Typography>
                    <Typography className={classes.cardValue}>
                      {card.value}
                    </Typography>
                    <Box className={`${classes.cardTrend} ${card.trendUp ? classes.trendUp : classes.trendDown}`}>
                      {card.trendUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      {card.trend}
                    </Box>
                  </div>
                  <Box className={classes.cardIcon}>
                    {card.icon}
                  </Box>
                </div>
              </Paper>
            </Grid>
          </Grow>
        ))}

        {/* Attendants Status */}
        {attendants.length > 0 && (
          <Fade in timeout={1400}>
            <Grid item xs={12}>
              <Typography className={classes.sectionTitle}>
                Status dos Atendentes
              </Typography>
              <Box className={classes.attendantsTable}>
                <TableAttendantsStatus attendants={attendants} loading={loading} />
              </Box>
            </Grid>
          </Fade>
        )}

        {/* Charts Section */}
        <Grid item xs={12}>
          <Typography className={classes.sectionTitle}>
            Análises e Gráficos
          </Typography>
        </Grid>

        <Fade in timeout={1600}>
          <Grid item xs={12} lg={6}>
            <Paper className={classes.chartPaper}>
              <Typography className={classes.chartTitle}>
                Atendimentos por Usuário
              </Typography>
              <ChatsUser />
            </Paper>
          </Grid>
        </Fade>

        <Fade in timeout={1800}>
          <Grid item xs={12} lg={6}>
            <Paper className={classes.chartPaper}>
              <Typography className={classes.chartTitle}>
                Atendimentos por Data
              </Typography>
              <ChartsDate />
            </Paper>
          </Grid>
        </Fade>

        <ChartsAppointmentsAtendent />
        <ChartsRushHour />
        <ChartsDepartamentRatings />
      </Grid>
    </Container>
  );
};

export default Dashboard;