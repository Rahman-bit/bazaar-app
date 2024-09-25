import React, { useState, useEffect } from 'react';
import { Pagination, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faDownload, faEye, faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { PDFDownloadLink, Document } from '@react-pdf/renderer';
import Daywiseplan from '../../pages/itinerary/dayWisePlan';
import { useNavigate } from 'react-router-dom';
import DeleteSelectedItem from '../../Utilities/deleteSelectedItem';
import ViewMyCustomer from '../../Utilities/ViewMyCustomer';
import CreateNewCustomer from '../../Utilities/CreateNewCustomer';

interface CustomerData {
  customerName: string;
  dateOfIssue: string;
  itineraryTitle: string;
  mobileNumber: string;
  budgetForTrip: string;
  changestatus: string;
  id: string;
}

interface DynamicPaginationProps {
  tableData: CustomerData[];
  category: string;
  isDelete? : () => void;
}

const DynamicPagination: React.FC<DynamicPaginationProps> = ({ tableData, category, isDelete }) => {
    // Myitinerary
  const [data, setData] = useState<CustomerData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = 2;
  const navigate = useNavigate();   

    // Inovice 
  const [selectedJourney] = useState("invoice");
  const [selectedId, setSelectedId] = useState("" as any)
  const [changeModalshow, setChangeModalShow] = useState(false);

  // Inovice customer
  const [selectedCustomerJourney, setselectedCustomerJourney] = useState<string>("");
  const [selectedCustomerId, setselectedCustomerId] = useState<string>("");
  const [viewCustomer, setViewCustomer] = useState(false)
  const [viewCustomerData, setViewCustomerData] = useState([] as any)
  const [createNewCustomerModalShow, setCreateNewCustomerModalShow] = useState(false as any);

  useEffect(() => {
    if (tableData.length > 0) {
      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      const currentRecords = tableData.slice(indexOfFirstRecord, indexOfLastRecord);
      setData(currentRecords);
    }
  }, [currentPage, tableData]);

  const totalPages = Math.ceil(tableData.length / recordsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    let items: JSX.Element[] = [];
    const maxVisiblePages = 4;
    let startPage: number, endPage: number;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage === 1) {
        endPage = Math.min(maxVisiblePages, totalPages);
      }

      if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className='d-flex justify-content-end'>
        <Pagination.First onClick={() => handlePageChange(1)} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} />
        {items}
        <Pagination.Next onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
      </Pagination>
    );
  };

  const handleView = (item: any) => {
    // Handle the view action (e.g., show a modal)
  };

  const MyDoc = (pdfdata: any) => (
    <Document>
      <Daywiseplan createItinerary={pdfdata} />
    </Document>
  );

  const handleUpdateInvoice = (id:any) => {
    navigate(`/invoice/update/${id}`);
}
const handleDownloadInvoice = (id:any) => {

}
useEffect(() => {
    if (typeof isDelete === 'function') isDelete();
}, [changeModalshow])


// Inovice
const handleChangeClose = () => setChangeModalShow(false);
const handleDelteInvoice = (id: any) => {
    setSelectedId(id)
    setChangeModalShow(true)
}
// const MyDoc = (pdfdata: any) => (
//     <Document>
//         <DownloadBill billData = {pdfdata}/>
//     </Document>
// );

