// en: src/lib/validation.ts

// Por ahora, esta función no hará nada, solo simulará que la validación es correcta.
export const validarSignInForm = (formData: any): any => {
    console.log("Validación de formulario omitida (usando placeholder)...", formData);
    return {}; // Devolvemos un objeto vacío, que significa "sin errores"
};

export const validarSignUpForm = (formData: any): any => {
    console.log("Validación de SignUp omitida (usando placeholder)...", formData);
    // Devolvemos un objeto vacío para simular que no hay errores
    return {};
};
