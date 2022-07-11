import React from 'react';
import LoadingOverlay from 'src/components/LoadingOverlay';

import Spinner from '../components/Spinner';
import TodoList from '../components/TodoList';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const tasksQuery = trpc.useQuery(['task.all']);
  const addTaskMutation = trpc.useMutation('task.add');
  const updateTaskMutation = trpc.useMutation('task.edit');
  const removeTaskMutation = trpc.useMutation('task.delete');

  const handleAddTodo = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    addTaskMutation.mutate(
      {
        name: evt.target.message.value,
      },
      {
        onSuccess: async () => {
          evt.target.message.value = '';
          await utils.invalidateQueries(['task.all']);
        },
      }
    );
  };

  const handleToggleTodo = (id: number) => {
    const task = tasksQuery.data.find((t) => t.id === id);
    updateTaskMutation.mutate(
      {
        id,
        data: {
          done: !task.done,
        },
      },
      {
        onSuccess: async () => {
          await utils.invalidateQueries(['task.all']);
        },
      }
    );
  };

  const handleRemoveTodo = (id: number) => {
    removeTaskMutation.mutate(
      { id },
      {
        onSuccess: async () => {
          await utils.invalidateQueries(['task.all']);
        },
      }
    );
  };

  return (
    <div className="flex h-screen justify-center items-center ">
      <div className="w-1/2 text-center rounded p-3 shadow-2xl shadow-gray-500">
        <form onSubmit={handleAddTodo} className="flex">
          <input
            className="w-full p-1 rounded border border-gray-400 outline-green-500/75 hover:border-gray-800"
            placeholder="What do you want to add?"
            name="message"
            autoComplete="off"
          />
          <button className="bg-green-500 w-24 rounded p-1 ml-1" type="submit">
            Add
          </button>
        </form>
        {tasksQuery.isLoading ? (
          <Spinner />
        ) : (
          <div className="relative">
            {tasksQuery.isFetching ||
            addTaskMutation.isLoading ||
            updateTaskMutation.isLoading ||
            removeTaskMutation.isLoading ? (
              <LoadingOverlay />
            ) : null}
            <TodoList
              todos={tasksQuery.data}
              toggleTodo={handleToggleTodo}
              toggleToDoDelete={handleRemoveTodo}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
