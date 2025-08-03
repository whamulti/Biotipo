import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import { Badge, Collapse, List, Fade, Tooltip } from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import AutorenewIcon from '@material-ui/icons/Autorenew';
import SearchIcon from '@material-ui/icons/Search';
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import EventIcon from "@material-ui/icons/Event";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeopleIcon from "@material-ui/icons/People";
import ListIcon from "@material-ui/icons/ListAlt";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import ForumIcon from "@material-ui/icons/Forum";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import RotateRight from "@material-ui/icons/RotateRight";
import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import LoyaltyRoundedIcon from '@material-ui/icons/LoyaltyRounded';
import { Can } from "../components/Can";
import { SocketContext } from "../context/Socket/SocketContext";
import { isArray } from "lodash";
import TableChartIcon from '@material-ui/icons/TableChart';
import api from "../services/api";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import ToDoList from "../pages/ToDoList/";
import toastError from "../errors/toastError";
import { makeStyles } from "@material-ui/core/styles";
import { AllInclusive, AttachFile, BlurCircular, Description, DeviceHubOutlined, Schedule, PowerSettingsNew, ExitToApp } from '@material-ui/icons';
import usePlans from "../hooks/usePlans";
import Typography from "@material-ui/core/Typography";
import useVersion from "../hooks/useVersion";
import LogLauncher from "../pages/LogLauncher";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  menuSection: {
    marginBottom: theme.spacing(2),
  },
  sectionHeader: {
    backgroundColor: '#f8fafc',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2.5),
    marginBottom: theme.spacing(1),
    borderLeft: '3px solid #22c55e',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f0fdf4',
      borderLeftWidth: '5px',
    },
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  listItem: {
    borderRadius: '12px',
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f0fdf4',
      transform: 'translateX(4px)',
      '& .MuiListItemIcon-root': {
        color: '#22c55e',
        transform: 'scale(1.1)',
      },
    },
    '&.Mui-selected': {
      backgroundColor: '#f0fdf4',
      borderLeft: '3px solid #22c55e',
      '&:hover': {
        backgroundColor: '#dcfce7',
      },
      '& .MuiListItemIcon-root': {
        color: '#22c55e',
      },
      '& .MuiListItemText-primary': {
        color: '#16a34a',
        fontWeight: 600,
      },
    },
  },
  listItemIcon: {
    minWidth: '40px',
    color: '#64748b',
    transition: 'all 0.3s ease',
  },
  listItemText: {
    '& .MuiListItemText-primary': {
      fontSize: '14px',
      fontWeight: 500,
      color: '#334155',
      letterSpacing: '0.01em',
    },
  },
  badge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#ef4444',
      color: 'white',
      fontWeight: 600,
      fontSize: '10px',
      height: '18px',
      minWidth: '18px',
      borderRadius: '9px',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
      animation: '$pulse 2s ease-in-out infinite',
    },
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '50%': {
      transform: 'scale(1.1)',
      opacity: 0.8,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  warningBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#f59e0b',
      color: 'white',
      fontSize: '12px',
      fontWeight: 700,
      padding: '0 4px',
    },
  },
  logoutButton: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    margin: theme.spacing(2),
    marginTop: theme.spacing(3),
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
      transform: 'translateY(-1px)',
    },
    '& .MuiListItemIcon-root': {
      color: 'white',
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      fontSize: '14px',
    },
  },
  divider: {
    margin: theme.spacing(2, 0),
    backgroundColor: '#e2e8f0',
  },
  versionContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    gap: theme.spacing(1),
  },
  versionText: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: 500,
  },
  versionBadge: {
    backgroundColor: '#22c55e',
    color: 'white',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '10px',
    textTransform: 'uppercase',
  },
  collapsedIcon: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  menuWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f5f9',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#cbd5e1',
      borderRadius: '3px',
      '&:hover': {
        background: '#94a3b8',
      },
    },
  },
  menuContent: {
    flex: 1,
    paddingBottom: theme.spacing(2),
  },
  bottomSection: {
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    padding: theme.spacing(1),
  },
  tooltip: {
    backgroundColor: '#1e293b',
    fontSize: '12px',
    fontWeight: 500,
  },
}));

