const generateEndPoint = (endpoint, query) => {
  const filteredQuery = Object.fromEntries(
    Object.entries(query).filter(([key, value]) => value !== "")
  );

  return `${endpoint}${
    Object.keys(filteredQuery).length
      ? `?${Object.entries(filteredQuery)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : ""
  }`;
};

export default generateEndPoint;
