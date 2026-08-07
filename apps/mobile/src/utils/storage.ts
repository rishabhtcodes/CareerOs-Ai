import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "careeros_token";
const USER_KEY = "careeros_user";

export async function saveToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function saveUser(user: object) {
  if (Platform.OS === "web") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  }
}

export async function getUser<T>(): Promise<T | null> {
  const raw = Platform.OS === "web" ? localStorage.getItem(USER_KEY) : await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

export async function deleteUser() {
  if (Platform.OS === "web") {
    localStorage.removeItem(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
}

export async function clearSession() {
  await Promise.all([deleteToken(), deleteUser()]);
}
