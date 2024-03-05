import mongoose from 'mongoose';

const RoleSchema = mongoose.Schema({
    role:{
        type: String,
        required: [true, 'Role is obligatory']
    }
});

export default mongoose.model('Role', RoleSchema);