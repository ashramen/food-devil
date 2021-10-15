import * as React from "react";

import NutritionProgress, { NutritionProgressProps } from './nutritionProgress';

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface NutritionCardProps extends NutritionProgressProps {
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
            unit,
            date,
        } = this.props;
        return (
            <Box sx={{
                maxWidth: 250,
            }}>
                <Grid container>
                    <Grid item xs={12} mt={3}>
                        <Typography fontSize={25} fontFamily='Lucida Grande'>{nutrient}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='caption' fontSize={15}>Daily Value: {DV} {unit}</Typography>
                    </Grid>
                    <Grid item xs={12} mt={3} mb={3}>
                        <NutritionProgress currentStats={currentStats} DV={DV} unit={unit} date={date}/>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default NutritionCard;