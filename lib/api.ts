export async function getAllIPOs() {
  const res = await fetch("/api/ipos");
  return await res.json();
}

export async function getIPOById(id: number) {
  const res = await fetch(`/api/ipos/${id}`);
  return await res.json();
}
