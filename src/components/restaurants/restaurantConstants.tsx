export interface IRestaurantInfo {
    name: string;
    id: number;
}

export const RestaurantInfo: IRestaurantInfo[] = [
        {name: "Beyu Blue Coffee", id: 0x616ad5d1d252dea11b9043db},
        {name: "Beyu Cafe at Duke Law", id: 0x616ad5d6d252dea11b904495},
        {name: "Bseisu Coffee Bar", id: 0x616ad5d7d252dea11b9044b5},
        {name: "Cafe", id: 0x616ad5d7d252dea11b9044cb},
        {name: "Cafe 300", id: 0x616ad5e1d252dea11b904646},
        {name: "Freeman Cafe", id: 0x616ad5a1d252dea11b903c44},
        {name: "Ginger + Soy", id: 0x616ad5a2d252dea11b903c6c},
        {name: "Gyotaku", id: 0x616ad5a6d252dea11b903cfd},
        {name: "Il Forno", id: 0x616ad5ddd252dea11b9045bb},
        {name: "J.B.'s Roast & Chops", id: 0x616ad5e0d252dea11b90461b},
        {name: "Marketplace", id: 0x616ad5a7d252dea11b903d23},
        {name: "McDonald's", id: 0x616ad5b3d252dea11b903f19},
        {name: "Panda Express", id: 0x616ad5b6d252dea11b903f96},
        {name: "Panera Bread Company", id: 0x616ad5b8d252dea11b903fd8},
        {name: "Red Mango", id: 0x616ad5bed252dea11b9040ef},
        {name: "Saladalia @ The Perk", id: 0x616ad5c7d252dea11b90424e},
        {name: "Sanford Deli", id: 0x616ad5cbd252dea11b9042d6},
        {name: "Sazon", id: 0x616ad5ced252dea11b904366},
        {name: "Sprout", id: 0x616ad5cfd252dea11b904394},
        {name: "Tandoor Indian Cuisine", id: 0x616ad5d0d252dea11b9043c5},
        {name: "The Devils Krafthouse", id: 0x616ad5c1d252dea11b904159},
        {name: "The Farmstead", id: 0x616ad5c3d252dea11b90419b},
        {name: "The Loop Pizza Grill", id: 0x616ad598d252dea11b903aca},
        {name: "The Pitchfork", id: 0x616ad5c3d252dea11b9041a7},
        {name: "The Skillet", id: 0x616ad59ed252dea11b903bd6},
        {name: "Trinity Cafe", id: 0x616ad5bad252dea11b90404a},
        {name: "Twinnie's", id: 0x616ad5dbd252dea11b90455f},
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