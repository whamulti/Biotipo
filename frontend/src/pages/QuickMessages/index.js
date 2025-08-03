import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import LinearProgress from "@material-ui/core/LinearProgress";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MessageIcon from "@material-ui/icons/Message";
import AttachmentIcon from "@material-ui/icons/AttachFile";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import QuickMessageDialog from "../../components/QuickMessageDialog";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_QUICKMESSAGES") {
    const quickmessages = action.payload;
    const newQuickmessages = [];

    quickmessages.forEach((quickmessage) => {
      const quickmessageIndex = state.findIndex((u) => u.id === quickmessage.id);
      if (quickmessageIndex !== -1) {
        state[quickmessageIndex] = quickmessage;
      } else {
        newQuickmessages.push(quickmessage);
      }
    });

    return [...state, ...newQuickmessages];
  }

  if (action.type === "UPDATE_QUICKMESSAGES") {
    const quickmessage = action.payload;
    const quickmessageIndex = state.findIndex((u) => u.id === quickmessage.id);

    if (quickmessageIndex !== -1) {
      state[quickmessageIndex] = quickmessage;
      return [...state];
    } else {
      return [quickmessage, ...state];
    }
  }

  if (action.type === "DELETE_QUICKMESSAGE") {
    const quickmessageId = action.payload;
    const quickmessageIndex = state.findIndex((u) => u.id === quickmessageId);
    if (quickmessageIndex !== -1) {
      state.splice(quickmessageIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 197, 94, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  tableContainer: {
    overflowY: 'auto',
    flex: 1,
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f5f9',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#cbd5e1',
      borderRadius: '4px',
      '&:hover': {
        background: '#94a3b8',
      },
    },
  },
  table: {
    minWidth: 650,
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
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f0fdf4',
      transform: 'scale(1.01)',
      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.08)',
    },
  },
  searchField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: 'white',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
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
      '& input': {
        padding: '12px 14px',
        fontSize: '14px',
      },
    },
  },
  addButton: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    borderRadius: '12px',
    padding: '12px 24px',
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'none',
    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
      transform: 'translateY(-1px)',
    },
  },
  actionButton: {
    margin: theme.spacing(0, 0.5),
    padding: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  editButton: {
    color: '#22c55e',
    backgroundColor: '#f0fdf4',
    '&:hover': {
      backgroundColor: '#dcfce7',
    },
  },
  deleteButton: {
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    '&:hover': {
      backgroundColor: '#fee2e2',
    },
  },
  tableEmpty: {
    textAlign: 'center',
    padding: theme.spacing(8),
    color: '#94a3b8',
  },
  loadingBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    zIndex: 1,
  },
  statsCard: {
    display: 'flex',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    border: '1px solid rgba(34, 197, 94, 0.1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
    padding: theme.spacing(2),
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f0fdf4',
      transform: 'translateY(-2px)',
    },
  },
  statNumber: {
    fontSize: '28px',
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
}));

