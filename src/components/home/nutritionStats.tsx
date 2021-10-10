import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export interface NutritionStatsProps {
    currentStats: number;
    DV: number;
    unit: string;
};

interface NutritionStatsStates {
    progress: number;
};

class NutritionStats extends React.Component<NutritionStatsProps, NutritionStatsStates> {
    constructor(props: NutritionStatsProps) {
        super(props);
        this.state = {
            progress: 0,
        };
    };

    componentDidMount() {
        const percentage: number = Math.min(this.props.currentStats / this.props.DV * 100, 100);
        const barFillSpeed: number = 10;
        setInterval(() => { 
            this.setState({
                progress: this.state.progress >= percentage - barFillSpeed? percentage : this.state.progress + barFillSpeed,
            });
        }, 100);
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
                    color={currentStats > DV? 'error' : 'success'}
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

export default NutritionStats;