import React, { useState, useEffect, useReducer, useContext } from "react";
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
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import LinearProgress from "@material-ui/core/LinearProgress";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import BlockIcon from "@material-ui/icons/Block";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import UserStatusIcon from "../../components/UserModal/statusIcon";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import UserModal from "../../components/UserModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_USERS") {
    const users = action.payload;
    const newUsers = [];

    users.forEach((user) => {
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
    ...theme.scrollbarStyles,
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
  userAvatar: {
    width: 48,
    height: 48,
    backgroundColor: '#f0fdf4',
    color: '#22c55e',
    fontWeight: 600,
    fontSize: '18px',
    border: '2px solid #dcfce7',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  userName: {
    fontWeight: 600,
    fontSize: '15px',
    color: '#0f172a',
    marginBottom: '2px',
  },
  userEmail: {
    fontSize: '13px',
    color: '#64748b',
  },
  statusChip: {
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '12px',
    height: '28px',
  },
  statusOnline: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
  },
  statusOffline: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
  },
  profileChip: {
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '12px',
    height: '28px',
    backgroundColor: '#f0f9ff',
    color: '#0369a1',
    border: '1px solid #bae6fd',
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
  idCell: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#94a3b8',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    padding: '4px 8px',
    display: 'inline-block',
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

const Users = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [users, dispatch] = useReducer(reducer, []);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_USERS", payload: data.users });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-user`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_USERS", payload: data.user });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_USER", payload: +data.userId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const handleOpenUserModal = () => {
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setUserModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      toast.success(i18n.t("users.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingUser(null);
    setSearchParam("");
    setPageNumber(1);
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

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getProfileIcon = (profile) => {
    return profile?.toLowerCase() === 'admin' ? <SupervisorAccountIcon /> : <AccountCircleIcon />;
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const onlineUsers = users.filter(user => user.online).length;
    const adminUsers = users.filter(user => user.profile?.toLowerCase() === 'admin').length;
    
    return { totalUsers, onlineUsers, adminUsers };
  };

  const { totalUsers, onlineUsers, adminUsers } = getUserStats();

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingUser &&
          `${i18n.t("users.confirmationModal.deleteTitle")} ${
            deletingUser.name
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteUser(deletingUser.id)}
      >
        {i18n.t("users.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <UserModal
        open={userModalOpen}
        onClose={handleCloseUserModal}
        aria-labelledby="form-dialog-title"
        userId={selectedUser && selectedUser.id}
      />
      <MainHeader>
        <Title>{i18n.t("users.title")}</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("contacts.searchPlaceholder")}
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
            onClick={handleOpenUserModal}
            startIcon={<PersonAddIcon />}
          >
            {i18n.t("users.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Box className={classes.statsCard}>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber}>{totalUsers}</Typography>
          <Typography className={classes.statLabel}>Total de Usuários</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#22c55e' }}>
            {onlineUsers}
          </Typography>
          <Typography className={classes.statLabel}>Online Agora</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#3b82f6' }}>
            {adminUsers}
          </Typography>
          <Typography className={classes.statLabel}>Administradores</Typography>
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
                <TableCell style={{ width: '80px' }}>{i18n.t("users.table.id")}</TableCell>
                <TableCell>{i18n.t("users.table.name")}</TableCell>
                <TableCell align="center" style={{ width: '120px' }}>
                  {i18n.t("users.table.status")}
                </TableCell>
                <TableCell align="center" style={{ width: '140px' }}>
                  {i18n.t("users.table.profile")}
                </TableCell>
                <TableCell align="center" style={{ width: '140px' }}>
                  {i18n.t("users.table.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={5} className={classes.tableEmpty}>
                    <AccountCircleIcon style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                    <Typography variant="h6" style={{ marginBottom: 8 }}>
                      Nenhum usuário encontrado
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Adicione novos usuários clicando no botão acima
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {users.map((user) => (
                    <Fade in key={user.id}>
                      <TableRow className={classes.tableRow}>
                        <TableCell>
                          <span className={classes.idCell}>#{user.id}</span>
                        </TableCell>
                        <TableCell>
                          <Box className={classes.userInfo}>
                            <Avatar className={classes.userAvatar}>
                              {getInitials(user.name)}
                            </Avatar>
                            <Box>
                              <Typography className={classes.userName}>
                                {user.name}
                              </Typography>
                              <Typography className={classes.userEmail}>
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={user.online ? "Online" : "Offline"}
                            className={`${classes.statusChip} ${
                              user.online ? classes.statusOnline : classes.statusOffline
                            }`}
                            icon={user.online ? <VerifiedUserIcon /> : <BlockIcon />}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={user.profile}
                            className={classes.profileChip}
                            icon={getProfileIcon(user.profile)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Editar usuário">
                            <IconButton
                              size="small"
                              className={`${classes.actionButton} ${classes.editButton}`}
                              onClick={() => handleEditUser(user)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir usuário">
                            <IconButton
                              size="small"
                              className={`${classes.actionButton} ${classes.deleteButton}`}
                              onClick={(e) => {
                                setConfirmModalOpen(true);
                                setDeletingUser(user);
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))}
                  {loading && <TableRowSkeleton columns={5} />}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </MainContainer>
  );
};

export default Users;