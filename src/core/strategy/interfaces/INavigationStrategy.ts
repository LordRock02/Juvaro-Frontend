export interface NavigationLink {
    path: string;
    label: string;
    icon: any;
}
export interface INavigationStrategy {
    getNavigationLinks(): NavigationLink[];
}
