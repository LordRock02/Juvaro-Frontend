import type { INavigationStrategy, NavigationLink } from './interfaces/INavigationStrategy';
import * as freeSolidSvgIcons from '@fortawesome/free-solid-svg-icons';

export class AdminNavigationStrategy implements INavigationStrategy {
  public getNavigationLinks(): NavigationLink[] {
    return [
      { path: '/ventas', label: 'Ventas', icon: freeSolidSvgIcons.faMoneyBillTrendUp },
      { path: '/productos', label: 'Productos', icon: freeSolidSvgIcons.faBoxOpen },
      { path: '/departamentos', label: 'Departamentos', icon: freeSolidSvgIcons.faBuilding },
      { path: '/usuarios', label: 'Usuarios', icon: freeSolidSvgIcons.faUsers },
    ];
  }
}