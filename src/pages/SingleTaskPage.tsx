import React from 'react'
import { useParams } from 'react-router-dom';

const SingleTaskPage = () => {
    const { taskId } = useParams();

  return (
    <div>{taskId}</div>
  )
}

export default SingleTaskPage