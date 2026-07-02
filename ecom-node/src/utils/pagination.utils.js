const paginate = (pageNumber = 0, pageSize = 50, sortBy = '_id', sortOrder = 'asc') => {
  const skip = pageNumber * pageSize;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  return { skip, limit: parseInt(pageSize), sort };
};

const buildPageResponse = (data, total, pageNumber, pageSize) => {
  const totalPages = Math.ceil(total / pageSize);
  return {
    content: data,
    pageNumber: parseInt(pageNumber),
    pageSize: parseInt(pageSize),
    totalElements: total,
    totalPages,
    lastPage: parseInt(pageNumber) >= totalPages - 1,
  };
};

module.exports = { paginate, buildPageResponse };
