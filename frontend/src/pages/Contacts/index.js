import React, { useState, useEffect, useReducer, useContext, useRef } from "react";

import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { 
  Tooltip,
  Box,
  Typography,
  Chip,
  Fade,
  Grow,
  LinearProgress,
  Badge
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import GetAppIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";

import api from "../../services/api";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ContactModal from "../../components/ContactModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import CancelIcon from "@material-ui/icons/Cancel";
import { i18n } from "../../translate/i18n";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import MainContainer from "../../components/MainContainer";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../../components/Can";
import NewTicketModal from "../../components/NewTicketModal";
import { SocketContext } from "../../context/Socket/SocketContext";
import { generateColor } from "../../helpers/colorGenerator";
import { getInitials } from "../../helpers/getInitials";
import {CSVLink} from "react-csv";

import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import {
    ArrowDropDown,
    Backup,
    CloudDownload,
    ContactPhone,
} from "@material-ui/icons";
import { Menu, MenuItem } from "@material-ui/core";

const reducer = (state, action) => {
  if (action.type === "LOAD_CONTACTS") {
    const contacts = action.payload;
    const newContacts = [];

    contacts.forEach((contact) => {
      const contactIndex = state.findIndex((c) => c.id === contact.id);
      if (contactIndex !== -1) {
        state[contactIndex] = contact;
      } else {
        newContacts.push(contact);
      }
    });

    return [...state, ...newContacts];
  }

  if (action.type === "UPDATE_CONTACTS") {
    const contact = action.payload;
    const contactIndex = state.findIndex((c) => c.id === contact.id);

    if (contactIndex !== -1) {
      state[contactIndex] = contact;
      return [...state];
    } else {
      return [contact, ...state];
    }
  }

  if (action.type === "DELETE_CONTACT") {
    const contactId = action.payload;

    const contactIndex = state.findIndex((c) => c.id === contactId);
    if (contactIndex !== -1) {
      state.splice(contactIndex, 1);
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
  headerButton: {
    borderRadius: '12px',
    padding: '12px 24px',
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'none',
    boxShadow: 'none',
    transition: 'all 0.3s ease',
  },
  addButton: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
      transform: 'translateY(-1px)',
    },
  },
  selectButton: {
    backgroundColor: 'white',
    color: '#22c55e',
    border: '2px solid #22c55e',
    '&:hover': {
      backgroundColor: '#f0fdf4',
      borderColor: '#16a34a',
    },
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: '2px solid #fecaca',
    '&:hover': {
      backgroundColor: '#fee2e2',
      borderColor: '#fca5a5',
    },
  },
  importExportButton: {
    backgroundColor: '#f0f9ff',
    color: '#0ea5e9',
    border: '2px solid #bae6fd',
    '&:hover': {
      backgroundColor: '#e0f2fe',
      borderColor: '#7dd3fc',
    },
  },
  contactAvatar: {
    width: 48,
    height: 48,
    backgroundColor: '#f0fdf4',
    color: '#22c55e',
    fontWeight: 600,
    fontSize: '18px',
    border: '2px solid #dcfce7',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  contactName: {
    fontWeight: 600,
    fontSize: '15px',
    color: '#0f172a',
  },
  contactDetail: {
    fontSize: '13px',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    '& svg': {
      fontSize: '14px',
    },
  },
  statusChip: {
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '12px',
    height: '28px',
  },
  statusActive: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    '& .MuiChip-icon': {
      color: '#16a34a',
    },
  },
  statusInactive: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    '& .MuiChip-icon': {
      color: '#dc2626',
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
  whatsappButton: {
    color: '#25d366',
    backgroundColor: '#f0fdf4',
    '&:hover': {
      backgroundColor: '#dcfce7',
    },
  },
  editButton: {
    color: '#0ea5e9',
    backgroundColor: '#f0f9ff',
    '&:hover': {
      backgroundColor: '#e0f2fe',
    },
  },
  deleteIconButton: {
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    '&:hover': {
      backgroundColor: '#fee2e2',
    },
  },
  lastInteraction: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    fontSize: '13px',
    color: '#94a3b8',
    '& svg': {
      fontSize: '16px',
    },
  },
  checkbox: {
    color: '#cbd5e1',
    '&.Mui-checked': {
      color: '#22c55e',
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
  menuItem: {
    fontSize: '14px',
    fontWeight: 500,
    padding: '12px 20px',
    '& svg': {
      marginRight: theme.spacing(1.5),
    },
    '&:hover': {
      backgroundColor: '#f0fdf4',
      color: '#16a34a',
    },
  },
}));

const Contacts = () => {
  const classes = useStyles();
  const history = useHistory();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam, setSearchParam] = useState("");
  const [contacts, dispatch] = useReducer(reducer, []);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [contactTicket, setContactTicket] = useState({});
  const [deletingContact, setDeletingContact] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const fileUploadRef = useRef(null);

  useEffect(() => {
    if (selectAll) {
        setSelectedContacts(contacts.map((contact) => contact.id));
    } else {
        setSelectedContacts([]);
    }
  }, [contacts, selectAll]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (contactId) => {
    setSelectedContacts((prevSelected) => {
      if (prevSelected.includes(contactId)) {
        return prevSelected.filter((id) => id !== contactId);
      } else {
        return [...prevSelected, contactId];
      }
    });
  };

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          const { data } = await api.get("/contacts/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_CONTACTS", payload: data.contacts });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-contact`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_CONTACTS", payload: data.contact });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_CONTACT", payload: +data.contactId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleOpenContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(false);
  };

  const handleCloseOrOpenTicket = (ticket) => {
    setNewTicketModalOpen(false);
    if (ticket !== undefined && ticket.uuid !== undefined) {
      history.push(`/tickets/${ticket.uuid}`);
    }
  };

  const hadleEditContact = (contactId) => {
    setSelectedContactId(contactId);
    setContactModalOpen(true);
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await api.delete(`/contacts/${contactId}`);
      toast.success(i18n.t("contacts.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingContact(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const handleDeleteSelectedContacts = async () => {
    try {
      for (const contactId of selectedContacts) {
        await api.delete(`/contacts/${contactId}`);
      }
      toast.success(i18n.t("contacts.toasts.deleted"));
      setSelectedContacts([]);
      setSelectAll(false);
      setSearchParam("");
      setPageNumber(1);
    } catch (err) {
      toastError(err);
    }
  };

  const handleimportContact = async () => {
    try {
      if (!!fileUploadRef.current.files[0]) {
        const formData = new FormData();
        formData.append("file", fileUploadRef.current.files[0]);
        await api.request({
          url: `/contacts/upload`,
          method: "POST",
          data: formData,
        });
      } else {
        await api.post("/contacts/import");
      }
      history.go(0);
    } catch (err) {
      toastError(err);
    }
  };
  
  function getDateLastMessage(contact) {
    if (!contact) return null;
    if (!contact.tickets) return null;

    if (contact.tickets.length > 0) {
      const date = new Date(contact.tickets[contact.tickets.length - 1].updatedAt);
      const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
      const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
      const year = date.getFullYear().toString().slice(-2);
      const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
      const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    return null;
  }

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

  const getContactStats = () => {
    const totalContacts = contacts.length;
    const activeContacts = contacts.filter(contact => contact.active).length;
    const inactiveContacts = totalContacts - activeContacts;
    
    return { totalContacts, activeContacts, inactiveContacts };
  };

  const { totalContacts, activeContacts, inactiveContacts } = getContactStats();

  return (
    <MainContainer className={classes.mainContainer}>
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        initialContact={contactTicket}
        onClose={(ticket) => {
          handleCloseOrOpenTicket(ticket);
        }}
      />
      <ContactModal
        open={contactModalOpen}
        onClose={handleCloseContactModal}
        aria-labelledby="form-dialog-title"
        contactId={selectedContactId}
      />
      <ConfirmationModal
        title={
          deletingContact
            ? `${i18n.t("contacts.confirmationModal.deleteTitle")} ${deletingContact.name}?`
            : `${i18n.t("contacts.confirmationModal.importTitlte")}`
        }
        open={confirmOpen}
        onClose={setConfirmOpen}
        onConfirm={(e) =>
          deletingContact
            ? handleDeleteContact(deletingContact.id)
            : handleimportContact()
        }
      >
        {deletingContact
          ? `${i18n.t("contacts.confirmationModal.deleteMessage")}`
          : `${i18n.t("contacts.confirmationModal.importMessage")}`}
      </ConfirmationModal>
      
      <MainHeader>
        <Title>{i18n.t("contacts.title")}</Title>
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
            className={`${classes.headerButton} ${classes.selectButton}`}
            onClick={handleSelectAll}
            startIcon={selectAll ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
          >
            {selectAll ? "Desmarcar Todos" : "Marcar Todos"}
          </Button>

          <Can
            role={user.profile}
            perform="contacts-page:deleteContact"
            yes={() => (
              <Button
                variant="contained"
                className={`${classes.headerButton} ${classes.deleteButton}`}
                onClick={handleDeleteSelectedContacts}
                disabled={selectedContacts.length === 0}
                startIcon={<DeleteOutlineIcon />}
              >
                {selectedContacts.length > 0 ? `Excluir (${selectedContacts.length})` : "Excluir"}
              </Button>
            )}
          />

          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button
                  variant="contained"
                  className={`${classes.headerButton} ${classes.importExportButton}`}
                  {...bindTrigger(popupState)}
                  startIcon={<ArrowDropDown />}
                >
                  Importar / Exportar
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem
                    onClick={() => {
                      setConfirmOpen(true);
                      popupState.close();
                    }}
                    className={classes.menuItem}
                  >
                    <ContactPhone fontSize="small" color="primary" />
                    {i18n.t("contacts.buttons.import")}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      fileUploadRef.current.value = null;
                      fileUploadRef.current.click();
                      popupState.close();
                    }}
                    className={classes.menuItem}
                  >
                    <PublishIcon fontSize="small" color="primary" />
                    {i18n.t("contacts.buttons.importSheet")}
                  </MenuItem>
                  <MenuItem className={classes.menuItem}>
                    <CSVLink 
                      style={{ textDecoration:'none', color: 'inherit', display: 'flex', alignItems: 'center' }} 
                      separator=";" 
                      filename={'contacts_export.csv'} 
                      data={contacts.map((contact) => ({ 
                        name: contact.name, 
                        number: contact.number, 
                        email: contact.email 
                      }))}
                    >
                      <CloudDownload fontSize="small" color="primary" />
                      Exportar Excel
                    </CSVLink>
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
          
          <Button
            variant="contained"
            className={`${classes.headerButton} ${classes.addButton}`}
            onClick={handleOpenContactModal}
            startIcon={<PersonAddIcon />}
          >
            {i18n.t("contacts.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Box className={classes.statsCard}>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber}>{totalContacts}</Typography>
          <Typography className={classes.statLabel}>Total de Contatos</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#22c55e' }}>
            {activeContacts}
          </Typography>
          <Typography className={classes.statLabel}>Contatos Ativos</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#ef4444' }}>
            {inactiveContacts}
          </Typography>
          <Typography className={classes.statLabel}>Contatos Inativos</Typography>
        </Box>
      </Box>

      <Paper className={classes.mainPaper} variant="outlined">
        {loading && pageNumber === 1 && (
          <LinearProgress className={classes.loadingBar} color="primary" />
        )}
        <input
          style={{ display: "none" }}
          id="upload"
          name="file"
          type="file"
          accept=".xls,.xlsx"
          onChange={() => {
            setConfirmOpen(true);
          }}
          ref={fileUploadRef}
        />
        <div className={classes.tableContainer} onScroll={handleScroll}>
          <Table className={classes.table} stickyHeader>
            <TableHead>
              <TableRow className={classes.tableHeader}>
                <TableCell padding="checkbox" style={{ width: '50px' }}>
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className={classes.checkbox}
                  />
                </TableCell>
                <TableCell style={{ width: '300px' }}>Contato</TableCell>
                <TableCell>Informações</TableCell>
                <TableCell align="center" style={{ width: '180px' }}>Última Interação</TableCell>
                <TableCell align="center" style={{ width: '120px' }}>Status</TableCell>
                <TableCell align="center" style={{ width: '140px' }}>
                  {i18n.t("contacts.table.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} className={classes.emptyState}>
                    <ContactPhone style={{ fontSize: 48, marginBottom: 16 }} />
                    <Typography variant="h6" style={{ marginBottom: 8 }}>
                      Nenhum contato encontrado
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Adicione novos contatos clicando no botão acima
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {contacts.map((contact, index) => (
                    <Fade in key={contact.id} timeout={300 + index * 50}>
                      <TableRow className={classes.tableRow}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => handleCheckboxChange(contact.id)}
                            className={classes.checkbox}
                          />
                        </TableCell>
                        <TableCell>
                          <Box style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Avatar 
                              src={contact.profilePicUrl} 
                              className={classes.contactAvatar}
                            >
                              {!contact.profilePicUrl && getInitials(contact.name)}
                            </Avatar>
                            <Box className={classes.contactInfo}>
                              <Typography className={classes.contactName}>
                                {contact.name}
                              </Typography>
                              <Typography className={classes.contactDetail}>
                                <PhoneIcon />
                                {contact.number}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography className={classes.contactDetail}>
                            <EmailIcon />
                            {contact.email || "Não informado"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {getDateLastMessage(contact) ? (
                            <Box className={classes.lastInteraction}>
                              <AccessTimeIcon />
                              {getDateLastMessage(contact)}
                            </Box>
                          ) : (
                            <Typography style={{ color: '#cbd5e1', fontSize: '13px' }}>
                              Sem interações
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={contact.active ? "Ativo" : "Inativo"}
                            icon={contact.active ? <CheckCircleIcon /> : <CancelIcon />}
                            className={`${classes.statusChip} ${
                              contact.active ? classes.statusActive : classes.statusInactive
                            }`}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Iniciar Conversa">
                            <IconButton
                              size="small"
                              className={`${classes.actionButton} ${classes.whatsappButton}`}
                              onClick={() => {
                                setContactTicket(contact);
                                setNewTicketModalOpen(true);
                              }}
                            >
                              <WhatsAppIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar Contato">
                            <IconButton
                              size="small"
                              className={`${classes.actionButton} ${classes.editButton}`}
                              onClick={() => hadleEditContact(contact.id)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Can
                            role={user.profile}
                            perform="contacts-page:deleteContact"
                            yes={() => (
                              <Tooltip title="Excluir Contato">
                                <IconButton
                                  size="small"
                                  className={`${classes.actionButton} ${classes.deleteIconButton}`}
                                  onClick={(e) => {
                                    setConfirmOpen(true);
                                    setDeletingContact(contact);
                                  }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))}
                  {loading && <TableRowSkeleton avatar columns={6} />}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </MainContainer>
  );
};

export default Contacts;