import { createContext, useReducer, useContext } from "react";

const AuthDispatchContext = createContext();
const AuthStateContext = createContext();

const initialState = {
  isAuthenticated: false,
};

function reducer(state, { payload, type }) {
  switch (type) {
    default:
      throw new Error(`Unhandled action type ${type}`);
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthDispatchContext.Provider>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
}

function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);

  if (context === undefined)
    throw new Error("useAuthDispatch must be used within an AuthProvider");

  return context;
}

function useAuthState() {
  const context = useContext(AuthStateContext);

  if (context === undefined)
    throw new Error("useAuthState must be used within an AuthProvider");

  return context;
}

export { AuthProvider, useAuthDispatch, useAuthState };
