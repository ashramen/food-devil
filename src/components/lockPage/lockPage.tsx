import React from 'react';

import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';

import './styles.css';

class LockPage extends React.Component{
    render() {
        return (
            <>
                <Box mt={30}>
                    <>
                        <LockIcon style={{
                            fontSize: 200,
                        }}/>
                        <div className='text'>Please log in to access this feature.</div>
                    </>
                </Box>
            </>
        );
    }
}

export default LockPage;