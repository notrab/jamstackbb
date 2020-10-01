import { createContext, useReducer, useContext } from "react";

const AuthDispatchContext = createContext();
const AuthStateContext = createContext();

const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

function reducer(state, { payload, type }) {
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
      };
    case LOGOUT:
      return initialState;
    default:
      throw new Error(`Unhandled action type ${type}`);
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async ({ email, password }) => {
    const token = "abc123";
    const user = { name: "Jamie" };

    dispatch({ type: LOGIN_SUCCESS, payload: { token, user } });
  };

  const createUser = async ({ name, email, password }) => {
    const token = "abc123";
    const user = { name: "Jamie" };

    dispatch({ type: LOGIN_SUCCESS, payload: { token, user } });
  };

  const logout = () => dispatch({ type: LOGOUT });

  return (
    <AuthDispatchContext.Provider value={{ login, createUser, logout }}>
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
