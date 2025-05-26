export const parsePublicEnv = (env: Record<string, string | undefined>) =>
  Object.entries(env).reduce((acc, [key, value]) => {
    if (key.startsWith('VITE_') || ['NODE_ENV', 'HOST_ENV', 'SOURCE_VERSION'].includes(key)) {
      return {
        ...acc,
        [key]: value,
      }
    }
    return acc
  }, {})
