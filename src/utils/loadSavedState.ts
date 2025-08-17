export const loadSavedState = () => {
  const savedState = localStorage.getItem("imageTextEditor") ?? "";

  try {
    return JSON.parse(savedState);
  } catch {}

  return null;
};
