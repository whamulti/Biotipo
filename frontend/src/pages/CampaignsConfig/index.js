import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { toast } from "react-toastify";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import api from "../../services/api";

import { i18n } from "../../translate/i18n";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Fade,
  Grow,
  Chip,
  Card,
  CardContent,
  Tooltip,
  LinearProgress,
  Collapse,
  Divider,
} from "@material-ui/core";
import {
  Settings,
  Timer,
  AddCircleOutline,
  Save,
  Close,
  Code,
  AccessTime,
  AvTimer,
  HourglassEmpty,
  Delete,
  ExpandMore,
  ExpandLess,
  PlaylistAdd,
} from "@material-ui/icons";
import ConfirmationModal from "../../components/ConfirmationModal";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  tabPanelsContainer: {
    padding: theme.spacing(3),
    overflowY: 'auto',
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    borderBottom: '2px solid #f1f5f9',
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(2),
    color: 'white',
    '& svg': {
      fontSize: 22,
    },
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
  },
  formControl: {
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
      fontSize: '14px',
      fontWeight: 500,
    },
  },
  textField: {
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
      fontSize: '14px',
      fontWeight: 500,
    },
  },
  button: {
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    padding: '10px 20px',
    transition: 'all 0.3s ease',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
      transform: 'translateY(-1px)',
    },
  },
  secondaryButton: {
    backgroundColor: 'white',
    color: '#22c55e',
    border: '2px solid #22c55e',
    '&:hover': {
      backgroundColor: '#f0fdf4',
      borderColor: '#16a34a',
    },
  },
  cancelButton: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: '1px solid #fecaca',
    '&:hover': {
      backgroundColor: '#fee2e2',
      borderColor: '#fca5a5',
    },
  },
  variablesSection: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  variableForm: {
    padding: theme.spacing(2),
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: theme.spacing(2),
  },
  table: {
    marginTop: theme.spacing(2),
    '& .MuiTableCell-root': {
      borderBottom: '1px solid #f1f5f9',
      padding: theme.spacing(2),
    },
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    '& .MuiTableCell-head': {
      fontWeight: 600,
      fontSize: '14px',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: '2px solid #e2e8f0',
    },
  },
  tableRow: {
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f8fafc',
      transform: 'scale(1.01)',
    },
  },
  variableKey: {
    fontFamily: 'monospace',
    fontSize: '14px',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '4px 8px',
    borderRadius: '6px',
    display: 'inline-block',
  },
  variableValue: {
    fontSize: '14px',
    color: '#334155',
    maxWidth: '400px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    padding: '6px',
    '&:hover': {
      backgroundColor: '#fee2e2',
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: '#94a3b8',
    '& svg': {
      fontSize: 48,
      marginBottom: theme.spacing(2),
      opacity: 0.3,
    },
  },
  intervalCard: {
    padding: theme.spacing(2),
    borderRadius: '8px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    marginBottom: theme.spacing(2),
  },
  intervalInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: '13px',
    color: '#16a34a',
    '& svg': {
      fontSize: '18px',
    },
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(3),
    borderTop: '1px solid #e2e8f0',
  },
}));

const initialSettings = {
  messageInterval: 20,
  longerIntervalAfter: 20,
  greaterInterval: 60,
  variables: [],
};

