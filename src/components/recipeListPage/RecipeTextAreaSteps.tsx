import { useState, type FC } from 'react';
import type { IStep } from '../../types/types';
import { generatedId } from '../../function/generatedId';

interface StepsProps {
  steps: IStep[];
  setSteps: (steps: IStep[]) => void;
}

export const TextAreaSteps: FC<StepsProps> = ({ steps, setSteps }) => {
  const [title, setTitle] = useState('');

  const addNewSteps = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    const newSteps: IStep = {
      id: generatedId(),
      title: title,
    };
    if (!title) return;

    setSteps([...steps, newSteps]);
    setTitle('');
  };

  const handleUpdateStep = (id: string, newTitle: string) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, title: newTitle } : step)));
  };

  const handleRemove = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  return (
    <>
      <h3>Пошаговый рецепт</h3>
      <ul className="stepsList">
        {steps?.map((step) => (
          <li key={step.id}>
            <textarea
              className="stepEditArea"
              id={step.id}
              value={step.title}
              onChange={(e) => handleUpdateStep(step.id, e.target.value)}
            ></textarea>
            <button className="btn btnSteps" onClick={() => handleRemove(step.id)}>
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </li>
        ))}

        <li>
          <textarea
            className="newStepArea"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          ></textarea>
          <button className="btn btnSteps" onClick={addNewSteps}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </li>
      </ul>
    </>
  );
};
