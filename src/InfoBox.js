import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({title, cases, active, isRead, total, ...props}) {

    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRead && 'infoBox--red'} `}>

            <CardContent>
                {/* Title */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                {/* No of cases */}
                <h2 className={`infoBox__cases ${!isRead && 'infoBox__cases--green'} `}>{cases}</h2>
                {/* Total */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>      
        </Card>
    )
}

export default InfoBox
