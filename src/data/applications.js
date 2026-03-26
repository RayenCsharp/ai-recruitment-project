const STORAGE_KEY = "applications";

// Load from localStorage
let applications = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Save helper
const saveApplications = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
};

// Get
export const getApplications = () => applications;

// Add
export const addApplication = (job) => {
  const exists = applications.find((app) => app.id === job.id);

  if (exists) {
    return { success: false, message: "Already applied" };
  }

  applications.push({
    ...job,
    status: "Pending",
  });

  saveApplications();

  return { success: true, message: "Application submitted" };
};