import React, { useState, useEffect, useRef, useContext } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 197, 94, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
  },
  dialogTitle: {
    padding: theme.spacing(2, 3),
    '& .MuiTypography-h6': {
      fontWeight: 600,
      fontSize: '20px',
      color: '#0f172a',
    },
  },
  dialogContent: {
    padding: theme.spacing(3),
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    margin: theme.spacing(2),
  },
  textField: {
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
    '& .MuiFormLabel-root': {
      fontSize: '14px',
      color: '#475569',
    },
    '& .MuiFormHelperText-root': {
      fontSize: '12px',
      color: '#ef4444',
    },
  },
  dialogActions: {
    padding: theme.spacing(2, 3),
    backgroundColor: '#f8fafc',
  },
  cancelButton: {
    color: '#ef4444',
    borderColor: '#ef4444',
    borderRadius: '12px',
    padding: '10px 20px',
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#fee2e2',
      borderColor: '#dc2626',
      transform: 'translateY(-1px)',
    },
  },
  saveButton: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    borderRadius: '12px',
    padding: '10px 20px',
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
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  subtitle: {
    fontWeight: 600,
    fontSize: '16px',
    color: '#475569',
    marginBottom: theme.spacing(2),
  },
}));

const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  number: Yup.string().min(8, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Invalid email"),
});

const ContactListItemModal = ({
  open,
  onClose,
  contactId,
  initialValues,
  onSave,
}) => {
  const classes = useStyles();
  const isMounted = useRef(true);
  const { user: { companyId } } = useContext(AuthContext);
  const { contactListId } = useParams();

  const initialState = {
    name: "",
    number: "",
    email: "",
  };

  const [contact, setContact] = useState(initialState);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      if (initialValues) {
        setContact((prevState) => {
          return { ...prevState, ...initialValues };
        });
      }

      if (!contactId) return;

      try {
        const { data } = await api.get(`/contact-list-items/${contactId}`);
        if (isMounted.current) {
          setContact(data);
        }
      } catch (err) {
        toastError(err);
      }
    };

    fetchContact();
  }, [contactId, open, initialValues]);

  const handleClose = () => {
    onClose();
    setContact(initialState);
  };

  const handleSaveContact = async (values, actions) => {
    try {
      if (contactId) {
        await api.put(`/contact-list-items/${contactId}`, {
          ...values,
          companyId,
          contactListId,
        });
      } else {
        const { data } = await api.post("/contact-list-items", {
          ...values,
          companyId,
          contactListId,
        });
        if (onSave) {
          onSave(data);
        }
      }
      toast.success(i18n.t("contactModal.success"));
      handleClose();
    } catch (err) {
      toastError(err);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        className: classes.root,
      }}
    >
      <DialogTitle className={classes.dialogTitle}>
        {contactId
          ? i18n.t("contactModal.title.edit")
          : i18n.t("contactModal.title.add")}
      </DialogTitle>
      <Formik
        initialValues={contact}
        enableReinitialize={true}
        validationSchema={ContactSchema}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            handleSaveContact(values, actions);
          }, 400);
        }}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent dividers className={classes.dialogContent}>
              <Typography variant="subtitle1" className={classes.subtitle}>
                {i18n.t("contactModal.form.mainInfo")}
              </Typography>
              <Field
                as={TextField}
                label={i18n.t("contactModal.form.name")}
                name="name"
                autoFocus
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                variant="outlined"
                margin="dense"
                fullWidth
                className={classes.textField}
              />
              <Field
                as={TextField}
                label={i18n.t("contactModal.form.number")}
                name="number"
                error={touched.number && Boolean(errors.number)}
                helperText={touched.number && errors.number}
                placeholder="5513912344321"
                variant="outlined"
                margin="dense"
                fullWidth
                className={classes.textField}
              />
              <Field
                as={TextField}
                label={i18n.t("contactModal.form.email")}
                name="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                placeholder="Email address"
                fullWidth
                margin="dense"
                variant="outlined"
                className={classes.textField}
              />
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
              <Button
                onClick={handleClose}
                disabled={isSubmitting}
                variant="outlined"
                className={classes.cancelButton}
              >
                {i18n.t("contactModal.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                className={classes.saveButton}
              >
                {contactId
                  ? i18n.t("contactModal.buttons.okEdit")
                  : i18n.t("contactModal.buttons.okAdd")}
                {isSubmitting && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ContactListItemModal;