

export function idToFsuri(id: string | number, type: 'A' | 'P') {
  const long = String(id).padStart(6, '0')
  return `#${type}-${long.slice(0, 3)}-${long.slice(3)}`
}
