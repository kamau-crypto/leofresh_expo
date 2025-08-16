import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";

import { Login } from "@/constants";
import { loginUser } from "@/hooks/login";
import { useStorageState } from "@/hooks/secure_store";
import { useKeyStore } from "@/store/token";
import { useUserStore } from "@/store/user";
import { useRouter } from "expo-router";

interface AuthenthicationContext {
  signIn: ({ password, username }: Login) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}

const useSessionOptions = (): AuthenthicationContext => {
  const router = useRouter();
  const { updateUser } = useUserStore();
  const {
    state: [isLoading, session],
    setValue: setSession,
  } = useStorageState("auth_token");
  const { updateKey, deleteKey } = useKeyStore();

  const signIn = useCallback(
    async ({ password, username }: Login) => {
      const loginResponse = await loginUser({ username, password });
      if (loginResponse) {
        setSession(loginResponse.message);
        updateUser({
          email: loginResponse.user.email,
          full_name: loginResponse.user.full_name,
          username: loginResponse.user.username,
          type: loginResponse.user.type,
          autosubmit: true,
          roles: loginResponse.user.roles,
        });
        updateKey(loginResponse.message);
      }
    },
    [setSession, updateKey, updateUser],
  );

  const signOut = () => {
    deleteKey();
    router.replace("/login");
  };

  return { signIn, signOut, session, isLoading };
};

const AuthContext = createContext<AuthenthicationContext>({
  signIn: async ({ password, username }: Login): Promise<void> => {
    return Promise.resolve();
  },
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function SessionProvider({ children }: PropsWithChildren) {
  const value = useSessionOptions();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}
