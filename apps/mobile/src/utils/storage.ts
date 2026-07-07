import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "careeros_token";
const USER_KEY = "careeros_user";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function saveUser(user: object) {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getUser<T>(): Promise<T | null> {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

export async function deleteUser() {
  await SecureStore.deleteItemAsync(USER_KEY);
}

export async function clearSession() {
  await Promise.all([deleteToken(), deleteUser()]);
}
