import { api } from "./api";

export const getApplications = () => api.get("applications");

export const updateApplicationStatus = (applicationId, status) =>
  api.patch(`applications/${applicationId}`, { status });

export const updateApplicationCV = (applicationId, cvData) =>
  api.patch(`applications/${applicationId}`, { cvFile: cvData.fileName, cvText: cvData.cvText });

export const getApplicationsByJobId = async (jobId) => {
  const apps = await getApplications();
  return apps.filter((app) => String(app.jobId) === String(jobId));
};

export const getApplicationsForCompanyJobs = async (jobIds) => {
  if (!Array.isArray(jobIds) || jobIds.length === 0) {
    return [];
  }

  const apps = await getApplications();

  return apps
    .filter((app) => jobIds.some((id) => String(id) === String(app.jobId)))
    .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
};

export const getCVsForJob = async (jobId) => {
  const apps = await getApplicationsByJobId(jobId);
  return apps.filter((app) => app.cvFile && app.cvFile !== "Not uploaded");
};

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