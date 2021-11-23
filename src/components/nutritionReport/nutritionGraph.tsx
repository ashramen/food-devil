import * as React from "react";

import Box from "@mui/material/Box";
import { Layout } from "plotly.js";
import Plot from 'react-plotly.js';

export interface NutritionGraphProps {
    nutrient: string;
    startDate: Date;
    endDate: Date;
    intake: number[];
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
            startDate,
            endDate,
            intake,
            DV,
            unit
        } = this.props;
        const dateList: string[] = [];
        for (let date = new Date(startDate); date < new Date(endDate.getTime() + 24*60*60*1000); date.setDate(date.getDate() + 1)) {
            dateList.push(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
        }

        const record = {
            x: dateList,
            y: intake,
            mode: 'lines+markers',
            name: `Your ${nutrient} Intake (${unit})`,
            line: {
                color: '#003087',
                dash: 'solid',
                width: 4
            },
            marker: {
                size: 10
            }
        };
          
        const DVLine = {
            x: dateList,
            y: Array(dateList.length).fill(DV),
            mode: 'lines+markers',
            name: 'Daily Value',
            line: {
                color: 'magenta',
                dash: 'dashdot',
                width: 4
            },
            marker: {
                size: 10
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
                tickmode: "linear",
                tick0: dateList[0],
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
            },
            plot_bgcolor: "#f5f5f5",
            paper_bgcolor:"#f5f5f5",
        };

        return (
            <Box sx={{ position: "relative", display: "inline-flex" }}>
                <Plot data={data} layout={layout}/>
            </Box>
            
        );
    }
}

export default NutritionGraph;