// Inovice cutomer 
const handleDeleteCustomer = (journey: any, id: any) => {
    setChangeModalShow(true)
    setselectedCustomerJourney(journey)
    setselectedCustomerId(id)
  }
  const viewHandler = (data: any) => {
    setViewCustomer(true)
    setViewCustomerData(data)
  }
 const handleViewClose = () => setViewCustomer(false);

 const handleUpdateCustomer = (id: any) => {
    navigate(`/customer/update/${id}`)
  }

  const renderTableContent = () => {
    if (category === 'itinerary') {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th># ID</th>
              <th>Created Date</th>
              <th>Itinerary Title</th>
              <th>Customer Name</th>
              <th>Mobile Number</th>
              <th>Budget / Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + (currentPage - 1) * recordsPerPage}</td>
                  <td>{item.dateOfIssue}</td>
                  <td>{item.itineraryTitle}</td>
                  <td>{item.customerName}</td>
                  <td>{item.mobileNumber}</td>
                  <td>{item.budgetForTrip}</td>
                  <td>{item.changestatus === 'In process' ? 'In Progress' : item.changestatus}</td>
                  <td className='itinerary_action_wrapper'>
                    <FontAwesomeIcon icon={faCopy} />
                    <FontAwesomeIcon icon={faEye} onClick={() => handleView(item)} />
                    <PDFDownloadLink document={<MyDoc pdfdata={item} />} fileName={item.itineraryTitle}>
                      {({ loading }) => (loading ? 'Loading...' : <FontAwesomeIcon icon={faDownload} />)}
                    </PDFDownloadLink>
                    <FontAwesomeIcon icon={faXmark} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>No data available</td>
              </tr>
            )}
          </tbody>
        </Table>
      );
    }else if(category === 'invoice'){
        return (<>
            <DeleteSelectedItem closeModal = {setChangeModalShow} show = {changeModalshow} onHide = {handleChangeClose} journey = {selectedJourney} id = {selectedId} />
            <Table striped bordered hover>
              <thead>
                <tr>
                    <th># No</th>
                    <th>Date</th>
                    <th>Customer Name</th>
                    <th>Currency Type</th>
                    <th>Status</th> 
                    <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data?.map((item: any, index: any) => <tr>
                  <td>{index + 1 + (currentPage - 1) * recordsPerPage}</td>
                  <td>{item?.createdDate}</td>
                  <td>{item?.customerName}</td>
                  <td>{item?.currencyType}</td>
                  <td>{item?.invoieStatus}</td>
                   
                  <td>
                      <FontAwesomeIcon icon={faPenToSquare}  className='edit_icon' onClick={() => handleUpdateInvoice(item?.id)}/>
                      {/* <FontAwesomeIcon icon={faDownload} className='download_icon' onClick={() => handleDownloadInvoice(item?.id)}/> */}
                      <PDFDownloadLink document={<MyDoc pdfdata = {item} />} fileName={item?.customerName}>
                      {({ loading }) =>
                          loading ? 'Loading...' : <FontAwesomeIcon icon={faDownload} />
                      }
                      </PDFDownloadLink>
                      <FontAwesomeIcon icon={faXmark}  className='delete_icon' onClick={() => handleDelteInvoice(item?.id)}/>
                  </td>
              </tr>)
                ) : (
                  <tr>
                    <td colSpan={8}>No data available</td>
                  </tr>
                )}
              </tbody>
            </Table>
            </>)
    }else if(category === 'customer'){
        return (<>
            <ViewMyCustomer show = {viewCustomer} onHide = {handleViewClose} data = {viewCustomerData} />
            <DeleteSelectedItem closeModal = {setChangeModalShow} show = {changeModalshow} onHide = {handleChangeClose} journey = {selectedCustomerJourney} id = {selectedCustomerId} />
            <CreateNewCustomer closeModal = {setCreateNewCustomerModalShow} show = {createNewCustomerModalShow} onHide={() => setCreateNewCustomerModalShow(false)} />
            <Table striped bordered hover>
              <thead>
                <tr>
                    <th> # No</th>
                    <th>Created Date</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data?.map((item: any, index: any) =>  <tr key={index + 1}>
                  <td>{index + 1 + (currentPage - 1) * recordsPerPage}</td>
                  <td>{item?.createdDate}</td>
                  <td>{item.customerFirstName} {item.customerLastName} </td>
                  <td>{item.customerEmail}</td>
                  <td>{item.customerMobile}</td> 
                  <td>
                      <FontAwesomeIcon icon={faPenToSquare} onClick = {() => handleUpdateCustomer(item.id)}/>
                      <FontAwesomeIcon icon={faXmark} onClick = {() => handleDeleteCustomer("mycustomer",item.id)}/>
                      <FontAwesomeIcon icon={faEye} onClick = {() => viewHandler(item)}/>
                  </td>
                </tr>)
                ) : (
                  <tr>
                    <td colSpan={8}>No data available</td>
                  </tr>
                )}
              </tbody>
            </Table>
            </>)
    }
    // Future categories can be added here
    return <div>No category matched!</div>;
  };

  return (
    <div className="container mt-4">
      {renderTableContent()}
      {renderPagination()}
    </div>
  );
};

export default DynamicPagination;
