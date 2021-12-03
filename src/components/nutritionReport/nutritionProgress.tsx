import * as React from "react";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export interface NutritionProgressProps {
    currentStats: number;
    DV: number;
    unit: string;
    date: Date;
    index: number;
};

interface NutritionProgressStates {
    progress: number;
};

class NutritionProgress extends React.Component<NutritionProgressProps, NutritionProgressStates> {
    constructor(props: NutritionProgressProps) {
        super(props);
        this.state = {
            progress: this.props.currentStats === 0? 100 : 0,
        };
    };

    updateData() {
        let percentage: number = Math.min(this.props.currentStats / this.props.DV * 100, 100);
        if (this.props.currentStats === 0) {
            percentage = 100;
        }
        this.setState({
            progress: percentage
        })
    }

    componentDidMount() {
        setTimeout(() => this.updateData(), 150 * this.props.index);
    }

    componentDidUpdate(prevProps: NutritionProgressProps) {
        if (this.props.currentStats !== prevProps.currentStats) {
            this.updateData();
        }
    }

    render() {
        const {
            currentStats,
            DV,
            unit
        } = this.props;
        return (
            <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                    variant="determinate"
                    style={{color: currentStats > DV? '	#c00000' : currentStats === 0? 'gray' : '#006400'}}
                    size={130}
                    thickness={6}
                    value={this.state.progress} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Typography variant="caption" fontSize={18} fontFamily='Lucida Grande' component="div">
                        {`${currentStats} ${unit}`}
                    </Typography>
                </Box>
            </Box>
        );
    }
}

export default NutritionProgress;