import User from '../models/user.model.js';

const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export default { getUserByEmail };
