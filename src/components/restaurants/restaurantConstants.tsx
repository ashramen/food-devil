export interface IRestaurantInfo {
    name: string;
    id: string;
    location: string;
}

export const RestaurantInfo: IRestaurantInfo[] = [
    { name: "Beyu Blue Coffee", id: "616ad5d1d252dea11b9043db", location: "Bryan Center"},
    { name: "Beyu Cafe at Duke Law", id: "616ad5d6d252dea11b904495", location: "Law School" },
    { name: "Bseisu Coffee Bar", id: "616ad5d7d252dea11b9044b5", location: "Wilkinson Building" },
    { name: "Cafe", id: "616ad5d7d252dea11b9044cb", location: "Brodhead Center" },
    { name: "Cafe 300", id: "616ad5e1d252dea11b904646", location: "300 Swift Ave" },
    { name: "Freeman Cafe", id: "616ad5a1d252dea11b903c44", location: "Freeman Center for Jewish Life" },
    { name: "Ginger + Soy", id: "616ad5a2d252dea11b903c6c", location: "Brodhead Center" },
    { name: "Gyotaku", id: "616ad5a6d252dea11b903cfd", location: "Brodhead Center" },
    { name: "Il Forno", id: "616ad5ddd252dea11b9045bb", location: "Brodhead Center" },
    { name: "J.B.'s Roast & Chops", id: "616ad5e0d252dea11b90461b", location: "Brodhead Center" },
    { name: "Marketplace", id: "616ad5a7d252dea11b903d23", location: "East Campus Union" },
    { name: "McDonald's", id: "616ad5b3d252dea11b903f19", location: "Bryan Center" },
    { name: "Panda Express", id: "616ad5b6d252dea11b903f96", location: "Bryan Center" },
    { name: "Panera Bread Company", id: "616ad5b8d252dea11b903fd8", location: "Brodhead Center" },
    { name: "Red Mango", id: "616ad5bed252dea11b9040ef", location: "Wilson Recreation Center" },
    { name: "Saladalia @ The Perk", id: "616ad5c7d252dea11b90424e", location: "Bostock Library" },
    { name: "Sanford Deli", id: "616ad5cbd252dea11b9042d6", location: "Sanford Institute" },
    { name: "Sazon", id: "616ad5ced252dea11b904366", location: "Brodhead Center" },
    { name: "Sprout", id: "616ad5cfd252dea11b904394", location: "Brodhead Center" },
    { name: "Tandoor Indian Cuisine", id: "616ad5d0d252dea11b9043c5", location: "Brodhead Center" },
    { name: "The Devils Krafthouse", id: "616ad5c1d252dea11b904159", location: "Brodhead Center" },
    { name: "The Farmstead", id: "616ad5c3d252dea11b90419b", location: "Brodhead Center" },
    { name: "The Loop Pizza Grill", id: "616ad598d252dea11b903aca", location: "Bryan Center" },
    { name: "The Pitchfork", id: "616ad5c3d252dea11b9041a7", location: "McClendon Tower" },
    { name: "The Skillet", id: "616ad59ed252dea11b903bd6", location: "Brodhead Center" },
    { name: "Trinity Cafe", id: "616ad5bad252dea11b90404a", location: "East Campus Union" },
    { name: "Twinnie's", id: "616ad5dbd252dea11b90455f", location: "CIEMAS" },
]

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

export function getFormattedDate(date: Date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}