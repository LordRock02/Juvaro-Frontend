// en: src/services/authService.ts

// Esta es la estructura que esperamos que el backend nos devuelva
export interface AuthResponse {
    nombre: string;
    apellido: string;
    rol: 'ROLE_ADMIN' | 'ROLE_USER';
    token: string;
}

// Simulación de la función de inicio de sesión
export const iniciarSesionUsuario = (credentials: any): Promise<AuthResponse> => {
    console.log("Simulando inicio de sesión para:", credentials.email);

    return new Promise((resolve) => {
        setTimeout(() => {
            // Devolvemos datos falsos para la prueba
            const fakeResponse: AuthResponse = {
                nombre: "Usuario",
                apellido: "Prueba",
                rol: 'ROLE_ADMIN', // Puedes cambiarlo a 'ROLE_USER' para probar permisos
                token: "jwt-token-de-prueba-12345"
            };
            console.log("Servicio Mock: Devolviendo respuesta exitosa", fakeResponse);
            resolve(fakeResponse);
        }, 1000);
    });
};


export const registrarUsuario = (userData: any): Promise<{ succes: boolean, error?: string }> => {
    console.log("Simulando registro para el usuario:", userData.email);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulamos una respuesta exitosa
            resolve({ succes: true });
        }, 1000);
    });
};