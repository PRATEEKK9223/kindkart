module.exports = {
  // example helper that can be expanded
  truncate: (text, n=120) => text && text.length > n ? text.slice(0, n-1) + '…' : text
};
