import React, { useState, useEffect, useReducer } from "react";
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
import {
  Box,
  Typography,
  Chip,
  Fade,
  LinearProgress,
  Tooltip,
} from "@material-ui/core";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import PaymentIcon from "@material-ui/icons/Payment";
import ReceiptIcon from "@material-ui/icons/Receipt";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import DescriptionIcon from "@material-ui/icons/Description";
import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import SubscriptionModal from "../../components/SubscriptionModal";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import UserModal from "../../components/UserModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";

import moment from "moment";

const reducer = (state, action) => {
  if (action.type === "LOAD_INVOICES") {
    const invoices = action.payload;
    const newUsers = [];

    invoices.forEach((user) => {
      const userIndex = state.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        state[userIndex] = user;
      } else {
        newUsers.push(user);
      }
    });

    return [...state, ...newUsers];
  }

  if (action.type === "UPDATE_USERS") {
    const user = action.payload;
    const userIndex = state.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      state[userIndex] = user;
      return [...state];
    } else {
      return [user, ...state];
    }
  }

  if (action.type === "DELETE_USER") {
    const userId = action.payload;

    const userIndex = state.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      state.splice(userIndex, 1);
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
      backgroundColor: '#f8fafc',
      transform: 'scale(1.01)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    },
  },
  paidRow: {
    backgroundColor: '#f0fdf4',
    '&:hover': {
      backgroundColor: '#dcfce7',
    },
  },
  overdueRow: {
    backgroundColor: '#fef2f2',
    '&:hover': {
      backgroundColor: '#fee2e2',
    },
  },
  pendingRow: {
    backgroundColor: '#fff7ed',
    '&:hover': {
      backgroundColor: '#fed7aa',
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
  headerButton: {
    borderRadius: '12px',
    padding: '12px 24px',
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'none',
    transition: 'all 0.3s ease',
  },
  exportButton: {
    backgroundColor: 'white',
    color: '#0ea5e9',
    border: '2px solid #bae6fd',
    '&:hover': {
      backgroundColor: '#f0f9ff',
      borderColor: '#7dd3fc',
    },
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
  statValue: {
    fontSize: '14px',
    fontWeight: 600,
    marginTop: '4px',
  },
  invoiceId: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#94a3b8',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    padding: '4px 8px',
    display: 'inline-block',
  },
  invoiceDetail: {
    fontWeight: 500,
    fontSize: '14px',
    color: '#334155',
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  invoiceValue: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#0f172a',
  },
  invoiceDate: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: '14px',
    color: '#64748b',
    '& svg': {
      fontSize: '18px',
    },
  },
  statusChip: {
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '12px',
    height: '32px',
    minWidth: '100px',
  },
  statusPaid: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    '& .MuiChip-icon': {
      color: '#22c55e',
    },
  },
  statusOverdue: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    '& .MuiChip-icon': {
      color: '#ef4444',
    },
  },
  statusPending: {
    backgroundColor: '#fff7ed',
    color: '#ea580c',
    border: '1px solid #fed7aa',
    '& .MuiChip-icon': {
      color: '#f97316',
    },
  },
  actionButton: {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
    padding: '8px 16px',
    transition: 'all 0.3s ease',
  },
  payButton: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
      transform: 'translateY(-1px)',
    },
  },
  paidButton: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    cursor: 'default',
    '&:hover': {
      backgroundColor: '#f0fdf4',
    },
  },
  loadingBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    zIndex: 1,
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(8),
    color: '#94a3b8',
    '& svg': {
      fontSize: 48,
      marginBottom: theme.spacing(2),
      opacity: 0.3,
    },
  },
  iconButton: {
    padding: 8,
    marginLeft: theme.spacing(1),
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  printButton: {
    color: '#6366f1',
    backgroundColor: '#eef2ff',
    '&:hover': {
      backgroundColor: '#e0e7ff',
    },
  },
  downloadButton: {
    color: '#0ea5e9',
    backgroundColor: '#f0f9ff',
    '&:hover': {
      backgroundColor: '#e0f2fe',
    },
  },
}));

