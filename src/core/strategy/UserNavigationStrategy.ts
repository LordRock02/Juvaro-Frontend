import type { INavigationStrategy, NavigationLink } from './interfaces/INavigationStrategy';
import * as freeSolidSvgIcons from '@fortawesome/free-solid-svg-icons';

export class UserNavigationStrategy implements INavigationStrategy {
    public getNavigationLinks(): NavigationLink[] {
        return [
            { path: '/ordenes', label: 'Dashboard', icon: freeSolidSvgIcons.faChartLine },
            { path: '/store', label: 'Tienda', icon: freeSolidSvgIcons.faStore },
        ];
    }
}