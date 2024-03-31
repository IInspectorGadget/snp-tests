const checkInput = (value, isRequired, setError, setDirty) => {
  if (!value.length && isRequired) {
    setError("Поле не может быть пустым");
    setDirty(true);
    return false;
  } else {
    setDirty(false);
    return true;
  }
};

export default checkInput;
