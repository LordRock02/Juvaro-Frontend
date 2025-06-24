import type { INavigationStrategy, NavigationLink } from './interfaces/INavigationStrategy';
import * as freeSolidSvgIcons from '@fortawesome/free-solid-svg-icons';

export class AdminNavigationStrategy implements INavigationStrategy {
    public getNavigationLinks(): NavigationLink[] {
        // Devuelve la lista completa de enlaces para un administrador
        return [
            { path: '/dashboard', label: 'Dashboard', icon: freeSolidSvgIcons.faChartLine },
            { path: '/ventas', label: 'Ventas', icon: freeSolidSvgIcons.faShoppingCart },
            { path: '/productos', label: 'Productos', icon: freeSolidSvgIcons.faBoxOpen },
            { path: '/departamentos', label: 'Departamentos', icon: freeSolidSvgIcons.faIndustry },
            { path: '/usuarios', label: 'Usuarios', icon: freeSolidSvgIcons.faUsers },
        ];
    }
}
