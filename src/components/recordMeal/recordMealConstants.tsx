import * as RC from "../restaurants/restaurantConstants";

export interface IRestaurantInfo {
    name: string;
    id: string;
}

export const RestaurantInfo: IRestaurantInfo[] = RC.RestaurantInfo;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export type Order = 'asc' | 'desc';

export function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
    ) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export interface IAllergenNameToImage {
    [x: string]: string;
}

export const AllergenNameToImage: IAllergenNameToImage = {
    "Milk Allergen": "/images/allergen-dairy.png",
    "Eggs Allergen": "/images/allergen-egg.png",
    "Fish Allergen": "/images/allergen-fish.png",
    "Contains Gluten": "/images/allergen-gluten.png",
    "Tree Nuts Allergen": "/images/allergen-nuts.png",
    "Peanut Allergen": "/images/allergen-peanut.png",
    "Seasame": "/images/allergen-sesame.png",
    "Shellfish Allergen": "/images/allergen-shellfish.png",
    "Soy Allergen": "/images/allergen-soy.png",
    "Wheat Allergen": "/images/allergen-wheat.png",
}