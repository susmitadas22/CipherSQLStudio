import React from 'react';
import './AssignmentCard.scss';

const AssignmentCard = ({ assignment, onClick }) => {
  const getDifficultyClass = (difficulty) => {
    return `assignment-card__difficulty--${difficulty.toLowerCase()}`;
  };

  return (
    <div className="assignment-card" onClick={onClick}>
      <div className="assignment-card__header">
        <h3 className="assignment-card__title">{assignment.title}</h3>
        <span className={`assignment-card__difficulty ${getDifficultyClass(assignment.difficulty)}`}>
          {assignment.difficulty}
        </span>
      </div>
      
      <p className="assignment-card__description">{assignment.description}</p>
      
      {assignment.tags && assignment.tags.length > 0 && (
        <div className="assignment-card__tags">
          {assignment.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="assignment-card__tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <button className="assignment-card__button">
        Start Assignment →
      </button>
    </div>
  );
};

export default AssignmentCard;
