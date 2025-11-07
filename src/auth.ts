import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  currentLocation?: string;
  address?: string;
  pincode?: string;
  state?: string;
  district?: string;
  passwordHash: string;
};

const USERS_KEY = 'APP_USERS_V1';

function hashPassword(password: string) {
  // simple non-cryptographic hash for demo purposes only
  let h = 5381;
  for (let i = 0; i < password.length; i++) {
    h = (h * 33) ^ password.charCodeAt(i);
  }
  // convert to positive hex
  return (h >>> 0).toString(16);
}

async function getUsers(): Promise<User[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as User[];
  } catch (e) {
    return [];
  }
}

async function saveUsers(users: User[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function signupUser(data: Omit<User, 'id' | 'passwordHash'> & { password: string }) {
  const users = await getUsers();
  const exists = users.find((u: any) => u.email.toLowerCase() === data.email.toLowerCase());
  if (exists) {
    return { ok: false, error: 'Email already registered' };
  }
  const mobileExists = users.find((u: any) => u.mobile === data.mobile);
  if (mobileExists) {
    return { ok: false, error: 'Mobile number already registered' };
  }

  const newUser: User = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    currentLocation: data.currentLocation,
    address: data.address,
    pincode: data.pincode,
    state: data.state,
    district: data.district,
    passwordHash: hashPassword(data.password),
  };

  users.push(newUser);
  await saveUsers(users);
  return { ok: true, user: newUser };
}

export async function loginUser(email: string, password: string) {
  const users = await getUsers();
  const hash = hashPassword(password);
  const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hash);
  if (!user) return { ok: false, error: 'Invalid credentials' };
  return { ok: true, user };
}

export async function clearUsersForDebug() {
  await AsyncStorage.removeItem(USERS_KEY);
}

export default {
  getUsers,
  saveUsers,
  signupUser,
  loginUser,
};
