import * as React from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {Typography, Grid2 as Grid} from '@mui/material';

 export default function Dashboard({user}) {
    const auth = usePage().props.auth.user
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <Grid container spacing={2}>
                <Grid size={3}>
                    <Card>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Total sales
                        </Typography>
                        <Typography variant="h5" component="div">
                        100K
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid size={3}>
                    <Card>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Total sales
                        </Typography>
                        <Typography variant="h5" component="div">
                        100K
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid size={3}>
                    <Card>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Total sales
                        </Typography>
                        <Typography variant="h5" component="div">
                        100K
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid size={3}>
                    <Card>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Total sales
                        </Typography>
                        <Typography variant="h5" component="div">
                        100K
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
        </AuthenticatedLayout>
    );
}