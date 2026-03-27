import { api } from "./api";

export const getJobs = () => api.get("jobs");

export const addJob = (job) => api.post("jobs", job);

export const getJobsByCompany = async (companyEmail) => {
	const jobs = await getJobs();
	return jobs.filter((job) => job.companyEmail === companyEmail);
};

export const getJobById = async (jobId) => {
	const jobs = await getJobs();
	return jobs.find((job) => String(job.id) === String(jobId));
};

export const updateJob = (jobId, updates) => api.put(`jobs/${jobId}`, updates);

export const closeJob = (jobId) => api.patch(`jobs/${jobId}`, { status: "Closed" });

export const reopenJob = (jobId) => api.patch(`jobs/${jobId}`, { status: "Open" });

export const getOpenJobs = async () => {
	const jobs = await getJobs();
	return jobs.filter((job) => job.status !== "Closed");
};