const Invoices = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [invoices, dispatch] = useReducer(reducer, []);
  const [storagePlans, setStoragePlans] = React.useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleOpenContactModal = (invoices) => {
    setStoragePlans(invoices);
    setSelectedContactId(null);
    setContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(false);
  };

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchInvoices = async () => {
        try {
          const { data } = await api.get("/invoices/all", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_INVOICES", payload: data });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchInvoices();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

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

  const getRowClass = (invoice) => {
    const status = getInvoiceStatus(invoice);
    switch (status) {
      case "paid":
        return classes.paidRow;
      case "overdue":
        return classes.overdueRow;
      case "pending":
        return classes.pendingRow;
      default:
        return "";
    }
  };

  const getInvoiceStatus = (invoice) => {
    if (invoice.status === "paid") {
      return "paid";
    }
    const hoje = moment();
    const vencimento = moment(invoice.dueDate);
    const diff = vencimento.diff(hoje, 'days');
    
    if (diff < 0) {
      return "overdue";
    }
    return "pending";
  };

  const getStatusDisplay = (invoice) => {
    const status = getInvoiceStatus(invoice);
    switch (status) {
      case "paid":
        return {
          label: "Pago",
          icon: <CheckCircleIcon />,
          class: classes.statusPaid,
        };
      case "overdue":
        return {
          label: "Vencido",
          icon: <ErrorIcon />,
          class: classes.statusOverdue,
        };
      case "pending":
        return {
          label: "Em Aberto",
          icon: <AccessTimeIcon />,
          class: classes.statusPending,
        };
      default:
        return {
          label: "Desconhecido",
          icon: <WarningIcon />,
          class: "",
        };
    }
  };

  const getInvoiceStats = () => {
    const total = invoices.length;
    const paid = invoices.filter(inv => inv.status === "paid").length;
    const overdue = invoices.filter(inv => {
      if (inv.status === "paid") return false;
      const diff = moment(inv.dueDate).diff(moment(), 'days');
      return diff < 0;
    }).length;
    const pending = total - paid - overdue;
    
    const totalValue = invoices.reduce((acc, inv) => acc + inv.value, 0);
    const paidValue = invoices.filter(inv => inv.status === "paid")
      .reduce((acc, inv) => acc + inv.value, 0);
    const pendingValue = totalValue - paidValue;
    
    return { total, paid, overdue, pending, totalValue, paidValue, pendingValue };
  };

  const stats = getInvoiceStats();

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  return (
    <MainContainer className={classes.mainContainer}>
      <SubscriptionModal
        open={contactModalOpen}
        onClose={handleCloseContactModal}
        aria-labelledby="form-dialog-title"
        Invoice={storagePlans}
        contactId={selectedContactId}
      />
      
      <MainHeader>
        <Title>Faturas</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder="Buscar fatura..."
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
            className={`${classes.headerButton} ${classes.exportButton}`}
            startIcon={<GetAppIcon />}
          >
            Exportar
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Box className={classes.statsCard}>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber}>{stats.total}</Typography>
          <Typography className={classes.statLabel}>Total de Faturas</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#22c55e' }}>
            {stats.paid}
          </Typography>
          <Typography className={classes.statLabel}>Faturas Pagas</Typography>
          <Typography className={classes.statValue} style={{ color: '#16a34a' }}>
            {stats.paidValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
          </Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#f97316' }}>
            {stats.pending}
          </Typography>
          <Typography className={classes.statLabel}>Em Aberto</Typography>
          <Typography className={classes.statValue} style={{ color: '#ea580c' }}>
            {stats.pendingValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
          </Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#ef4444' }}>
            {stats.overdue}
          </Typography>
          <Typography className={classes.statLabel}>Vencidas</Typography>
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
                <TableCell style={{ width: '100px' }}>ID</TableCell>
                <TableCell>Detalhes</TableCell>
                <TableCell style={{ width: '150px' }}>Valor</TableCell>
                <TableCell style={{ width: '150px' }}>Vencimento</TableCell>
                <TableCell align="center" style={{ width: '140px' }}>Status</TableCell>
                <TableCell align="center" style={{ width: '200px' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} className={classes.emptyState}>
                    <ReceiptIcon />
                    <Typography variant="h6" style={{ marginBottom: 8 }}>
                      Nenhuma fatura encontrada
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Suas faturas aparecerão aqui
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {invoices.map((invoice, index) => {
                    const statusDisplay = getStatusDisplay(invoice);
                    return (
                      <Fade in key={invoice.id} timeout={300 + index * 50}>
                        <TableRow className={`${classes.tableRow} ${getRowClass(invoice)}`}>
                          <TableCell>
                            <span className={classes.invoiceId}>#{invoice.id}</span>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={invoice.detail} arrow>
                              <Typography className={classes.invoiceDetail}>
                                {invoice.detail}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography className={classes.invoiceValue}>
                              {invoice.value.toLocaleString('pt-br', { 
                                style: 'currency', 
                                currency: 'BRL' 
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box className={classes.invoiceDate}>
                              <CalendarTodayIcon />
                              {moment(invoice.dueDate).format("DD/MM/YYYY")}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              size="medium"
                              label={statusDisplay.label}
                              icon={statusDisplay.icon}
                              className={`${classes.statusChip} ${statusDisplay.class}`}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" justifyContent="center" alignItems="center">
                              {invoice.status !== "paid" ? (
                                <Button
                                  variant="contained"
                                  className={`${classes.actionButton} ${classes.payButton}`}
                                  onClick={() => handleOpenContactModal(invoice)}
                                  startIcon={<PaymentIcon />}
                                >
                                  Pagar
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  className={`${classes.actionButton} ${classes.paidButton}`}
                                  startIcon={<CheckCircleIcon />}
                                  disabled
                                >
                                  Pago
                                </Button>
                              )}
                              <Tooltip title="Imprimir">
                                <IconButton
                                  className={`${classes.iconButton} ${classes.printButton}`}
                                  size="small"
                                >
                                  <PrintIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Baixar">
                                <IconButton
                                  className={`${classes.iconButton} ${classes.downloadButton}`}
                                  size="small"
                                >
                                  <GetAppIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    );
                  })}
                  {loading && <TableRowSkeleton columns={6} />}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </MainContainer>
  );
};

export default Invoices;