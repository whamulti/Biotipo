import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useContext,
} from "react";
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
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import LinearProgress from "@material-ui/core/LinearProgress";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import AddIcon from "@material-ui/icons/Add";
import ConfirmationTextIcon from "@material-ui/icons/ConfirmationNumber";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import LabelIcon from "@material-ui/icons/Label";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import TagModal from "../../components/TagModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_TAGS") {
    const tags = action.payload;
    const newTags = [];

    tags.forEach((tag) => {
      const tagIndex = state.findIndex((s) => s.id === tag.id);
      if (tagIndex !== -1) {
        state[tagIndex] = tag;
      } else {
        newTags.push(tag);
      }
    });

    return [...state, ...newTags];
  }

  if (action.type === "UPDATE_TAGS") {
    const tag = action.payload;
    const tagIndex = state.findIndex((s) => s.id === tag.id);

    if (tagIndex !== -1) {
      state[tagIndex] = tag;
      return [...state];
    } else {
      return [tag, ...state];
    }
  }

  if (action.type === "DELETE_TAG") {
    const tagId = action.payload;

    const tagIndex = state.findIndex((s) => s.id === tagId);
    if (tagIndex !== -1) {
      state.splice(tagIndex, 1);
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
  tagChip: {
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '13px',
    height: '32px',
    padding: '0 16px',
    textShadow: 'none',
    border: '2px solid transparent',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  tagCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  ticketCountBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: '12px',
    padding: '6px 16px',
    fontWeight: 600,
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#e2e8f0',
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
  colorPreview: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: theme.spacing(1),
    border: '2px solid rgba(0, 0, 0, 0.1)',
  },
}));

const Tags = () => {
  const classes = useStyles();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [deletingTag, setDeletingTag] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [tags, dispatch] = useReducer(reducer, []);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const fetchTags = useCallback(async () => {
    try {
      const { data } = await api.get("/tags/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_TAGS", payload: data.tags });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  }, [searchParam, pageNumber]);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchTags();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber, fetchTags]);

  useEffect(() => {
    const socket = socketManager.getSocket(user.companyId);

    socket.on("user", (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_TAGS", payload: data.tags });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_TAG", payload: +data.tagId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager, user]);

  const handleOpenTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setTagModalOpen(true);
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await api.delete(`/tags/${tagId}`);
      toast.success(i18n.t("tags.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingTag(null);
    setSearchParam("");
    setPageNumber(1);

    dispatch({ type: "RESET" });
    setPageNumber(1);
    await fetchTags();
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

  const getTagStats = () => {
    const totalTags = tags.length;
    const totalTickets = tags.reduce((sum, tag) => sum + (tag.ticketsCount || 0), 0);
    const avgTicketsPerTag = totalTags > 0 ? Math.round(totalTickets / totalTags) : 0;
    
    return { totalTags, totalTickets, avgTicketsPerTag };
  };

  const { totalTags, totalTickets, avgTicketsPerTag } = getTagStats();

  const getContrastColor = (hexColor) => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={deletingTag && `${i18n.t("tags.confirmationModal.deleteTitle")}`}
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteTag(deletingTag.id)}
      >
        {i18n.t("tags.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <TagModal
        open={tagModalOpen}
        onClose={handleCloseTagModal}
        reload={fetchTags}
        aria-labelledby="form-dialog-title"
        tagId={selectedTag && selectedTag.id}
      />
      <MainHeader>
        <Title>{i18n.t("tags.title")}</Title>
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
            onClick={handleOpenTagModal}
            startIcon={<AddIcon />}
          >
            {i18n.t("tags.buttons.add")}
          </Button>		  
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Box className={classes.statsCard}>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber}>{totalTags}</Typography>
          <Typography className={classes.statLabel}>Total de Tags</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#22c55e' }}>
            {totalTickets}
          </Typography>
          <Typography className={classes.statLabel}>Tickets Vinculados</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#3b82f6' }}>
            {avgTicketsPerTag}
          </Typography>
          <Typography className={classes.statLabel}>Média por Tag</Typography>
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
                  {i18n.t("tags.table.name")}
                </TableCell>
                <TableCell align="center" style={{ width: '30%' }}>
                  {i18n.t("tags.table.tickets")}
                </TableCell>
                <TableCell align="center" style={{ width: '30%' }}>
                  {i18n.t("tags.table.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={3} className={classes.tableEmpty}>
                    <LocalOfferIcon style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                    <Typography variant="h6" style={{ marginBottom: 8 }}>
                      Nenhuma tag encontrada
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Crie tags para organizar melhor seus tickets
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {tags.map((tag) => (
                    <Fade in key={tag.id}>
                      <TableRow className={classes.tableRow}>
                        <TableCell align="center">
                          <Box className={classes.tagCell}>
                            <span 
                              className={classes.colorPreview}
                              style={{ backgroundColor: tag.color }}
                            />
                            <Chip
                              icon={<LabelIcon />}
                              className={classes.tagChip}
                              style={{
                                backgroundColor: tag.color,
                                color: getContrastColor(tag.color),
                                borderColor: tag.color,
                              }}
                              label={tag.name}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box className={classes.ticketCountBadge}>
                            <ConfirmationTextIcon style={{ fontSize: 18 }} />
                            <span>{tag.ticketsCount || 0}</span>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Editar tag">
                            <IconButton 
                              size="small" 
                              className={`${classes.actionButton} ${classes.editButton}`}
                              onClick={() => handleEditTag(tag)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir tag">
                            <IconButton
                              size="small"
                              className={`${classes.actionButton} ${classes.deleteButton}`}
                              onClick={(e) => {
                                setConfirmModalOpen(true);
                                setDeletingTag(tag);
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

export default Tags;