import React from 'react';
import Sidebar from '../sidebar/sidebar';
import { Box } from "@mui/material";
import './recordMeal.css';
import RestaurantsTable from "./restaurantsTable";

class RecordMeal extends React.Component {

    render() {
        return (
            <>
                <Sidebar page='record meal'/>
                <Box className="container">
                    <h1>Record Meal</h1>
                    <RestaurantsTable />
                </Box>
            </>
        );
    }
}

export default RecordMeal;