// app/components/Pagination.tsx
type Props = {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalItems, pageSize, onPageChange }: Props) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentGroup = Math.floor((currentPage - 1) / 5);
    //const currentGroup = Math.floor((currentPage - 1) / 10);
    //const groupStart = currentGroup * 10 + 1;
    //const groupEnd = Math.min(groupStart + 9, totalPages);
    const groupStart = currentGroup * 5 + 1;
    const groupEnd = Math.min(groupStart + 4, totalPages);


    const handleClick = (p: number) => {
        if (p >= 1 && p <= totalPages) onPageChange(p);
    };

    return (
        <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
            <div className="dataTables_paginate paging_simple_numbers">
                <ul className="pagination">
                    <li className={`paginate_button page-item previous ${groupStart <= 1 ? 'disabled' : ''}`}>
                        <a href="#"  onClick={() => handleClick(groupStart - 5)}
                        className="page-link"><i className="previous"></i></a> {/*이전5개*/}
                    </li>
                    {
                        Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => (
                            <li key={i} className={`paginate_button page-item ${currentPage === groupStart + i ? 'active' : ''}`}>
                                <a href="#" 
                                onClick={() => handleClick(groupStart + i)}
                                className="page-link" >{groupStart + i}</a>
                            </li>
                        ))
                    }
                    <li className={`paginate_button page-item next ${groupEnd >= totalPages ? 'disabled' : ''}`}>
                        <a href="#" 
                        onClick={() => handleClick(groupStart + 5)} 
                        className="page-link"><i className="next"></i></a> {/*다음5개*/}
                    </li>
                </ul>
            </div>
        </div>
    );
}



                    //---------------------------- 이전페이지
                    //<li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`}></li>
                    //<li className={`paginate_button page-item previous disabled`}>
                    //    <a href="#" onClick={() => handleClick(currentPage - 1)} 
                    //    className="page-link"><i className="previous"></i></a> {/*이전*/}
                    //</li>

                    //---------------------------- 다음페이지
                    //<li className={`paginate_button page-item next ${currentPage === totalPages ? 'disabled' : ''}`}>
                    //    <a href="#" 
                    //    onClick={() => handleClick(currentPage + 1)} 
                    //    className="page-link"><i className="next"></i></a> {/*다음*/}
                    //</li>

