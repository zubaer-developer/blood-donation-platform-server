const getUserDocument = ({
  name,
  email,
  avatar,
  bloodGroup,
  district,
  upazila,
  password,
}) => {
  return {
    name,
    email,
    password,
    avatar: avatar || "https://i.ibb.co.com/23Kdk9qQ/20549.jpg",
    bloodGroup,
    district,
    upazila,
    role: "donor",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

module.exports = {
  getUserDocument,
};
