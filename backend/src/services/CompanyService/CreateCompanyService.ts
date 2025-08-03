import * as Yup from "yup";
import AppError from "../../errors/AppError";
import Company from "../../models/Company";
import Setting from "../../models/Setting";
import User from "../../models/User";

interface CompanyData {
  name: string;
  phone?: string;
  email?: string;
  password?: string;
  status?: boolean;
  planId?: number;
  campaignsEnabled?: boolean;
  dueDate?: string;
  recurrence?: string;
}

const CreateCompanyService = async (
  companyData: CompanyData
): Promise<Company> => {
  const {
    name,
    phone,
    email,
    status,
    planId,
    password,
    campaignsEnabled,
    dueDate,
    recurrence
  } = companyData;

  const companySchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "ERR_COMPANY_INVALID_NAME")
      .required("ERR_COMPANY_INVALID_NAME")
      .test(
        "Check-unique-name",
        "ERR_COMPANY_NAME_ALREADY_EXISTS",
        async value => {
          if (value) {
            const companyWithSameName = await Company.findOne({
              where: { name: value }
            });
            return !companyWithSameName;
          }
          return false;
        }
      )
  });

  try {
    await companySchema.validate({ name });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const company = await Company.create({
    name,
    phone,
    email,
    status,
    planId,
    dueDate,
    recurrence
  });

  await User.create({
    name: company.name,
    email: company.email,
    password: companyData.password || "mudar123",
    profile: "admin",
    companyId: company.id
  });

  // Configurações padrão
  const defaultSettings = [
    { key: "asaas", value: "" },
    { key: "tokenixc", value: "" },
    { key: "ipixc", value: "" },
    { key: "ipmkauth", value: "" },
    { key: "clientsecretmkauth", value: "" },
    { key: "clientidmkauth", value: "" },
    { key: "CheckMsgIsGroup", value: "disabled" },
    { key: "call", value: "disabled" },
    { key: "scheduleType", value: "disabled" },
    { key: "sendGreetingAccepted", value: "disabled" },
    { key: "sendMsgTransfTicket", value: "disabled" },
    { key: "userRating", value: "disabled" },
    { key: "chatBotType", value: "text" },
    { key: "tokensgp", value: "" },
    { key: "ipsgp", value: "" },
    { key: "appsgp", value: "" }
  ];

  for (const setting of defaultSettings) {
    await Setting.findOrCreate({
      where: {
        companyId: company.id,
        key: setting.key
      },
      defaults: {
        companyId: company.id,
        key: setting.key,
        value: setting.value
      }
    });
  }

  // Configuração específica de campanhas
  if (companyData.campaignsEnabled !== undefined) {
    const [setting, created] = await Setting.findOrCreate({
      where: {
        companyId: company.id,
        key: "campaignsEnabled"
      },
      defaults: {
        companyId: company.id,
        key: "campaignsEnabled",
        value: `${campaignsEnabled}`
      }
    });
    if (!created) {
      await setting.update({ value: `${campaignsEnabled}` });
    }
  }

  return company;
};

export default CreateCompanyService;
