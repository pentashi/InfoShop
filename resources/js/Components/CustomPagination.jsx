import React from 'react';
import { Button, Grid } from '@mui/material';

const CustomPagination = ({ dataLinks, dataLastPage, refreshTable }) => {

    return (
        <>
            <Grid spacing={1} container>
            {dataLinks?.map((link, index) => (
                <Button
                    sx={{ padding: '4px 8px', minWidth: '5px', borderRadius: "10px" }}
                    key={index}
                    variant={link.active ? "contained" : "text"}
                    onClick={() => {
                        refreshTable(link.url);
                    }}
                >
                    {link.label.includes('Next') ? (
                        <span>{'>>'}</span>
                    ) : link.label.includes('Previous') ? (
                        <span>{'<<'}</span>
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                    )}
                </Button>
            ))}
            </Grid>
        </>
    );
};

export default CustomPagination;