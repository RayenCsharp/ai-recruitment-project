let applications = [];

export const getApplications = () => applications;

export const addApplication = (job) => {
  applications.push({
    ...job,
    status: "Pending",
  });
};