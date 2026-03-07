module.exports = {
  extends: ["react-app", "react-app/jest"],
  rules: {
    "no-unused-vars": "warn",
    "no-self-assign": "warn",
    "no-dupe-keys": "warn",
    "no-useless-concat": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-no-comment-textnodes": "warn"
  }
};
