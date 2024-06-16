import { AuthContext } from '@/context/AuthContext';
import { testPrivate } from '@/services/test.service';
import React, { useContext, useEffect, useState } from 'react';

const Board: React.FC = () => {
  const [data, setData] = useState('data');
  useEffect(() => {
    const fetchData = async () => {
      const data = await testPrivate();
    };
    fetchData();
  }, []);
  return <div>{data}</div>;
};

export default Board;
