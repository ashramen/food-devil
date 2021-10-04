import * as React from 'react';
import Button from '@mui/material/Button';

interface exampleProps {
    display: string;
}

interface exampleStates {
    state1: number;
}

class Example extends React.Component<exampleProps, exampleStates>{
    constructor(props: exampleProps) {
        super(props);
        this.state = {
            state1: 0
        };
    }

    render() {
        return (
            <Button variant="contained">{this.props.display}</Button>
        );
    }
}

export default Example;