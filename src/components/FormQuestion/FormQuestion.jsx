import cx from 'classnames';



import s from './FormQuestion.module.scss';

const FormQuestion = ({className}) => {
    return <div className={cx(s.root, className)}></div>;
};

export default FormQuestion;