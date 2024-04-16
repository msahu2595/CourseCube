import {createRef} from 'react';

const downloaderRef = createRef(null);

const addDownloadTask = task => {
  if (Array.isArray(downloaderRef.current)) {
    downloaderRef.current.push(task);
  }
};

const removeDownloadTask = taskId => {
  if (Array.isArray(downloaderRef.current)) {
    downloaderRef.current = downloaderRef.current.filter(
      task => task.id !== taskId,
    );
  }
};

export {addDownloadTask, removeDownloadTask};

export default downloaderRef;