const CampaignsConfig = () => {
  const classes = useStyles();

  const [settings, setSettings] = useState(initialSettings);
  const [showVariablesForm, setShowVariablesForm] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [variable, setVariable] = useState({ key: "", value: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/campaign-settings");
        const settingsList = [];
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((item) => {
            settingsList.push([item.key, JSON.parse(item.value)]);
          });
          setSettings(Object.fromEntries(settingsList));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleOnChangeVariable = (e) => {
    if (e.target.value !== null) {
      const changedProp = {};
      changedProp[e.target.name] = e.target.value;
      setVariable((prev) => ({ ...prev, ...changedProp }));
    }
  };

  const handleOnChangeSettings = (e) => {
    const changedProp = {};
    changedProp[e.target.name] = e.target.value;
    setSettings((prev) => ({ ...prev, ...changedProp }));
  };

  const addVariable = () => {
    if (!variable.key || !variable.value) {
      toast.error("Preencha todos os campos");
      return;
    }

    setSettings((prev) => {
      const variablesExists = settings.variables.filter(
        (v) => v.key === variable.key
      );
      const variables = prev.variables;
      if (variablesExists.length === 0) {
        variables.push(Object.assign({}, variable));
        setVariable({ key: "", value: "" });
        toast.success("Variável adicionada");
      } else {
        toast.warning("Variável já existe");
      }
      return { ...prev, variables };
    });
  };

  const removeVariable = () => {
    const newList = settings.variables.filter((v) => v.key !== selectedKey);
    setSettings((prev) => ({ ...prev, variables: newList }));
    setSelectedKey(null);
    toast.success("Variável removida");
  };

  const saveSettings = async () => {
    try {
      await api.post("/campaign-settings", { settings });
      toast.success("Configurações salvas com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar configurações");
    }
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={i18n.t("campaigns.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={removeVariable}
      >
        {i18n.t("campaigns.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      
      <MainHeader>
        <Title>{i18n.t("campaignsConfig.title")}</Title>
      </MainHeader>
      
      <Paper className={classes.mainPaper} variant="outlined">
        {loading && <LinearProgress color="primary" style={{ height: 3 }} />}
        
        <Box className={classes.tabPanelsContainer}>
          {/* Seção de Intervalos */}
          <Fade in timeout={600}>
            <Card className={classes.sectionCard}>
              <Box className={classes.sectionHeader}>
                <Box className={classes.sectionIcon}>
                  <Timer />
                </Box>
                <Box>
                  <Typography className={classes.sectionTitle}>
                    Configurações de Intervalos
                  </Typography>
                  <Typography className={classes.sectionSubtitle}>
                    Configure os intervalos de tempo entre os disparos de mensagens
                  </Typography>
                </Box>
              </Box>

              <Box className={classes.intervalCard}>
                <Box className={classes.intervalInfo}>
                  <AccessTime />
                  <Typography>
                    Os intervalos ajudam a evitar bloqueios e tornam a comunicação mais natural
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    fullWidth
                  >
                    <InputLabel id="messageInterval-label">
                      Intervalo Randômico de Disparo
                    </InputLabel>
                    <Select
                      name="messageInterval"
                      id="messageInterval"
                      labelId="messageInterval-label"
                      label="Intervalo Randômico de Disparo"
                      value={settings.messageInterval}
                      onChange={(e) => handleOnChangeSettings(e)}
                    >
                      <MenuItem value={0}>Sem Intervalo</MenuItem>
                      <MenuItem value={5}>5 segundos</MenuItem>
                      <MenuItem value={10}>10 segundos</MenuItem>
                      <MenuItem value={15}>15 segundos</MenuItem>
                      <MenuItem value={20}>20 segundos</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    fullWidth
                  >
                    <InputLabel id="longerIntervalAfter-label">
                      Intervalo Maior Após
                    </InputLabel>
                    <Select
                      name="longerIntervalAfter"
                      id="longerIntervalAfter"
                      labelId="longerIntervalAfter-label"
                      label="Intervalo Maior Após"
                      value={settings.longerIntervalAfter}
                      onChange={(e) => handleOnChangeSettings(e)}
                    >
                      <MenuItem value={0}>Não definido</MenuItem>
                      <MenuItem value={1}>1 segundo</MenuItem>
                      <MenuItem value={5}>5 segundos</MenuItem>
                      <MenuItem value={10}>10 segundos</MenuItem>
                      <MenuItem value={15}>15 segundos</MenuItem>
                      <MenuItem value={20}>20 segundos</MenuItem>
                      <MenuItem value={30}>30 segundos</MenuItem>
                      <MenuItem value={40}>40 segundos</MenuItem>
                      <MenuItem value={60}>60 segundos</MenuItem>
                      <MenuItem value={80}>80 segundos</MenuItem>
                      <MenuItem value={100}>100 segundos</MenuItem>
                      <MenuItem value={120}>120 segundos</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    fullWidth
                  >
                    <InputLabel id="greaterInterval-label">
                      Intervalo de Disparo Maior
                    </InputLabel>
                    <Select
                      name="greaterInterval"
                      id="greaterInterval"
                      labelId="greaterInterval-label"
                      label="Intervalo de Disparo Maior"
                      value={settings.greaterInterval}
                      onChange={(e) => handleOnChangeSettings(e)}
                    >
                      <MenuItem value={0}>Sem Intervalo</MenuItem>
                      <MenuItem value={1}>1 segundo</MenuItem>
                      <MenuItem value={5}>5 segundos</MenuItem>
                      <MenuItem value={10}>10 segundos</MenuItem>
                      <MenuItem value={15}>15 segundos</MenuItem>
                      <MenuItem value={20}>20 segundos</MenuItem>
                      <MenuItem value={30}>30 segundos</MenuItem>
                      <MenuItem value={40}>40 segundos</MenuItem>
                      <MenuItem value={60}>60 segundos</MenuItem>
                      <MenuItem value={80}>80 segundos</MenuItem>
                      <MenuItem value={100}>100 segundos</MenuItem>
                      <MenuItem value={120}>120 segundos</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Card>
          </Fade>

          {/* Seção de Variáveis */}
          <Fade in timeout={800}>
            <Card className={classes.sectionCard}>
              <Box className={classes.sectionHeader}>
                <Box className={classes.sectionIcon}>
                  <Code />
                </Box>
                <Box flex={1}>
                  <Typography className={classes.sectionTitle}>
                    Variáveis Personalizadas
                  </Typography>
                  <Typography className={classes.sectionSubtitle}>
                    Crie atalhos para textos frequentemente usados nas campanhas
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  className={`${classes.button} ${classes.secondaryButton}`}
                  onClick={() => setShowVariablesForm(!showVariablesForm)}
                  startIcon={showVariablesForm ? <ExpandLess /> : <ExpandMore />}
                >
                  {showVariablesForm ? "Ocultar Formulário" : "Adicionar Variável"}
                </Button>
              </Box>

              <Collapse in={showVariablesForm}>
                <Box className={classes.variableForm}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                      <TextField
                        label="Atalho"
                        variant="outlined"
                        value={variable.key}
                        name="key"
                        onChange={handleOnChangeVariable}
                        fullWidth
                        className={classes.textField}
                        placeholder="Ex: saudacao"
                        InputProps={{
                          startAdornment: <Typography style={{ color: '#94a3b8', marginRight: 4 }}>{`{`}</Typography>,
                          endAdornment: <Typography style={{ color: '#94a3b8', marginLeft: 4 }}>{`}`}</Typography>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <TextField
                        label="Conteúdo"
                        variant="outlined"
                        value={variable.value}
                        name="value"
                        onChange={handleOnChangeVariable}
                        fullWidth
                        className={classes.textField}
                        placeholder="Ex: Olá, tudo bem?"
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box display="flex" gap={1} height="100%">
                        <Button
                          fullWidth
                          variant="contained"
                          className={`${classes.button} ${classes.primaryButton}`}
                          onClick={addVariable}
                          style={{ flex: 1 }}
                        >
                          Adicionar
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>

              {settings.variables.length > 0 ? (
                <Box>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow className={classes.tableHeader}>
                        <TableCell style={{ width: '50px' }}></TableCell>
                        <TableCell style={{ width: '200px' }}>Atalho</TableCell>
                        <TableCell>Conteúdo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {settings.variables.map((v, index) => (
                        <Grow in key={index} timeout={300 + index * 100}>
                          <TableRow className={classes.tableRow}>
                            <TableCell>
                              <Tooltip title="Remover variável">
                                <IconButton
                                  size="small"
                                  className={classes.deleteButton}
                                  onClick={() => {
                                    setSelectedKey(v.key);
                                    setConfirmationOpen(true);
                                  }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <span className={classes.variableKey}>
                                {`{${v.key}}`}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={v.value} arrow>
                                <Typography className={classes.variableValue}>
                                  {v.value}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        </Grow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ) : (
                <Box className={classes.emptyState}>
                  <PlaylistAdd />
                  <Typography variant="h6" style={{ marginBottom: 8 }}>
                    Nenhuma variável cadastrada
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Clique em "Adicionar Variável" para criar sua primeira variável
                  </Typography>
                </Box>
              )}
            </Card>
          </Fade>

          {/* Botões de Ação */}
          <Box className={classes.actionsContainer}>
            <Button
              variant="contained"
              className={`${classes.button} ${classes.primaryButton}`}
              onClick={saveSettings}
              startIcon={<Save />}
              size="large"
            >
              Salvar Configurações
            </Button>
          </Box>
        </Box>
      </Paper>
    </MainContainer>
  );
};

export default CampaignsConfig;