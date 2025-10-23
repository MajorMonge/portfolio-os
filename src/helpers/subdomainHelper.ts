interface AllowedSubdomains {
  excluded: string[];
  exclusive: string[];
}

export const getSubdomainFromHost = (host: string): string => {
  const baseDomain = import.meta.env.PUBLIC_BASE_DOMAIN || "localhost";
  const hostParts = host.split('.');
  const baseParts = baseDomain.split('.');

  if (hostParts.length <= baseParts.length) {
    return '';
  }

  return hostParts.slice(0, hostParts.length - baseParts.length).join('.');
}

export const isAppAllowedInSubdomain = (
  allowedSubdomains: AllowedSubdomains | undefined,
  currentSubdomain: string
): boolean => {
  if (!allowedSubdomains) {
    return true;
  }

  const { excluded, exclusive } = allowedSubdomains;

  if (excluded && excluded.length > 0) {
    if (excluded.includes(currentSubdomain)) {
      return false;
    }
  }

  if (exclusive && exclusive.length > 0) {
    return exclusive.includes(currentSubdomain);
  }

  return true;
}

