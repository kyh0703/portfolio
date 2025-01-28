export const manageKeys = {
  exports: ['exports'] as const,
  download: (fileName: string) => ['download', fileName] as const,
}
