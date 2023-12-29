// import "./CommunicationHistoryList.css"
import React, { useState, useContext, useEffect } from 'react';
import AuthContext from "../context/AuthContext";
import Pagination from './Pagination2';
import useAxios from "../utils/useAxios";

const CommunicationHistoryList = ({stopped, stateN, setStateN, setStopped, historyId, setHistoryId}) => {
  const { user } = useContext(AuthContext);
  const itemsPerPage = 5;
  const pagesToShow = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageWindow, setCurrentPageWindow] = useState(1);
  const [historys, setHistorys] = useState([]);

  const tempMax = 100;

  // todo : get data from "learn/communication/history"
  useEffect(() => {
    // API request to retrieve data appropriate for the current page
    const offset = (currentPageWindow - 1) * itemsPerPage;
  
    const fetchHistoryList = async () => {
    //   try {
    //     // back 에서 보니까 GET method 에서 limit, offset 받는 곳이 없음.... 뭐한걸까????
    //     // limit 이후의 것을 back 에서 가져오는 것이 없음..
    //     // 계속 전체 post 가져옴.
    //     // const response = await api.get(`http://127.0.0.1:8000/noticeboard/posts/?limit=${itemsPerPage}&offset=${offset}`);
    //     const response = await api.get(`http://127.0.0.1:8000/learn/communication/history/`);
    //     if (response.status === 200 && Array.isArray(response.data)) {
    //       // Reverse the order of the data
    //       const reversedPosts = [...response.data].reverse();
    //       setPosts(reversedPosts);
    //     } else {
    //       console.error('Data is not an array', response.data);
    //     }
    //   } catch (error) {
    //     console.error('Error retrieving post', error);
    //   }
    };
    const tempData = Array.from({ length: tempMax }, (_, index) => ({ history_id: offset + index + 1, history_title: `Title_${offset + index + 1}` }));
    setHistorys(tempData);
    fetchHistoryList();
  }, []); 

  const currentItems = historys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    console.log(currentPage)
  }, [currentPage]);

  const goToHistory = (history_id) => {
    setStateN(1);
    setHistoryId(history_id);
    console.log("Clicked goToHistory");
  };


  return (
    <div className='comm_history_wrapper'>
      {currentItems.map(({ history_id, history_title }) => (
        <div className='comm_history_element' key={history_id}><a onClick={() => {goToHistory(history_id)}}>{history_title}</a></div>
      ))}
      <Pagination
        totalItems={historys.length}
        itemsPerPage={itemsPerPage}
        pagesToShow = {pagesToShow}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default CommunicationHistoryList;