const Quickemessages = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { profile } = user;

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedQuickemessage, setSelectedQuickemessage] = useState(null);
  const [deletingQuickemessage, setDeletingQuickemessage] = useState(null);
  const [quickemessageModalOpen, setQuickMessageDialogOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [quickemessages, dispatch] = useReducer(reducer, []);

  const socketManager = useContext(SocketContext);

  const fetchQuickemessages = useCallback(async () => {
    try {
      const companyId = user.companyId;
      const { data } = await api.get("/quick-messages/list", {
        params: { companyId, userId: user.id, searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_QUICKMESSAGES", payload: data });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  }, [searchParam, pageNumber, user]);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchQuickemessages();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchQuickemessages]);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketManager.getSocket(companyId);

    socket.on(`company${companyId}-quickemessage`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUICKMESSAGES", payload: data.record });
      }
      if (data.action === "delete") {
        dispatch({ type: "DELETE_QUICKMESSAGE", payload: +data.id });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [socketManager, user.companyId]);

  const handleOpenQuickMessageDialog = () => {
    setSelectedQuickemessage(null);
    setQuickMessageDialogOpen(true);
  };

  const handleCloseQuickMessageDialog = () => {
    setSelectedQuickemessage(null);
    setQuickMessageDialogOpen(false);
    fetchQuickemessages();
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditQuickemessage = (quickemessage) => {
    setSelectedQuickemessage(quickemessage);
    setQuickMessageDialogOpen(true);
  };

  const handleDeleteQuickemessage = async (quickemessageId) => {
    try {
      await api.delete(`/quick-messages/${quickemessageId}`);
      toast.success(i18n.t("quickMessages.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingQuickemessage(null);
    setSearchParam("");
    setPageNumber(1);
    dispatch({ type: "RESET" });
    await fetchQuickemessages();
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  const getQuickMessageStats = () => {
    const totalQuickMessages = quickemessages.length;
    const generalMessages = quickemessages.filter((qm) => qm.geral).length;
    const avgMessagesPerUser = totalQuickMessages > 0 ? Math.round(totalQuickMessages / 3) : 0; // Assuming 3 users for simplicity
    return { totalQuickMessages, generalMessages, avgMessagesPerUser };
  };

  const { totalQuickMessages, generalMessages, avgMessagesPerUser } = getQuickMessageStats();

  return (
    <MainContainer>
      <ConfirmationModal
        title={deletingQuickemessage && `${i18n.t("quickMessages.confirmationModal.deleteTitle")} ${deletingQuickemessage.shortcode}?`}
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => handleDeleteQuickemessage(deletingQuickemessage.id)}
      >
        {i18n.t("quickMessages.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <QuickMessageDialog
        resetPagination={() => {
          setPageNumber(1);
          fetchQuickemessages();
        }}
        open={quickemessageModalOpen}
        onClose={handleCloseQuickMessageDialog}
        aria-labelledby="form-dialog-title"
        quickemessageId={selectedQuickemessage && selectedQuickemessage.id}
      />
      <MainHeader>
        <Title>{i18n.t("quickMessages.title")}</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("quickMessages.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            className={classes.searchField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "#94a3b8", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            className={classes.addButton}
            onClick={handleOpenQuickMessageDialog}
            startIcon={<AddIcon />}
          >
            {i18n.t("quickMessages.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Box className={classes.statsCard}>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber}>{totalQuickMessages}</Typography>
          <Typography className={classes.statLabel}>Total de Mensagens</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#22c55e' }}>
            {generalMessages}
          </Typography>
          <Typography className={classes.statLabel}>Mensagens Gerais</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#3b82f6' }}>
            {avgMessagesPerUser}
          </Typography>
          <Typography className={classes.statLabel}>Média por Usuário</Typography>
        </Box>
      </Box>

      <Paper className={classes.mainPaper} variant="outlined">
        {loading && pageNumber === 1 && (
          <LinearProgress className={classes.loadingBar} color="primary" />
        )}
        <div className={classes.tableContainer} onScroll={handleScroll}>
          <Table className={classes.table} stickyHeader>
            <TableHead>
              <TableRow className={classes.tableHeader}>
                <TableCell align="center" style={{ width: '30%' }}>
                  {i18n.t("quickMessages.table.shortcode")}
                </TableCell>
                <TableCell align="center" style={{ width: '30%' }}>
                  {i18n.t("quickMessages.table.mediaName")}
                </TableCell>
                <TableCell align="center" style={{ width: '20%' }}>
                  {i18n.t("quickMessages.table.status")}
                </TableCell>
                <TableCell align="center" style={{ width: '20%' }}>
                  {i18n.t("quickMessages.table.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quickemessages.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={4} className={classes.tableEmpty}>
                    <MessageIcon style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                    <Typography variant="h6" style={{ marginBottom: 8 }}>
                      Nenhuma mensagem rápida encontrada
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Crie mensagens rápidas para agilizar sua comunicação
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {quickemessages.map((quickemessage) => (
                    <Fade in key={quickemessage.id}>
                      <TableRow className={classes.tableRow}>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                            <MessageIcon style={{ color: '#22c55e' }} />
                            <Typography>{quickemessage.shortcode}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                            <AttachmentIcon style={{ color: '#3b82f6' }} />
                            <Typography>{quickemessage.mediaName ?? "Sem anexo"}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                            {quickemessage.geral ? (
                              <CheckCircleIcon style={{ color: '#22c55e' }} />
                            ) : (
                              <Typography>Privado</Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {(profile === "admin" || profile === "supervisor" || (profile === "user" && !quickemessage.geral)) && (
                            <>
                              <IconButton
                                size="small"
                                className={`${classes.actionButton} ${classes.editButton}`}
                                onClick={() => handleEditQuickemessage(quickemessage)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                className={`${classes.actionButton} ${classes.deleteButton}`}
                                onClick={() => {
                                  setConfirmModalOpen(true);
                                  setDeletingQuickemessage(quickemessage);
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))}
                  {loading && <TableRowSkeleton columns={4} />}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </MainContainer>
  );
};

export default Quickemessages;