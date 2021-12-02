import * as React from "react";

import NutritionProgress, { NutritionProgressProps } from './nutritionProgress';

import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface NutritionCardProps extends NutritionProgressProps {
    nutrient: string;
};

interface NutritionCardStates {
    fade: boolean;
};

class NutritionCard extends React.Component<NutritionCardProps, NutritionCardStates> {
    constructor(props: NutritionCardProps) {
        super(props);
        this.state = {
            fade: false,
        };
    };

    componentDidMount() {
        setTimeout(() => this.setState({ fade: true }), 150 * this.props.index);
    }

    render() {
        const {
            nutrient,
            currentStats,
            DV,
            unit,
            date,
            index,
        } = this.props;
        return (
            <Fade in={this.state.fade}>
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
                            <NutritionProgress currentStats={currentStats} DV={DV} unit={unit} date={date} index={index}/>
                        </Grid>
                    </Grid>
                </Box>
            </Fade>
        );
    }
}

export default NutritionCard;