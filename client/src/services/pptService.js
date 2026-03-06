import api from "./api";

export const generatePPT = async (promptText) => {
  const response = await api.post("/ppt/generate", {
    prompt: promptText,
  });
  return response.data;
};

export const getAllPPTs = async () => {
  const response = await api.get("/ppt/");
  return response.data.data;
};

export const getPPTById = async (id) => {
  const response = await api.get(`/ppt/${id}`);
  return response.data;
};

export const getPublicPPTById = async (id) => {
  const res = await api.get(`/ppt/view/${id}`);
  return res.data;
};

export const updatePPT = async (id, updatedFields) => {
  const response = await api.patch(`/ppt/${id}`, updatedFields);
  return response.data;
};

export const softDeletePPT = async (id) => {
  const response = await api.delete(`/ppt/${id}`);
  return response.data;
};

export const getDeletedPPTs = async () => {
  const response = await api.get("/ppt/deleted/all");
  return response.data.data;
};

export const restorePPT = async (id) => {
  const response = await api.patch(`/ppt/restore/${id}`);
  return response.data;
};

export const permanentDeletePPT = async (id) => {
  const response = await api.delete(`/ppt/permanent/${id}`);
  return response.data;
};

export const exportPPT = async (id, title) => {
  const response = await api.get(`/ppt/export/${id}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${title.replace(/\s+/g, "_")}.pptx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const generateAiImage = async (slideTitle, slideContent) => {
  const response = await api.post("/upload/generate-ai", {
    slideTitle,
    slideContent,
  });

  return response.data;
};

export const rewriteTextWithAi = async (text, tone) => {
  const response = await api.post("/ai/rewrite", { text, tone });
  return response.data;
};

const pptService = {
  generatePPT,
  getAllPPTs,
  getPPTById,
  updatePPT,
  softDeletePPT,
  getDeletedPPTs,
  restorePPT,
  permanentDeletePPT,
  exportPPT,
  generateAiImage,
  rewriteTextWithAi,
};

export default pptService;
