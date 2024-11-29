import React from 'react';
import { Button } from '@mui/material';

const CustomPagination = ({ dataLinks, dataLastPage, refreshTable}) => {

  return (
      <>
          {dataLinks?.map((link, index) => (
              <Button
              sx={{padding:'2', minWidth:'30px'}}
                  key={index}
                  variant={link.active ? "contained" : "text"}
                  onClick={() => {
                      refreshTable(link.url);
                  }}
                  
              >
                <span dangerouslySetInnerHTML={{__html:link.label}}></span>
              </Button>
          ))}
      </>
  );
};

export default CustomPagination;