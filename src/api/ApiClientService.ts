// En: src/api/ApiClientService.ts

import axios, { type AxiosInstance } from 'axios';

/**
 * Esta clase implementa el Patrón Singleton de forma "clásica".
 * Se usa una EXPORTACIÓN NOMBRADA para que sea explícito qué se está compartiendo.
 */
export class ApiClientService { // <-- La palabra clave 'export' está aquí
    private static instance: ApiClientService;
    public readonly axiosInstance: AxiosInstance;

    private constructor() {
        console.log("Creando la instancia de ApiClientService por primera y única vez...");
        
        this.axiosInstance = axios.create({
            baseURL: 'http://149.130.162.100:8080',//'http://Localhost:8080',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    public static getInstance(): ApiClientService {
        if (!ApiClientService.instance) {
            ApiClientService.instance = new ApiClientService();
        }
        return ApiClientService.instance;
    }
}