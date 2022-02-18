export const numberValidation = (val) => {
  const trimmedVal = val.trim()
  return val && Number(val) === parseInt(val)
}

export const notEmptyValidation = (val = '') => {
  const trimmedVal = val.trim()
  return !!trimmedVal
}
