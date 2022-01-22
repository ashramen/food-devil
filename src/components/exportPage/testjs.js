import { ExportToCsv } from 'export-to-csv';

const csvExporter = new ExportToCsv({
  showLabels: true,
  headers: ['First', 'Second'],
});
const data = [];
csvExporter.generateCsv(data);

//////

var arr = [{"Calories":{"intake":0,"DV":2000,"unit":"cal"},"Fat":{"intake":0,"DV":78,"unit":"g"},"Saturated Fat":{"intake":0,"DV":20,"unit":"g"},"Trans Fat":{"intake":0,"DV":2,"unit":"g"},"Cholesterol":{"intake":0,"DV":300,"unit":"mg"},"Sodium":{"intake":0,"DV":2300,"unit":"mg"},"Carbohydrates":{"intake":0,"DV":275,"unit":"g"},"Fiber":{"intake":0,"DV":28,"unit":"g"},"Sugar":{"intake":0,"DV":50,"unit":"g"},"Protein":{"intake":0,"DV":50,"unit":"g"}},{"Calories":{"intake":0,"DV":2000,"unit":"cal"},"Fat":{"intake":0,"DV":78,"unit":"g"},"Saturated Fat":{"intake":0,"DV":20,"unit":"g"},"Trans Fat":{"intake":0,"DV":2,"unit":"g"},"Cholesterol":{"intake":0,"DV":300,"unit":"mg"},"Sodium":{"intake":0,"DV":2300,"unit":"mg"},"Carbohydrates":{"intake":0,"DV":275,"unit":"g"},"Fiber":{"intake":0,"DV":28,"unit":"g"},"Sugar":{"intake":0,"DV":50,"unit":"g"},"Protein":{"intake":0,"DV":50,"unit":"g"}},{"Calories":{"intake":0,"DV":2000,"unit":"cal"},"Fat":{"intake":0,"DV":78,"unit":"g"},"Saturated Fat":{"intake":0,"DV":20,"unit":"g"},"Trans Fat":{"intake":0,"DV":2,"unit":"g"},"Cholesterol":{"intake":0,"DV":300,"unit":"mg"},"Sodium":{"intake":0,"DV":2300,"unit":"mg"},"Carbohydrates":{"intake":0,"DV":275,"unit":"g"},"Fiber":{"intake":0,"DV":28,"unit":"g"},"Sugar":{"intake":0,"DV":50,"unit":"g"},"Protein":{"intake":0,"DV":50,"unit":"g"}},{"Calories":{"intake":0,"DV":2000,"unit":"cal"},"Fat":{"intake":0,"DV":78,"unit":"g"},"Saturated Fat":{"intake":0,"DV":20,"unit":"g"},"Trans Fat":{"intake":0,"DV":2,"unit":"g"},"Cholesterol":{"intake":0,"DV":300,"unit":"mg"},"Sodium":{"intake":0,"DV":2300,"unit":"mg"},"Carbohydrates":{"intake":0,"DV":275,"unit":"g"},"Fiber":{"intake":0,"DV":28,"unit":"g"},"Sugar":{"intake":0,"DV":50,"unit":"g"},"Protein":{"intake":0,"DV":50,"unit":"g"}},{"Calories":{"intake":0,"DV":2000,"unit":"cal"},"Fat":{"intake":0,"DV":78,"unit":"g"},"Saturated Fat":{"intake":0,"DV":20,"unit":"g"},"Trans Fat":{"intake":0,"DV":2,"unit":"g"},"Cholesterol":{"intake":0,"DV":300,"unit":"mg"},"Sodium":{"intake":0,"DV":2300,"unit":"mg"},"Carbohydrates":{"intake":0,"DV":275,"unit":"g"},"Fiber":{"intake":0,"DV":28,"unit":"g"},"Sugar":{"intake":0,"DV":50,"unit":"g"},"Protein":{"intake":0,"DV":50,"unit":"g"}},{"Calories":{"intake":0,"DV":2000,"unit":"cal"},"Fat":{"intake":0,"DV":78,"unit":"g"},"Saturated Fat":{"intake":0,"DV":20,"unit":"g"},"Trans Fat":{"intake":0,"DV":2,"unit":"g"},"Cholesterol":{"intake":0,"DV":300,"unit":"mg"},"Sodium":{"intake":0,"DV":2300,"unit":"mg"},"Carbohydrates":{"intake":0,"DV":275,"unit":"g"},"Fiber":{"intake":0,"DV":28,"unit":"g"},"Sugar":{"intake":0,"DV":50,"unit":"g"},"Protein":{"intake":0,"DV":50,"unit":"g"}},{"Calories":{"intake":750,"DV":2000,"unit":"cal"},"Fat":{"intake":12,"DV":78,"unit":"g"},"Saturated Fat":{"intake":8,"DV":20,"unit":"g"},"Trans Fat":{"intake":0,"DV":2,"unit":"g"},"Cholesterol":{"intake":5,"DV":300,"unit":"mg"},"Sodium":{"intake":750,"DV":2300,"unit":"mg"},"Carbohydrates":{"intake":143,"DV":275,"unit":"g"},"Fiber":{"intake":4,"DV":28,"unit":"g"},"Sugar":{"intake":44,"DV":50,"unit":"g"},"Protein":{"intake":19,"DV":50,"unit":"g"}}];
arr.forEach(function (dateItem) {
  dateItem.
  Object.keys(dayItem).forEach(key => console.log(val.DV))
  console.log(dateItem);
});



for (const dayStat of arr){
  Object.keys(dayStat).forEach(key => {
    dayStat[key + " unit"] = dayStat[key].unit;
    dayStat[key] = dayStat[key].intake;
    
})
}



