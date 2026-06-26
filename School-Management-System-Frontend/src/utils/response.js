export function getApiData(response) {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }
  return response?.data ?? [];
}