function ListItemLink(props) {
  const { icon, primary, to, className, badge, badgeColor = "secondary" } = props;
  const classes = useStyles();

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink} className={`${classes.listItem} ${className}`}>
        <ListItemIcon className={classes.listItemIcon}>
          {badge ? (
            <Badge badgeContent={badge} color={badgeColor} className={classes.badge}>
              {icon}
            </Badge>
          ) : (
            icon
          )}
        </ListItemIcon>
        <ListItemText primary={primary} className={classes.listItemText} />
      </ListItem>
    </li>
  );
}

const reducer = (state, action) => {
  if (action.type === "LOAD_CHATS") {
    const chats = action.payload;
    const newChats = [];

    if (isArray(chats)) {
      chats.forEach((chat) => {
        const chatIndex = state.findIndex((u) => u.id === chat.id);
        if (chatIndex !== -1) {
          state[chatIndex] = chat;
        } else {
          newChats.push(chat);
        }
      });
    }

    return [...state, ...newChats];
  }

  if (action.type === "UPDATE_CHATS") {
    const chat = action.payload;
    const chatIndex = state.findIndex((u) => u.id === chat.id);

    if (chatIndex !== -1) {
      state[chatIndex] = chat;
      return [...state];
    } else {
      return [chat, ...state];
    }
  }

  if (action.type === "DELETE_CHAT") {
    const chatId = action.payload;

    const chatIndex = state.findIndex((u) => u.id === chatId);
    if (chatIndex !== -1) {
      state.splice(chatIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }

  if (action.type === "CHANGE_CHAT") {
    const changedChats = state.map((chat) => {
      if (chat.id === action.payload.chat.id) {
        return action.payload.chat;
      }
      return chat;
    });
    return changedChats;
  }
};

const MainListItems = (props) => {
  const classes = useStyles();
  const { drawerClose, collapsed } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user, handleLogout } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const [openCampaignSubmenu, setOpenCampaignSubmenu] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [showKanban, setShowKanban] = useState(false);
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const history = useHistory();
  const [showSchedules, setShowSchedules] = useState(false);
  const [showInternalChat, setShowInternalChat] = useState(false);
  const [showExternalApi, setShowExternalApi] = useState(false);

  const [invisible, setInvisible] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam] = useState("");
  const [chats, dispatch] = useReducer(reducer, []);
  const { getPlanCompany } = usePlans();
  
  const [version, setVersion] = useState(false);
  
  const { getVersion } = useVersion();

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    async function fetchVersion() {
      const _version = await getVersion();
      setVersion(_version.version);
    }
    fetchVersion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);

      setShowCampaigns(planConfigs.plan.useCampaigns);
      setShowKanban(planConfigs.plan.useKanban);
      setShowOpenAi(planConfigs.plan.useOpenAi);
      setShowIntegrations(planConfigs.plan.useIntegrations);
      setShowSchedules(planConfigs.plan.useSchedules);
      setShowInternalChat(planConfigs.plan.useInternalChat);
      setShowExternalApi(planConfigs.plan.useExternalApi);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-chat`, (data) => {
      if (data.action === "new-message") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
      if (data.action === "update") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  useEffect(() => {
    let unreadsCount = 0;
    if (chats.length > 0) {
      for (let chat of chats) {
        for (let chatUser of chat.users) {
          if (chatUser.userId === user.id) {
            unreadsCount += chatUser.unreads;
          }
        }
      }
    }
    if (unreadsCount > 0) {
      setInvisible(false);
    } else {
      setInvisible(true);
    }
  }, [chats, user.id]);

  useEffect(() => {
    if (localStorage.getItem("cshow")) {
      setShowCampaigns(true);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chats/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_CHATS", payload: data.records });
    } catch (err) {
      toastError(err);
    }
  };

  const handleClickLogout = () => {
    handleLogout();
  };

  return (
    <div className={classes.menuWrapper} onClick={drawerClose}>
      <div className={classes.menuContent}>
        <Can
          role={user.profile}
          perform={"drawer-service-items:view"}
          style={{
            overflowY: "scroll",
          }}
          no={() => (
            <Fade in timeout={600}>
              <div className={classes.menuSection}>
                {!collapsed && (
                  <div className={classes.sectionHeader}>
                    <Typography className={classes.sectionTitle}>
                      {i18n.t("Atendimento")}
                    </Typography>
                  </div>
                )}
                <List component="nav" dense>
                  <ListItemLink
                    to="/tickets"
                    primary={i18n.t("mainDrawer.listItems.tickets")}
                    icon={<WhatsAppIcon />}
                  />
                  <ListItemLink
                    to="/quick-messages"
                    primary={i18n.t("mainDrawer.listItems.quickMessages")}
                    icon={<FlashOnIcon />}
                  />
                  {showKanban && (
                    <ListItemLink
                      to="/kanban"
                      primary="Kanban"
                      icon={<LoyaltyRoundedIcon />}
                    />
                  )}
                  <ListItemLink
                    to="/todolist"
                    primary={i18n.t("Tarefas")}
                    icon={<BorderColorIcon />}
                  />
                  <ListItemLink
                    to="/contacts"
                    primary={i18n.t("mainDrawer.listItems.contacts")}
                    icon={<ContactPhoneOutlinedIcon />}
                  />
                  {showSchedules && (
                    <ListItemLink
                      to="/schedules"
                      primary={i18n.t("mainDrawer.listItems.schedules")}
                      icon={<Schedule />}
                    />
                  )}
                  <ListItemLink
                    to="/tags"
                    primary={i18n.t("mainDrawer.listItems.tags")}
                    icon={<LocalOfferIcon />}
                  />
                  {showInternalChat && (
                    <ListItemLink
                      to="/chats"
                      primary={i18n.t("mainDrawer.listItems.chats")}
                      icon={<ForumIcon />}
                      badge={!invisible ? "•" : null}
                    />
                  )}
                  <ListItemLink
                    to="/helps"
                    primary={i18n.t("mainDrawer.listItems.helps")}
                    icon={<HelpOutlineIcon />}
                  />
                </List>
              </div>
            </Fade>
          )}
        />

        <Can
          role={user.profile}
          perform={"drawer-admin-items:view"}
          yes={() => (
            <Fade in timeout={800}>
              <div className={classes.menuSection}>
                {!collapsed && (
                  <div className={classes.sectionHeader}>
                    <Typography className={classes.sectionTitle}>
                      {i18n.t("Gerência")}
                    </Typography>
                  </div>
                )}
                <List component="nav" dense>
                  <ListItemLink
                    to="/"
                    primary="Dashboard"
                    icon={<DashboardOutlinedIcon />}
                  />
                  <ListItemLink
                    to="/relatorios"
                    primary={i18n.t("Relatórios")}
                    icon={<SearchIcon />}
                  />
                </List>
              </div>
            </Fade>
          )}
        />

        <Can
          role={user.profile}
          perform="drawer-admin-items:view"
          yes={() => (
            <>
              {showCampaigns && (
                <Fade in timeout={1000}>
                  <div className={classes.menuSection}>
                    {!collapsed && (
                      <div className={classes.sectionHeader}>
                        <Typography className={classes.sectionTitle}>
                          {i18n.t("Campanhas")}
                        </Typography>
                      </div>
                    )}
                    <List component="nav" dense>
                      <ListItemLink
                        to="/campaigns"
                        primary={i18n.t("Listagem")}
                        icon={<ListIcon />}
                      />
                      <ListItemLink
                        to="/contact-lists"
                        primary={i18n.t("Listas de Contatos")}
                        icon={<PeopleIcon />}
                      />
                      <ListItemLink
                        to="/campaigns-config"
                        primary={i18n.t("Configurações")}
                        icon={<SettingsOutlinedIcon />}
                      />
                    </List>
                  </div>
                </Fade>
              )}

              <Fade in timeout={1200}>
                <div className={classes.menuSection}>
                  {!collapsed && (
                    <div className={classes.sectionHeader}>
                      <Typography className={classes.sectionTitle}>
                        {i18n.t("Administração")}
                      </Typography>
                    </div>
                  )}
                  <List component="nav" dense>
                    {user.super && (
                      <ListItemLink
                        to="/announcements"
                        primary={i18n.t("mainDrawer.listItems.annoucements")}
                        icon={<AnnouncementIcon />}
                      />
                    )}
                    {showOpenAi && (
                      <ListItemLink
                        to="/prompts"
                        primary={i18n.t("mainDrawer.listItems.prompts")}
                        icon={<AllInclusive />}
                      />
                    )}
                    {showIntegrations && (
                      <ListItemLink
                        to="/queue-integration"
                        primary={i18n.t("mainDrawer.listItems.queueIntegration")}
                        icon={<DeviceHubOutlined />}
                      />
                    )}
                    <ListItemLink
                      to="/connections"
                      primary={i18n.t("mainDrawer.listItems.connections")}
                      icon={
                        <Badge 
                          badgeContent={connectionWarning ? "!" : 0} 
                          color="error"
                          className={classes.warningBadge}
                        >
                          <SyncAltIcon />
                        </Badge>
                      }
                    />
                    <ListItemLink
                      to="/files"
                      primary={i18n.t("mainDrawer.listItems.files")}
                      icon={<AttachFile />}
                    />
                    <ListItemLink
                      to="/queues"
                      primary={i18n.t("mainDrawer.listItems.queues")}
                      icon={<AccountTreeOutlinedIcon />}
                    />
                    <ListItemLink
                      to="/users"
                      primary={i18n.t("mainDrawer.listItems.users")}
                      icon={<PeopleAltOutlinedIcon />}
                    />
                    {showExternalApi && (
                      <ListItemLink
                        to="/messages-api"
                        primary={i18n.t("mainDrawer.listItems.messagesAPI")}
                        icon={<CodeRoundedIcon />}
                      />
                    )}
                    <ListItemLink
                      to="/financeiro"
                      primary={i18n.t("mainDrawer.listItems.financeiro")}
                      icon={<LocalAtmIcon />}
                    />
                    <ListItemLink
                      to="/settings"
                      primary={i18n.t("mainDrawer.listItems.settings")}
                      icon={<SettingsOutlinedIcon />}
                    />
                  </List>
                </div>
              </Fade>

              {user.super && (
                <Fade in timeout={1400}>
                  <div className={classes.menuSection}>
                    {!collapsed && (
                      <div className={classes.sectionHeader}>
                        <Typography className={classes.sectionTitle}>
                          {i18n.t("Sistema")}
                        </Typography>
                      </div>
                    )}
                    <List component="nav" dense>
                      <ListItemLink
                        to="/LogLauncher"
                        primary={i18n.t("mainDrawer.listItems.loglauncher")}
                        icon={<AutorenewIcon />}
                      />
                    </List>
                  </div>
                </Fade>
              )}
            </>
          )}
        />
      </div>

      <div className={classes.bottomSection}>
        {!collapsed && (
          <Box className={classes.versionContainer}>
            <Typography className={classes.versionText}>
              v{version}
            </Typography>
            <Chip 
              label="LATEST" 
              size="small" 
              className={classes.versionBadge}
            />
          </Box>
        )}
        
        <Tooltip 
          title={collapsed ? i18n.t("Sair") : ""} 
          placement="right"
          classes={{ tooltip: classes.tooltip }}
        >
          <ListItem
            button
            onClick={handleClickLogout}
            className={classes.logoutButton}
          >
            <ListItemIcon className={collapsed ? classes.collapsedIcon : ""}>
              <ExitToApp />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary={i18n.t("Sair")} />
            )}
          </ListItem>
        </Tooltip>
      </div>
    </div>
  );
};

export default MainListItems;