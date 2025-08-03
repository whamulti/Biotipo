import React, { useState, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Box,
  Divider,
  Typography,
  Tooltip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Fade,
  Grow,
  Badge,
} from "@material-ui/core";
import {
  Edit,
  CheckCircle,
  SignalCellularConnectedNoInternet2Bar,
  SignalCellularConnectedNoInternet0Bar,
  SignalCellular4Bar,
  CropFree,
  DeleteOutline,
  Refresh,
  AddCircleOutline,
  SettingsBackupRestore,
  Phone,
  AccountCircle,
  Update,
  Brightness4,
  Brightness7,
  WifiOff,
  Wifi,
  CropFree as QrCodeIcon,
  AccessTime,
  SyncProblem,
  PhoneAndroid,
  CheckCircleOutline,
  ErrorOutline,
  Warning,
  HourglassEmpty,
  Sync,
} from "@material-ui/icons";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import WhatsAppModal from "../../components/WhatsAppModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import QrcodeModal from "../../components/QrcodeModal";
import { i18n } from "../../translate/i18n";
import { WhatsAppsContext } from "../../context/WhatsApp/WhatsAppsContext";
import toastError from "../../errors/toastError";
import formatSerializedId from '../../utils/formatSerializedId';
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../../components/Can";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
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
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: 400,
    marginTop: theme.spacing(0.5),
  },
  statsCard: {
    display: 'flex',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: theme.spacing(3),
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
    padding: theme.spacing(2),
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f0fdf4',
      transform: 'translateY(-2px)',
    },
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  gridContainer: {
    marginTop: theme.spacing(3),
  },
  connectionCard: {
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    transition: "all 0.3s ease",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    overflow: 'hidden',
    position: 'relative',
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
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover::before': {
      opacity: 1,
    },
  },
  connectedCard: {
    '&::before': {
      background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
    },
  },
  disconnectedCard: {
    '&::before': {
      background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
    },
  },
  qrcodeCard: {
    '&::before': {
      background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
    },
  },
  cardHeader: {
    padding: theme.spacing(2.5),
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc',
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardContent: {
    padding: theme.spacing(3),
    flexGrow: 1,
  },
  cardActions: {
    padding: theme.spacing(2),
    borderTop: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc',
  },
  avatar: {
    width: 56,
    height: 56,
    fontSize: '20px',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
  },
  connectionInfo: {
    marginLeft: theme.spacing(2),
    flex: 1,
    minWidth: 0,
  },
  connectionName: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  connectionId: {
    fontSize: '13px',
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  statusSection: {
    marginBottom: theme.spacing(3),
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: '8px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    width: '100%',
    justifyContent: 'center',
  },
  connectedStatus: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    '& svg': {
      color: '#22c55e',
    },
  },
  disconnectedStatus: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    '& svg': {
      color: '#ef4444',
    },
  },
  qrcodeStatus: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    '& svg': {
      color: '#3b82f6',
    },
  },
  timeoutStatus: {
    backgroundColor: '#fff7ed',
    color: '#ea580c',
    border: '1px solid #fed7aa',
    '& svg': {
      color: '#f97316',
    },
  },
  openingStatus: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
    '& svg': {
      color: '#9ca3af',
    },
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.5s ease',
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    fontSize: '14px',
    color: '#64748b',
    "& svg": {
      marginRight: theme.spacing(1.5),
      fontSize: '20px',
      color: '#94a3b8',
    },
  },
  defaultBadge: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    '& svg': {
      fontSize: '16px',
    },
  },
  actionButton: {
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    padding: '10px 20px',
    transition: 'all 0.3s ease',
    width: '100%',
    marginBottom: theme.spacing(1),
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
  dangerButton: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: '2px solid #fecaca',
    '&:hover': {
      backgroundColor: '#fee2e2',
      borderColor: '#fca5a5',
    },
  },
  headerButton: {
    borderRadius: '12px',
    padding: '12px 24px',
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'none',
    transition: 'all 0.3s ease',
  },
  addButton: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
      transform: 'translateY(-1px)',
    },
  },
  restartButton: {
    backgroundColor: 'white',
    color: '#0ea5e9',
    border: '2px solid #bae6fd',
    '&:hover': {
      backgroundColor: '#f0f9ff',
      borderColor: '#7dd3fc',
    },
  },
  iconButtons: {
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  editButton: {
    color: '#0ea5e9',
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    flex: 1,
    '&:hover': {
      backgroundColor: '#e0f2fe',
      borderColor: '#7dd3fc',
    },
  },
  deleteButton: {
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    flex: 1,
    '&:hover': {
      backgroundColor: '#fee2e2',
      borderColor: '#fca5a5',
    },
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(8),
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  emptyState: {
    padding: theme.spacing(8),
    textAlign: "center",
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    '& svg': {
      fontSize: 64,
      color: '#cbd5e1',
      marginBottom: theme.spacing(2),
    },
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: theme.spacing(1),
  },
  emptySubtitle: {
    fontSize: '14px',
    color: '#64748b',
  },
}));

