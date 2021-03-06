import React from 'react';
import { Pagination } from 'react-bootstrap';
import './paginationPost.css'

interface PaginationPostType {
    totalPage: number,
    currentPage: number,
    pagi: (number: number) => void
}

const PaginationPost: React.FC<PaginationPostType> = ({totalPage, currentPage, pagi}): JSX.Element => {
    const items: any = [];
    
    const kindOfPagination = totalPage <= 5;
    if(kindOfPagination) {
        for (let number = 1; number <= totalPage; number++) {
            items.push(
                <Pagination.Item className='pagi-style' onClick={() => pagi(number)} key={number} active={number === currentPage}>
                {number}
                </Pagination.Item>,
            );
        }
    }    

    return (
        <>
            <Pagination className='mt-2' size='sm'>
                {items}
            </Pagination>
        </>
    )
}

export default PaginationPost;