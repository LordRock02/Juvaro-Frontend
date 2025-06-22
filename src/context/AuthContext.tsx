// En: src/context/AuthContext.tsx
import React, { createContext, useContext, Component, type ReactNode } from 'react';
import { AuthEngine } from '../core/AuthEngine'; // Importamos nuestro motor
import type { AuthResponse } from '../services/authService.types';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: any | null;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}
interface AuthProviderState {
  isLoggedIn: boolean;
  currentUser: any | null;
}

export class AuthProvider extends Component<AuthProviderProps, AuthProviderState> {

  private authEngine: AuthEngine;

  constructor(props: AuthProviderProps) {
    super(props);

    this.authEngine = AuthEngine.getInstance();

    this.state = {
      isLoggedIn: this.authEngine.isLoggedIn,
      currentUser: this.authEngine.currentUser,
    };

    // Hacemos "bind" de los métodos para asegurar que 'this' se refiera a la clase
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(authResponse: AuthResponse): void {
    // Llama al motor para ejecutar la lógica...
    this.authEngine.login(authResponse);
    // ...y luego actualiza el estado de React con setState
    this.setState({
      isLoggedIn: this.authEngine.isLoggedIn,
      currentUser: this.authEngine.currentUser,
    });
  }

  logout(): void {
    this.authEngine.logout();
    this.setState({
      isLoggedIn: this.authEngine.isLoggedIn,
      currentUser: this.authEngine.currentUser,
    });
  }

  render() {
    // El valor del contexto combina el estado y los métodos de la clase
    const value = {
      isLoggedIn: this.state.isLoggedIn,
      currentUser: this.state.currentUser,
      login: this.login,
      logout: this.logout,
    };

    return (
      <AuthContext.Provider value={value}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

// El custom hook para consumir el contexto no cambia en absoluto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