const StatusIndicator = ({ status }) => {
  const classes = useStyles();
  
  const getStatusData = () => {
    switch (status) {
      case "CONNECTED":
        return {
          icon: <Wifi />,
          text: "Conectado",
          class: classes.connectedStatus,
          progress: 100,
          color: '#22c55e',
        };
      case "DISCONNECTED":
        return {
          icon: <WifiOff />,
          text: "Desconectado",
          class: classes.disconnectedStatus,
          progress: 0,
          color: '#ef4444',
        };
      case "qrcode":
        return {
          icon: <CropFree />,
          text: "Aguardando QR Code",
          class: classes.qrcodeStatus,
          progress: 30,
          color: '#3b82f6',
        };
      case "TIMEOUT":
      case "PAIRING":
        return {
          icon: <SyncProblem />,
          text: "Timeout",
          class: classes.timeoutStatus,
          progress: 60,
          color: '#f97316',
        };
      case "OPENING":
        return {
          icon: <HourglassEmpty />,
          text: "Conectando...",
          class: classes.openingStatus,
          progress: 45,
          color: '#9ca3af',
        };
      default:
        return {
          icon: <ErrorOutline />,
          text: status,
          class: classes.disconnectedStatus,
          progress: 0,
          color: '#ef4444',
        };
    }
  };
  
  const statusData = getStatusData();
  
  return (
    <Box className={classes.statusSection}>
      <Box className={`${classes.statusBadge} ${statusData.class}`}>
        {statusData.icon}
        <Typography variant="body2">
          {statusData.text}
        </Typography>
      </Box>
      <Box className={classes.progressBar}>
        <Box 
          className={classes.progressFill}
          style={{ 
            width: `${statusData.progress}%`,
            backgroundColor: statusData.color,
          }}
        />
      </Box>
    </Box>
  );
};

