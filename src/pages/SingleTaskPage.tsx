import { useTask } from '@/queries/task.query';
import { useParams } from 'react-router-dom';

const SingleTaskPage = () => {
  const { taskId } = useParams();
  if (!taskId) return;
  const { data: task, isFetching:isTaskLoading, isError } = useTask(taskId);
  
  return <div>{task?.title}</div>;
};

export default SingleTaskPage;
