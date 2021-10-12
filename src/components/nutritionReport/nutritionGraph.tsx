import * as React from "react";

import Box from "@mui/material/Box";
import { Layout } from "plotly.js";
import Plot from 'react-plotly.js';

export interface NutritionGraphProps {
    nutrient: string;
    numPreviousDays: number;
    DV: number;
    unit: string;
};

interface NutritionGraphStates {
};

class NutritionGraph extends React.Component<NutritionGraphProps, NutritionGraphStates> {
    constructor(props: NutritionGraphProps) {
        super(props);
        this.state = {
        };
    };

    render() {
        const {
            nutrient,
            numPreviousDays,
            DV,
            unit
        } = this.props;
        const today: Date = new Date();
        const dateList: string[] = [];
        for (let days=numPreviousDays-1; days>=0; days--) {
            const newDate: Date = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));
            dateList.push(`${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`);
        }

        // TODO: Change this to real data
        const intake: number[] = [DV*0.6, DV*1.2, DV*0.8, DV, DV, DV*0.9, DV*1.2]

        const record = {
            x: dateList,
            y: intake,
            mode: 'lines',
            name: `Your ${nutrient} Intake (${unit})`,
            color: '#003087',
            line: {
                dash: 'solid',
                width: 4
            }
        };
          
        const DVLine = {
            x: dateList,
            y: Array(numPreviousDays).fill(DV),
            mode: 'lines',
            name: 'Daily Value',
            line: {
                dash: 'dashdot',
                width: 4
            }
        };
          
        const data = [record, DVLine];
          
        const layout: Partial<Layout> = {
            margin: {
                t: 25
            },
            autosize: false,
            width: 1000,
            height: 550,
            font: {
                family: 'Arial',
                size: 18,
                color: 'black'
            },
            xaxis: {
                range: [dateList[0], dateList[dateList.length - 1]],
                autorange: false
            },
            yaxis: {
                autorange: true
            },
            legend: {
                orientation: "h",
                y: 1.1,
                font: {
                    size: 14
                }
            }
        };

        return (
            <Box sx={{ position: "relative", display: "inline-flex" }}>
                <Plot data={data} layout={layout}/>
            </Box>
            
        );
    }
}

export default NutritionGraph;