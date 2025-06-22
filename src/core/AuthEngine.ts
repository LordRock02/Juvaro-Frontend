// En: src/core/AuthEngine.ts
import type { AuthResponse } from "../services/authService.types";

export class AuthEngine {
    private static instance: AuthEngine;

    public isLoggedIn: boolean = false;
    public currentUser: any | null = null;

    private constructor() {
        this.checkInitialState();
    }

    public static getInstance(): AuthEngine {
        if (!AuthEngine.instance) {
            AuthEngine.instance = new AuthEngine();
        }
        return AuthEngine.instance;
    }

    private checkInitialState(): void {
        const token = localStorage.getItem('token');
        if (token) {
            this.isLoggedIn = true;
            const userDataString = localStorage.getItem('user_data');
            if (userDataString) {
                try {
                    this.currentUser = JSON.parse(userDataString);
                } catch {
                    localStorage.removeItem('user_data');
                    this.currentUser = null;
                }
            }
        } else {
            this.isLoggedIn = false;
            this.currentUser = null;
        }
    }

    // --- MÉTODO LOGIN CORREGIDO ---
    public login(authResponse: AuthResponse): { isLoggedIn: boolean, currentUser: any } {
        console.log("AuthEngine: Datos recibidos en el método login:", authResponse);

        localStorage.setItem('token', authResponse.token);
        
        // --- CAMBIO CLAVE ---
        // Ahora guardamos el objeto 'authResponse' completo, ya que contiene los datos del usuario directamente.
        // La condición simplemente verifica que la respuesta no sea nula.
        if (authResponse) {
            // Guardamos todo el objeto de respuesta como los datos del usuario.
            localStorage.setItem('user_data', JSON.stringify(authResponse));
            this.currentUser = authResponse;
            console.log("AuthEngine: user_data guardado en localStorage.");
        } else {
            localStorage.removeItem('user_data');
            this.currentUser = null;
            console.warn("AuthEngine: La respuesta de login estaba vacía. 'user_data' no se guardó.");
        }
        
        this.isLoggedIn = true;
        return { isLoggedIn: this.isLoggedIn, currentUser: this.currentUser };
    }

    public logout(): { isLoggedIn: boolean, currentUser: any } {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        this.isLoggedIn = false;
        this.currentUser = null;
        return { isLoggedIn: this.isLoggedIn, currentUser: this.currentUser };
    }
}
