import { useTask } from '@/queries/task.query';
import { useParams } from 'react-router-dom';

const SingleTaskPage = () => {
  const { taskId } = useParams();
  if (!taskId) return;
  const { data: task, isFetching: isTaskLoading, isError } = useTask(taskId);

  return (
    <div className="py-4">
      <div className="container">
        <h1>Title: {task?.title}</h1>
        <p>{task?.content}</p>
      </div>
    </div>
  );
};

export default SingleTaskPage;
