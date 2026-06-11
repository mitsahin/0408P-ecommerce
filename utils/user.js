export function formatUser(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role_id: row.role_id,
    role: row.role_code
      ? { id: row.role_id, code: row.role_code, name: row.role_name }
      : undefined,
  }
}
