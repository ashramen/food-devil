import * as React from "react";
import Typography from "@mui/material/Typography";
import NutritionStats, { NutritionStatsProps } from './nutritionStats';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

interface NutritionCardProps extends NutritionStatsProps {
    nutrient: string;
};

interface NutritionCardStates {
};

class NutritionCard extends React.Component<NutritionCardProps, NutritionCardStates> {
    constructor(props: NutritionCardProps) {
        super(props);
        this.state = {
        };
    };

    render() {
        const {
            nutrient,
            currentStats,
            DV,
            unit
        } = this.props;
        return (
            <Box sx={{
                maxWidth: 250,
            }}>
                <Grid container>
                    <Grid item xs={12} mt={3}>
                        <Typography fontSize={25} fontFamily='Open Sans'>{nutrient}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='caption' fontSize={15}>Daily Value: {DV} {unit}</Typography>
                    </Grid>
                    <Grid item xs={12} mt={3} mb={3}>
                        <NutritionStats currentStats={currentStats} DV={DV} unit={unit}/>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default NutritionCard;