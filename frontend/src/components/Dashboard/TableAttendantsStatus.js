import React from "react";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";
import {
    Box,
    Typography,
    Avatar,
    Chip,
    LinearProgress,
    Fade,
    Tooltip,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { green, red, orange, blue } from "@material-ui/core/colors";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import PersonIcon from "@material-ui/icons/Person";
import StarIcon from "@material-ui/icons/Star";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import moment from "moment";

import Rating from "@material-ui/lab/Rating";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
        backgroundColor: 'white',
    },
    table: {
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
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        },
    },
    attendantInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
    },
    avatar: {
        width: 48,
        height: 48,
        backgroundColor: '#f0fdf4',
        color: '#22c55e',
        fontWeight: 600,
        fontSize: '18px',
        border: '2px solid #dcfce7',
    },
    attendantName: {
        fontWeight: 600,
        fontSize: '15px',
        color: '#0f172a',
        marginBottom: '2px',
    },
    attendantRole: {
        fontSize: '13px',
        color: '#64748b',
    },
    statusChip: {
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '12px',
        height: '32px',
        minWidth: '100px',
    },
    statusOnline: {
        backgroundColor: '#f0fdf4',
        color: '#16a34a',
        border: '1px solid #bbf7d0',
        '& .MuiChip-icon': {
            color: '#22c55e',
        },
    },
    statusOffline: {
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca',
        '& .MuiChip-icon': {
            color: '#ef4444',
        },
    },
    ratingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(0.5),
    },
    ratingValue: {
        fontSize: '16px',
        fontWeight: 700,
        color: '#0f172a',
    },
    ratingStars: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5),
        '& .MuiRating-root': {
            color: '#f59e0b',
        },
        '& .MuiRating-iconEmpty': {
            color: '#e5e7eb',
        },
    },
    timeContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(1),
    },
    timeValue: {
        fontSize: '15px',
        fontWeight: 600,
        color: '#334155',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5),
    },
    timeIcon: {
        fontSize: '18px',
        color: '#94a3b8',
    },
    timeBadge: {
        backgroundColor: '#f0f9ff',
        color: '#0369a1',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: theme.spacing(0.5),
    },
    performanceIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5),
        fontSize: '12px',
        marginTop: theme.spacing(0.5),
    },
    performanceGood: {
        color: green[600],
        '& svg': {
            fontSize: '16px',
        },
    },
    performanceBad: {
        color: red[600],
        '& svg': {
            fontSize: '16px',
        },
    },
    loadingContainer: {
        padding: theme.spacing(4),
        textAlign: 'center',
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
}));

export function RatingBox({ rating }) {
    const classes = useStyles();
    const ratingTrunc = rating && rating > 0 ? rating.toFixed(1) : 0;
    
    return (
        <Box className={classes.ratingContainer}>
            <Typography className={classes.ratingValue}>
                {ratingTrunc}
            </Typography>
            <Box className={classes.ratingStars}>
                <Rating 
                    value={parseFloat(ratingTrunc)} 
                    max={5} 
                    precision={0.1} 
                    readOnly 
                    size="small"
                />
            </Box>
            {ratingTrunc >= 4 && (
                <Box className={`${classes.performanceIndicator} ${classes.performanceGood}`}>
                    <TrendingUpIcon />
                    <Typography variant="caption">Excelente</Typography>
                </Box>
            )}
            {ratingTrunc < 3 && ratingTrunc > 0 && (
                <Box className={`${classes.performanceIndicator} ${classes.performanceBad}`}>
                    <TrendingDownIcon />
                    <Typography variant="caption">Melhorar</Typography>
                </Box>
            )}
        </Box>
    );
}

export default function TableAttendantsStatus(props) {
    const { loading, attendants } = props;
    const classes = useStyles();

    function getInitials(name) {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    function formatTime(minutes) {
        if (!minutes || minutes === 0) return "0h 0m";
        return moment().startOf("day").add(minutes, "minutes").format("HH[h] mm[m]");
    }

    function getTimeColor(minutes) {
        if (minutes < 10) return '#22c55e';
        if (minutes < 30) return '#f59e0b';
        return '#ef4444';
    }

    function renderList() {
        return attendants.map((attendant, index) => (
            <Fade in key={index} timeout={300 + index * 100}>
                <TableRow className={classes.tableRow}>
                    <TableCell>
                        <Box className={classes.attendantInfo}>
                            <Avatar className={classes.avatar}>
                                {getInitials(attendant.name)}
                            </Avatar>
                            <Box>
                                <Typography className={classes.attendantName}>
                                    {attendant.name}
                                </Typography>
                                <Typography className={classes.attendantRole}>
                                    Atendente
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell>
                    <TableCell align="center">
                        <RatingBox rating={attendant.rating} />
                    </TableCell>
                    <TableCell align="center">
                        <Box className={classes.timeContainer}>
                            <Tooltip title="Tempo médio de atendimento" arrow>
                                <Box 
                                    className={classes.timeBadge}
                                    style={{ 
                                        backgroundColor: `${getTimeColor(attendant.avgSupportTime)}15`,
                                        color: getTimeColor(attendant.avgSupportTime),
                                        borderColor: getTimeColor(attendant.avgSupportTime),
                                        border: '1px solid',
                                    }}
                                >
                                    <AccessTimeIcon className={classes.timeIcon} />
                                    {formatTime(attendant.avgSupportTime)}
                                </Box>
                            </Tooltip>
                        </Box>
                    </TableCell>
                    <TableCell align="center">
                        <Chip
                            size="medium"
                            label={attendant.online ? "Online" : "Offline"}
                            icon={attendant.online ? <CheckCircleIcon /> : <ErrorIcon />}
                            className={`${classes.statusChip} ${
                                attendant.online ? classes.statusOnline : classes.statusOffline
                            }`}
                        />
                    </TableCell>
                </TableRow>
            </Fade>
        ));
    }

    if (loading) {
        return (
            <Box className={classes.loadingContainer}>
                <Skeleton variant="rect" height={60} style={{ borderRadius: 8, marginBottom: 16 }} />
                <Skeleton variant="rect" height={300} style={{ borderRadius: 8 }} />
            </Box>
        );
    }

    if (!attendants || attendants.length === 0) {
        return (
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Box className={classes.emptyState}>
                    <PersonIcon />
                    <Typography variant="h6" style={{ marginBottom: 8 }}>
                        Nenhum atendente encontrado
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Os dados dos atendentes aparecerão aqui
                    </Typography>
                </Box>
            </TableContainer>
        );
    }

    return (
        <Box>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow className={classes.tableHeader}>
                            <TableCell style={{ width: '35%' }}>Atendente</TableCell>
                            <TableCell align="center" style={{ width: '25%' }}>Avaliações</TableCell>
                            <TableCell align="center" style={{ width: '25%' }}>T.M. de Atendimento</TableCell>
                            <TableCell align="center" style={{ width: '15%' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderList()}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}