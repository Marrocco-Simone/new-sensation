export const links = {
  create: " Create rules",
  rules: "My rules",
  elements: "My game elements",
  games: "My games",
  tutorial: "Come funziona",
  vocabularies: "Manage vocabularies"
} as const;

export const linksPermissions = {
  create: "create:rules",
  rules: "read:rules",
  elements: "read:rules",
  games: "delete:tasks",
  tutorial: "read:rules",
  vocabularies: "update:vocabularies"
} as const
