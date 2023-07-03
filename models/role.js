const {Schema, model} = require("mongoose");

const RoleSchema = Schema({
    role: {
        type: String,
        required: [ true, 'EL rol es obligatorio']
    }
    
})

module.exports = model( 'Role', RoleSchema)