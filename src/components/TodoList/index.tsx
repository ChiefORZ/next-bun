import { ITodo } from '../../definitions';
import Todo from '../Todo';

interface ITodoListProps {
  todos: ITodo[];
  toggleTodo: (id: number) => void;
  toggleToDoDelete: (id: number) => void;
}

const TodoList = ({ todos, toggleTodo, toggleToDoDelete }: ITodoListProps) => {
  return todos
    ?.sort((a, b) => a.id - b.id)
    .map((todo) => (
      <Todo
        todo={todo}
        key={`todo-${todo.id}`}
        toggleTodo={toggleTodo}
        toggleToDoDelete={toggleToDoDelete}
      />
    ));
};

export default TodoList;
