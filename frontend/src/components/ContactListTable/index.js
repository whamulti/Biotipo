import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Paper,
  Box,
  Typography,
  LinearProgress,
  Tooltip,
  Fade,
} from "@material-ui/core";
import {
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
  People as PeopleIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import TableRowSkeleton from "../../components/TableRowSkeleton";
import { i18n } from "../../translate/i18n";

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
}));

function ContactListsTable(props) {
  const {
    contactLists,
    showLoading,
    editContactList,
    deleteContactList,
    readOnly,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (Array.isArray(contactLists)) {
      setRows(contactLists);
    }
    if (showLoading !== undefined) {
      setLoading(showLoading);
    }
  }, [contactLists, showLoading]);

  const handleEdit = (contactList) => {
    editContactList(contactList);
  };

  const handleDelete = (contactList) => {
    deleteContactList(contactList);
  };

  const goToContacts = (id) => {
    history.push(`/contact-lists/${id}/contacts`);
  };

  const renderRows = () => {
    return rows.map((contactList) => (
      <Fade in key={contactList.id}>
        <TableRow className={classes.tableRow}>
          <TableCell align="center">{contactList.name}</TableCell>
          <TableCell align="center">{contactList.contactsCount || 0}</TableCell>
          {!readOnly && (
            <TableCell align="center">
              <Tooltip title={i18n.t("contactLists.table.actions.viewContacts")}>
                <IconButton
                  size="small"
                  className={`${classes.actionButton} ${classes.contactsButton}`}
                  onClick={() => goToContacts(contactList.id)}
                >
                  <PeopleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={i18n.t("contactLists.table.actions.edit")}>
                <IconButton
                  size="small"
                  className={`${classes.actionButton} ${classes.editButton}`}
                  onClick={() => handleEdit(contactList)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={i18n.t("contactLists.table.actions.delete")}>
                <IconButton
                  size="small"
                  className={`${classes.actionButton} ${classes.deleteButton}`}
                  onClick={() => handleDelete(contactList)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </TableCell>
          )}
        </TableRow>
      </Fade>
    ));
  };

  return (
    <Paper className={classes.mainPaper} variant="outlined">
      {loading && (
        <LinearProgress className={classes.loadingBar} color="primary" />
      )}
      <div className={classes.tableContainer}>
        <Table className={classes.table} stickyHeader>
          <TableHead>
            <TableRow className={classes.tableHeader}>
              <TableCell align="center" style={{ width: '40%' }}>
                {i18n.t("contactLists.table.name")}
              </TableCell>
              <TableCell align="center" style={{ width: '20%' }}>
                {i18n.t("contactLists.table.contacts")}
              </TableCell>
              {!readOnly && (
                <TableCell align="center" style={{ width: '40%' }}>
                  {i18n.t("contactLists.table.actions")}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRowSkeleton columns={readOnly ? 2 : 3} />
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 2 : 3} className={classes.tableEmpty}>
                  <PeopleIcon style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                  <Typography variant="h6" style={{ marginBottom: 8 }}>
                    {i18n.t("contactLists.table.empty")}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {i18n.t("contactLists.table.emptyMessage")}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              renderRows()
            )}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}

ContactListsTable.propTypes = {
  contactLists: PropTypes.array.isRequired,
  showLoading: PropTypes.bool,
  editContactList: PropTypes.func.isRequired,
  deleteContactList: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

export default ContactListsTable;