export function checkCredential(credential: string) {
  if (/^\d+$/.test(credential)) {
    return 'phone';
  } else if (/^[a-zA-Z0-9]+$/.test(credential)) {
    return 'username';
  } else if (/^\S+@\S+\.\S+$/.test(credential)) {
    return 'email';
  }

  return;
}
