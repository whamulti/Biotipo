import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ButtonWithSpinner from "../ButtonWithSpinner";
import ConfirmationModal from "../ConfirmationModal";
import { Edit as EditIcon } from "@material-ui/icons";
import { has, head, isArray } from "lodash";
import { toast } from "react-toastify";
import useCompanies from "../../hooks/useCompanies";
import { useDate } from "../../hooks/useDate";
import usePlans from "../../hooks/usePlans";
import api from "../../services/api";
import ModalUsers from "../ModalUsers";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: { width: "100%" },
  mainPaper: { width: "100%", flex: 1, padding: theme.spacing(2) },
  fullWidth: { width: "100%" },
  tableContainer: {
    width: "100%",
    overflowX: "scroll",
    ...theme.scrollbarStyles,
  },
  textRight: { textAlign: "right" },
  buttonContainer: { textAlign: "right", padding: theme.spacing(1) },
}));

function CompanyForm({ onSubmit, onDelete, onCancel, initialValue, loading }) {
  const classes = useStyles();
  const [plans, setPlans] = useState([]);
  const [modalUser, setModalUser] = useState(false);
  const [firstUser, setFirstUser] = useState({});
  const { list: listPlans } = usePlans();

  const [record, setRecord] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    planId: "",
    status: true,
    campaignsEnabled: false,
    dueDate: "",
    recurrence: "",
    ...initialValue,
  });

  useEffect(() => {
    (async () => setPlans(await listPlans()))();
  }, []);

  useEffect(() => {
    setRecord((prev) => ({
      ...prev,
      ...initialValue,
      dueDate: moment(initialValue?.dueDate).isValid()
        ? moment(initialValue.dueDate).format("YYYY-MM-DD")
        : "",
    }));
  }, [initialValue]);

  const handleSubmit = (data) => {
    if (!moment(data.dueDate).isValid()) data.dueDate = null;
    onSubmit(data);
    setRecord({ ...initialValue, dueDate: "" });
  };

  const handleOpenModalUsers = async () => {
    try {
      const { data } = await api.get("/users/list", {
        params: { companyId: initialValue.id },
      });
      if (isArray(data) && data.length) setFirstUser(head(data));
      setModalUser(true);
    } catch (e) {
      toast.error(e);
    }
  };

  const incrementDueDate = () => {
    const data = { ...record };
    if (moment(data.dueDate).isValid()) {
      const addMap = {
        MENSAL: 1,
        BIMESTRAL: 2,
        TRIMESTRAL: 3,
        SEMESTRAL: 6,
        ANUAL: 12,
      };
      data.dueDate = moment(data.dueDate)
        .add(addMap[data.recurrence] || 0, "month")
        .format("YYYY-MM-DD");
    }
    setRecord(data);
  };

  return (
    <>
      <ModalUsers
        userId={firstUser.id}
        companyId={initialValue.id}
        open={modalUser}
        onClose={() => setModalUser(false)}
      />
      <Formik
        enableReinitialize
        initialValues={record}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
          resetForm();
        }}
      >
        <Form className={classes.fullWidth}>
          <Grid spacing={2} container>
            <Grid xs={12} sm={6} md={4} item>
              <Field as={TextField} label="Nome" name="name" variant="outlined" fullWidth />
            </Grid>
            <Grid xs={12} sm={6} md={2} item>
              <Field as={TextField} label="E-mail" name="email" variant="outlined" fullWidth required />
            </Grid>
            <Grid xs={12} sm={6} md={2} item>
              <Field as={TextField} label="Telefone" name="phone" variant="outlined" fullWidth />
            </Grid>
            <Grid xs={12} sm={6} md={2} item>
              <FormControl fullWidth>
                <InputLabel>Plano</InputLabel>
                <Field as={Select} name="planId" required>
                  {plans.map((plan) => (
                    <MenuItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={2} item>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Field as={Select} name="status">
                  <MenuItem value={true}>Sim</MenuItem>
                  <MenuItem value={false}>Não</MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={2} item>
              <FormControl fullWidth>
                <InputLabel>Campanhas</InputLabel>
                <Field as={Select} name="campaignsEnabled">
                  <MenuItem value={true}>Habilitadas</MenuItem>
                  <MenuItem value={false}>Desabilitadas</MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={2} item>
              <Field
                as={TextField}
                label="Data de Vencimento"
                type="date"
                name="dueDate"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid xs={12} sm={6} md={2} item>
              <FormControl fullWidth>
                <InputLabel>Recorrência</InputLabel>
                <Field as={Select} name="recurrence">
                  <MenuItem value="MENSAL">Mensal</MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid xs={12} item>
              <Grid container justifyContent="flex-end" spacing={1}>
                <Grid xs={4} md={1} item>
                  <ButtonWithSpinner loading={loading} onClick={onCancel} variant="contained">
                    Limpar
                  </ButtonWithSpinner>
                </Grid>
                {record.id && (
                  <>
                    <Grid xs={6} md={1} item>
                      <ButtonWithSpinner loading={loading} onClick={() => onDelete(record)} variant="contained" color="secondary">
                        Excluir
                      </ButtonWithSpinner>
                    </Grid>
                    <Grid xs={6} md={2} item>
                      <ButtonWithSpinner loading={loading} onClick={incrementDueDate} variant="contained" color="primary">
                        + Vencimento
                      </ButtonWithSpinner>
                    </Grid>
                    <Grid xs={6} md={1} item>
                      <ButtonWithSpinner loading={loading} onClick={handleOpenModalUsers} variant="contained" color="primary">
                        Usuário
                      </ButtonWithSpinner>
                    </Grid>
                  </>
                )}
                <Grid xs={6} md={1} item>
                  <ButtonWithSpinner type="submit" loading={loading} variant="contained" color="primary">
                    Salvar
                  </ButtonWithSpinner>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </>
  );
}

function CompaniesManagerGrid({ records, onSelect }) {
  const classes = useStyles();
  const { dateToClient } = useDate();

  const rowStyle = (record) => {
    if (moment(record.dueDate).isValid()) {
      const diff = moment(record.dueDate).diff(moment(), "days");
      if (diff >= 1 && diff <= 5) return { backgroundColor: "#fffead" };
      if (diff <= 0) return { backgroundColor: "#fa8c8c" };
    }
    return {};
  };

  const renderStatus = (row) => (row.status ? "Sim" : "Não");
  const renderPlan = (row) => (row.planId ? row.plan.name : "-");
  const renderCampaignsStatus = (row) => {
    const setting = row.settings?.find((s) => s.key === "campaignsEnabled");
    return setting?.value === "true" ? "Habilitadas" : "Desabilitadas";
  };

  return (
    <Paper className={classes.tableContainer}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">#</TableCell>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Nome</TableCell>
            <TableCell align="left">E-mail</TableCell>
            <TableCell align="left">Telefone</TableCell>
            <TableCell align="left">Plano</TableCell>
            <TableCell align="left">Campanhas</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Criada Em</TableCell>
            <TableCell align="left">Vencimento</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row) => (
            <TableRow key={row.id} style={rowStyle(row)}>
              <TableCell align="center">
                <IconButton onClick={() => onSelect(row)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>{row.id || "-"}</TableCell>
              <TableCell>{row.name || "-"}</TableCell>
              <TableCell>{row.email || "-"}</TableCell>
              <TableCell>{row.phone || "-"}</TableCell>
              <TableCell>{renderPlan(row)}</TableCell>
              <TableCell>{renderCampaignsStatus(row)}</TableCell>
              <TableCell>{renderStatus(row)}</TableCell>
              <TableCell>{dateToClient(row.createdAt)}</TableCell>
              <TableCell>
                {dateToClient(row.dueDate)}
                <br />
                <span>{row.recurrence}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default function CompaniesManager() {
  const classes = useStyles();
  const { list, save, update, remove } = useCompanies();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    planId: "",
    status: true,
    campaignsEnabled: false,
    dueDate: "",
    recurrence: "",
  });

  const loadPlans = async () => {
    setLoading(true);
    try {
      setRecords(await list());
    } catch {
      toast.error("Não foi possível carregar a lista de registros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPlans(); }, []);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (data.id) await update(data);
      else await save(data);
      await loadPlans();
      handleCancel();
      toast.success("Operação realizada com sucesso!");
    } catch {
      toast.error("Erro ao salvar a empresa. Verifique se o nome já existe.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await remove(record.id);
      await loadPlans();
      handleCancel();
      toast.success("Exclusão realizada com sucesso!");
    } catch {
      toast.error("Não foi possível excluir a empresa");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () =>
    setRecord({
      id: "",
      name: "",
      email: "",
      phone: "",
      planId: "",
      status: true,
      campaignsEnabled: false,
      dueDate: "",
      recurrence: "",
    });

  const handleSelect = (data) =>
    setRecord({
      id: data.id,
      name: data.name || "",
      phone: data.phone || "",
      email: data.email || "",
      planId: data.planId || "",
      status: data.status !== false,
      campaignsEnabled:
        data.settings?.find((s) => s.key.includes("campaignsEnabled"))
          ?.value === "true",
      dueDate: data.dueDate || "",
      recurrence: data.recurrence || "",
    });

  return (
    <Paper className={classes.mainPaper} elevation={0}>
      <Grid spacing={2} container>
        <Grid xs={12} item>
          <CompanyForm
            initialValue={record}
            onDelete={() => setShowConfirmDialog(true)}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </Grid>
        <Grid xs={12} item>
          <CompaniesManagerGrid records={records} onSelect={handleSelect} />
        </Grid>
      </Grid>
      <ConfirmationModal
        title="Exclusão de Registro"
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDelete}
      >
        Deseja realmente excluir esse registro?
      </ConfirmationModal>
    </Paper>
  );
}
