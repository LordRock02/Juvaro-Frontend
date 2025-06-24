import type { INavigationStrategy, NavigationLink } from './interfaces/INavigationStrategy';
import * as freeSolidSvgIcons from '@fortawesome/free-solid-svg-icons';

export class UserNavigationStrategy implements INavigationStrategy {
    public getNavigationLinks(): NavigationLink[] {
        return [
            { path: '/ordenes', label: 'Compras', icon: freeSolidSvgIcons.faShoppingBag },
            { path: '/store', label: 'Tienda', icon: freeSolidSvgIcons.faStore },
        ];
    }
}