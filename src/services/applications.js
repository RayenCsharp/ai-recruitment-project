import { api } from "./api";

export const getApplications = () => api.get("applications");

export const addApplication = async (application) => {
  const apps = await getApplications();

  const exists = apps.find(
    (app) =>
      app.jobId === application.jobId &&
      app.userEmail === application.userEmail
  );

  if (exists) {
    return { success: false, message: "Already applied" };
  }

  await api.post("applications", application);

  return { success: true, message: "Application submitted" };
};