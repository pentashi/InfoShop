import React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

const CustomPagination = ({ dataLinks, dataLastPage, refreshTable }) => {
    const handleChange = (event, page) => {
        const selectedPage = dataLinks.find(item => item.label === page.toString());
        if (selectedPage && selectedPage.url) {
          refreshTable(selectedPage.url)
        }
      };
  
    const prevUrl = dataLinks.find((item) => item.label === "&laquo; Previous")?.url;
    const nextUrl = dataLinks.find((item) => item.label === "Next &raquo;")?.url;

  return (
    <Pagination
        count={dataLastPage} // Exclude "Previous" and "Next" from the count
        page={dataLinks.findIndex((item) => item.active && item.url !== null)} // Active page index
        onChange={handleChange}
        shape="rounded"
        renderItem={(item) => {
            if (item.url === prevUrl || item.url === nextUrl) {
            return (
                <PaginationItem
                component="button"
                onClick={() => handleChange(null, item.label)}
                >
                {item.label}
                </PaginationItem>
            );
            }
            return <PaginationItem {...item} />;
        }}
        />
  );
};

export default CustomPagination;