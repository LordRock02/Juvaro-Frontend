
import type { INavigationStrategy, NavigationLink } from './interfaces/INavigationStrategy';
import * as freeSolidSvgIcons from '@fortawesome/free-solid-svg-icons';

export class UserNavigationStrategy implements INavigationStrategy {
    public getNavigationLinks(): NavigationLink[] {
        // Devuelve una lista de enlaces restringida para un usuario normal
        return [
            { path: '/dashboard', label: 'Dashboard', icon: freeSolidSvgIcons.faChartLine },
            { path: '/ventas', label: 'Ventas', icon: freeSolidSvgIcons.faShoppingCart },
            { path: '/productos', label: 'Productos', icon: freeSolidSvgIcons.faBoxOpen },
        ];
    }
}