const Connections = () => {
  const classes = useStyles();

  const { user } = useContext(AuthContext);
  const { whatsApps, loading } = useContext(WhatsAppsContext);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedWhatsApp, setSelectedWhatsApp] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const confirmationModalInitialState = {
    action: "",
    title: "",
    message: "",
    whatsAppId: "",
    open: false,
  };
  const [confirmModalInfo, setConfirmModalInfo] = useState(
    confirmationModalInitialState
  );

  const handleStartWhatsAppSession = async whatsAppId => {
    try {
      await api.post(`/whatsappsession/${whatsAppId}`);
      toast.info(i18n.t("connections.toasts.connecting"));
    } catch (err) {
      toastError(err);
    }
  };

  const handleRequestNewQrCode = async whatsAppId => {
    try {
      await api.put(`/whatsappsession/${whatsAppId}`);
      toast.info(i18n.t("connections.toasts.requestingQr"));
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenWhatsAppModal = () => {
    setSelectedWhatsApp(null);
    setWhatsAppModalOpen(true);
  };

  const handleCloseWhatsAppModal = useCallback(() => {
    setWhatsAppModalOpen(false);
    setSelectedWhatsApp(null);
  }, [setSelectedWhatsApp, setWhatsAppModalOpen]);

  const handleOpenQrModal = whatsApp => {
    setSelectedWhatsApp(whatsApp);
    setQrModalOpen(true);
  };

  const handleCloseQrModal = useCallback(() => {
    setSelectedWhatsApp(null);
    setQrModalOpen(false);
  }, [setQrModalOpen, setSelectedWhatsApp]);

  const handleEditWhatsApp = whatsApp => {
    setSelectedWhatsApp(whatsApp);
    setWhatsAppModalOpen(true);
  };

  const handleOpenConfirmationModal = (action, whatsAppId) => {
    if (action === "disconnect") {
      setConfirmModalInfo({
        action: action,
        title: i18n.t("connections.confirmationModal.disconnectTitle"),
        message: i18n.t("connections.confirmationModal.disconnectMessage"),
        whatsAppId: whatsAppId,
      });
    }

    if (action === "delete") {
      setConfirmModalInfo({
        action: action,
        title: i18n.t("connections.confirmationModal.deleteTitle"),
        message: i18n.t("connections.confirmationModal.deleteMessage"),
        whatsAppId: whatsAppId,
      });
    }
    setConfirmModalOpen(true);
  };

  const handleSubmitConfirmationModal = async () => {
    if (confirmModalInfo.action === "disconnect") {
      try {
        await api.delete(`/whatsappsession/${confirmModalInfo.whatsAppId}`);
        toast.success(i18n.t("connections.toasts.disconnected"));
      } catch (err) {
        toastError(err);
      }
    }

    if (confirmModalInfo.action === "delete") {
      try {
        await api.delete(`/whatsapp/${confirmModalInfo.whatsAppId}`);
        toast.success(i18n.t("connections.toasts.deleted"));
      } catch (err) {
        toastError(err);
      }
    }

    setConfirmModalInfo(confirmationModalInitialState);
  };

  const renderCardActions = whatsApp => {
    return (
      <>
        {whatsApp.status === "qrcode" && (
          <Button
            variant="contained"
            className={`${classes.actionButton} ${classes.primaryButton}`}
            startIcon={<CropFree />}
            onClick={() => handleOpenQrModal(whatsApp)}
          >
            {i18n.t("connections.buttons.qrcode")}
          </Button>
        )}
        {whatsApp.status === "DISCONNECTED" && (
          <>
            <Button
              variant="contained"
              className={`${classes.actionButton} ${classes.secondaryButton}`}
              startIcon={<Refresh />}
              onClick={() => handleStartWhatsAppSession(whatsApp.id)}
            >
              {i18n.t("connections.buttons.tryAgain")}
            </Button>
            <Button
              variant="contained"
              className={`${classes.actionButton} ${classes.primaryButton}`}
              startIcon={<CropFree />}
              onClick={() => handleRequestNewQrCode(whatsApp.id)}
            >
              {i18n.t("connections.buttons.newQr")}
            </Button>
          </>
        )}
        {(whatsApp.status === "CONNECTED" ||
          whatsApp.status === "PAIRING" ||
          whatsApp.status === "TIMEOUT") && (
          <Button
            variant="contained"
            className={`${classes.actionButton} ${classes.dangerButton}`}
            startIcon={<WifiOff />}
            onClick={() => {
              handleOpenConfirmationModal("disconnect", whatsApp.id);
            }}
          >
            {i18n.t("connections.buttons.disconnect")}
          </Button>
        )}
        {whatsApp.status === "OPENING" && (
          <Button 
            variant="contained" 
            disabled 
            className={`${classes.actionButton} ${classes.secondaryButton}`}
            startIcon={<CircularProgress size={16} />}
          >
            {i18n.t("connections.buttons.connecting")}
          </Button>
        )}
      </>
    );
  };

  const restartWhatsapps = async () => {
    try {
      await api.post(`/whatsapp-restart/`);
      toast.warn(i18n.t("Aguarde... reiniciando..."));
    } catch (err) {
      toastError(err);
    }
  }

  const getConnectionStats = () => {
    const total = whatsApps?.length || 0;
    const connected = whatsApps?.filter(w => w.status === "CONNECTED").length || 0;
    const disconnected = whatsApps?.filter(w => w.status === "DISCONNECTED").length || 0;
    const pending = total - connected - disconnected;
    
    return { total, connected, disconnected, pending };
  };

  const { total, connected, disconnected, pending } = getConnectionStats();

  const getCardClass = (status) => {
    switch (status) {
      case "CONNECTED":
        return classes.connectedCard;
      case "DISCONNECTED":
        return classes.disconnectedCard;
      case "qrcode":
        return classes.qrcodeCard;
      default:
        return "";
    }
  };

  return (
    <MainContainer className={classes.root}>
      <ConfirmationModal
        title={confirmModalInfo.title}
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={handleSubmitConfirmationModal}
      >
        {confirmModalInfo.message}
      </ConfirmationModal>
      <QrcodeModal
        open={qrModalOpen}
        onClose={handleCloseQrModal}
        whatsAppId={!whatsAppModalOpen && selectedWhatsApp?.id}
      />
      <WhatsAppModal
        open={whatsAppModalOpen}
        onClose={handleCloseWhatsAppModal}
        whatsAppId={!qrModalOpen && selectedWhatsApp?.id}
      />
      
      <MainHeader>
        <Box>
          <Typography className={classes.pageTitle}>
            <Box className={classes.titleIcon}>
              <PhoneAndroid />
            </Box>
            {i18n.t("connections.title")}
          </Typography>
          <Typography className={classes.subtitle}>
            Gerencie suas conexões WhatsApp
          </Typography>
        </Box>
        <MainHeaderButtonsWrapper>
          <Can
            role={user.profile}
            perform="connections-page:addConnection"
            yes={() => (
              <>
                <Button
                  variant="contained"
                  className={`${classes.headerButton} ${classes.addButton}`}
                  startIcon={<AddCircleOutline />}
                  onClick={handleOpenWhatsAppModal}
                >
                  {i18n.t("connections.buttons.add")}
                </Button>
                <Button
                  variant="contained"
                  className={`${classes.headerButton} ${classes.restartButton}`}
                  startIcon={<Sync />}
                  onClick={restartWhatsapps}
                >
                  {i18n.t("connections.buttons.restart")}
                </Button>
              </>
            )}
          />
        </MainHeaderButtonsWrapper>
      </MainHeader>
      
      <Box className={classes.statsCard}>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber}>{total}</Typography>
          <Typography className={classes.statLabel}>Total de Conexões</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#22c55e' }}>
            {connected}
          </Typography>
          <Typography className={classes.statLabel}>Conectadas</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#ef4444' }}>
            {disconnected}
          </Typography>
          <Typography className={classes.statLabel}>Desconectadas</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#f97316' }}>
            {pending}
          </Typography>
          <Typography className={classes.statLabel}>Pendentes</Typography>
        </Box>
      </Box>
      
      {loading ? (
        <Box className={classes.loadingContainer}>
          <CircularProgress size={48} style={{ color: '#22c55e' }} />
          <Typography variant="h6" style={{ color: '#64748b' }}>
            Carregando conexões...
          </Typography>
        </Box>
      ) : (
        <>
          {whatsApps?.length > 0 ? (
            <Grid container spacing={3} className={classes.gridContainer}>
              {whatsApps.map((whatsApp, index) => (
                <Grow in key={whatsApp.id} timeout={600 + index * 100}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card className={`${classes.connectionCard} ${getCardClass(whatsApp.status)}`}>
                      <Box className={classes.cardHeader}>
                        <Box display="flex" alignItems="center" minWidth={0}>
                          <Badge
                            overlap="circle"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            badgeContent={
                              <Box
                                style={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: '50%',
                                  backgroundColor: whatsApp.status === "CONNECTED" ? '#22c55e' : '#ef4444',
                                  border: '2px solid white',
                                }}
                              />
                            }
                          >
                            <Avatar className={classes.avatar}>
                              {whatsApp.name.charAt(0).toUpperCase()}
                            </Avatar>
                          </Badge>
                          <Box className={classes.connectionInfo}>
                            <Tooltip title={whatsApp.name} arrow>
                              <Typography className={classes.connectionName}>
                                {whatsApp.name}
                              </Typography>
                            </Tooltip>
                            <Typography className={classes.connectionId}>
                              ID: {whatsApp.id}
                            </Typography>
                          </Box>
                        </Box>
                        {whatsApp.isDefault && (
                          <Chip
                            label="Padrão"
                            size="small"
                            icon={<CheckCircleOutline />}
                            className={classes.defaultBadge}
                          />
                        )}
                      </Box>
                      
                      <CardContent className={classes.cardContent}>
                        <StatusIndicator status={whatsApp.status} />
                        
                        <Box className={classes.infoItem}>
                          <Phone />
                          <Typography variant="body2" noWrap>
                            {whatsApp.number ? (
                              <Tooltip title={whatsApp.number} arrow>
                                <span>{formatSerializedId(whatsApp.number)}</span>
                              </Tooltip>
                            ) : (
                              "Número não definido"
                            )}
                          </Typography>
                        </Box>
                        
                        <Box className={classes.infoItem}>
                          <AccessTime />
                          <Typography variant="body2">
                            {format(parseISO(whatsApp.updatedAt), "dd/MM/yyyy HH:mm")}
                          </Typography>
                        </Box>
                      </CardContent>
                      
                      <CardActions className={classes.cardActions}>
                        <Box width="100%">
                          {renderCardActions(whatsApp)}
                          
                          <Can
                            role={user.profile}
                            perform="connections-page:editOrDeleteConnection"
                            yes={() => (
                              <Box className={classes.iconButtons}>
                                <Button
                                  size="small"
                                  startIcon={<Edit />}
                                  onClick={() => handleEditWhatsApp(whatsApp)}
                                  className={classes.editButton}
                                >
                                  Editar
                                </Button>
                                <Button
                                  size="small"
                                  startIcon={<DeleteOutline />}
                                  onClick={() => handleOpenConfirmationModal("delete", whatsApp.id)}
                                  className={classes.deleteButton}
                                >
                                  Excluir
                                </Button>
                              </Box>
                            )}
                          />
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          ) : (
            <Fade in timeout={600}>
              <Box className={classes.emptyState}>
                <PhoneAndroid />
                <Typography variant="h5" className={classes.emptyTitle}>
                  Nenhuma conexão encontrada
                </Typography>
                <Typography variant="body1" className={classes.emptySubtitle}>
                  Clique no botão "Adicionar Conexão" para configurar seu WhatsApp
                </Typography>
              </Box>
            </Fade>
          )}
        </>
      )}
    </MainContainer>
  );
};

export default Connections;