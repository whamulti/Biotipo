import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

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
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import LinearProgress from "@material-ui/core/LinearProgress";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import PeopleIcon from "@material-ui/icons/People";
import DownloadIcon from "@material-ui/icons/GetApp";
import AddIcon from "@material-ui/icons/Add";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ContactListDialog from "../../components/ContactListDialog";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";

import planilhaExemplo from "../../assets/planilha.xlsx";

const reducer = (state, action) => {
  if (action.type === "LOAD_CONTACTLISTS") {
    const contactLists = action.payload;
    const newContactLists = [];

    contactLists.forEach((contactList) => {
      const contactListIndex = state.findIndex((u) => u.id === contactList.id);
      if (contactListIndex !== -1) {
        state[contactListIndex] = contactList;
      } else {
        newContactLists.push(contactList);
      }
    });

    return [...state, ...newContactLists];
  }

  if (action.type === "UPDATE_CONTACTLIST") {
    const contactList = action.payload;
    const contactListIndex = state.findIndex((u) => u.id === contactList.id);

    if (contactListIndex !== -1) {
      state[contactListIndex] = contactList;
      return [...state];
    } else {
      return [contactList, ...state];
    }
  }

  if (action.type === "DELETE_CONTACTLIST") {
    const contactListId = action.payload;

    const contactListIndex = state.findIndex((u) => u.id === contactListId);
    if (contactListIndex !== -1) {
      state.splice(contactListIndex, 1);
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
  downloadButton: {
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    '&:hover': {
      backgroundColor: '#dbeafe',
    },
  },
  contactsButton: {
    color: '#8b5cf6',
    backgroundColor: '#f5f3ff',
    '&:hover': {
      backgroundColor: '#ede9fe',
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

const ContactLists = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedContactList, setSelectedContactList] = useState(null);
  const [deletingContactList, setDeletingContactList] = useState(null);
  const [contactListModalOpen, setContactListModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [contactLists, dispatch] = useReducer(reducer, []);

  const socketManager = useContext(SocketContext);

  const fetchContactLists = useCallback(async () => {
    try {
      const { data } = await api.get("/contact-lists/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_CONTACTLISTS", payload: data.records });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  }, [searchParam, pageNumber]);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchContactLists();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber, fetchContactLists]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-ContactList`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_CONTACTLIST", payload: data.record });
      }
      if (data.action === "delete") {
        dispatch({ type: "DELETE_CONTACTLIST", payload: +data.id });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const handleOpenContactListModal = () => {
    setSelectedContactList(null);
    setContactListModalOpen(true);
  };

  const handleCloseContactListModal = () => {
    setSelectedContactList(null);
    setContactListModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditContactList = (contactList) => {
    setSelectedContactList(contactList);
    setContactListModalOpen(true);
  };

  const handleDeleteContactList = async (contactListId) => {
    try {
      await api.delete(`/contact-lists/${contactListId}`);
      toast.success(i18n.t("contactLists.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingContactList(null);
    setSearchParam("");
    setPageNumber(1);
    fetchContactLists();
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

  const goToContacts = (id) => {
    history.push(`/contact-lists/${id}/contacts`);
  };

  const getContactListStats = () => {
    const totalLists = contactLists.length;
    const totalContacts = contactLists.reduce((sum, list) => sum + (list.contactsCount || 0), 0);
    const avgContactsPerList = totalLists > 0 ? Math.round(totalContacts / totalLists) : 0;
    return { totalLists, totalContacts, avgContactsPerList };
  };

  const { totalLists, totalContacts, avgContactsPerList } = getContactListStats();

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingContactList &&
          `${i18n.t("contactLists.confirmationModal.deleteTitle")} ${deletingContactList.name}?`
        }
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => handleDeleteContactList(deletingContactList.id)}
      >
        {i18n.t("contactLists.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <ContactListDialog
        open={contactListModalOpen}
        onClose={handleCloseContactListModal}
        aria-labelledby="form-dialog-title"
        contactListId={selectedContactList && selectedContactList.id}
      />
      <MainHeader>
        <Title>{i18n.t("contactLists.title")}</Title>
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
            onClick={handleOpenContactListModal}
            startIcon={<AddIcon />}
          >
            {i18n.t("contactLists.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Box className={classes.statsCard}>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber}>{totalLists}</Typography>
          <Typography className={classes.statLabel}>Total de Listas</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#22c55e' }}>
            {totalContacts}
          </Typography>
          <Typography className={classes.statLabel}>Total de Contatos</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#3b82f6' }}>
            {avgContactsPerList}
          </Typography>
          <Typography className={classes.statLabel}>Média por Lista</Typography>
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
                <TableCell align="center" style={{ width: '40%' }}>
                  {i18n.t("contactLists.table.name")}
                </TableCell>
                <TableCell align="center" style={{ width: '20%' }}>
                  {i18n.t("contactLists.table.contacts")}
                </TableCell>
                <TableCell align="center" style={{ width: '40%' }}>
                  {i18n.t("contactLists.table.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contactLists.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={3} className={classes.tableEmpty}>
                    <PeopleIcon style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                    <Typography variant="h6" style={{ marginBottom: 8 }}>
                      Nenhuma lista de contatos encontrada
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Crie listas para organizar seus contatos
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {contactLists.map((contactList) => (
                    <Fade in key={contactList.id}>
                      <TableRow className={classes.tableRow}>
                        <TableCell align="center">{contactList.name}</TableCell>
                        <TableCell align="center">{contactList.contactsCount || 0}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Baixar planilha exemplo">
                            <a href={planilhaExemplo} download="planilha.xlsx">
                              <IconButton
                                size="small"
                                className={`${classes.actionButton} ${classes.downloadButton}`}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </a>
                          </Tooltip>
                          <Tooltip title="Ver contatos">
                            <IconButton
                              size="small"
                              className={`${classes.actionButton} ${classes.contactsButton}`}
                              onClick={() => goToContacts(contactList.id)}
                            >
                              <PeopleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar lista">
                            <IconButton
                              size="small"
                              className={`${classes.actionButton} ${classes.editButton}`}
                              onClick={() => handleEditContactList(contactList)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir lista">
                            <IconButton
                              size="small"
                              className={`${classes.actionButton} ${classes.deleteButton}`}
                              onClick={() => {
                                setConfirmModalOpen(true);
                                setDeletingContactList(contactList);
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))}
                  {loading && <TableRowSkeleton columns={3} />}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </MainContainer>
  );
};

export default ContactLists;